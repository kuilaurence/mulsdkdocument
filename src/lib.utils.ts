import { ERC20 } from "./lib_abi";
import { Contract, ethers } from "ethers";
import { BigNumber } from "bignumber.js";
import { userInfo, ContractAddress } from "./lib_config";

export var wallet: ethers.Wallet;
BigNumber.config({ ROUNDING_MODE: 1 });
BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
/**
 * BigNumber To Normal
 * @param number 
 * @param decimals
 * @returns 
 */
export function convertBigNumberToNormal(number: string, decimals = 18) {
  let result = new BigNumber(number).dividedBy(new BigNumber(Math.pow(10, decimals)));
  return result.toFixed(10);
}
/**
 * Normal To BigNumber
 * @param number 
 * @param decimals 
 * @param fix 
 * @returns 
 */
export function convertNormalToBigNumber(number: string, decimals = 18, fix = 0) {
  return new BigNumber(number).multipliedBy(new BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
export function calculatePercentage(numerator: string, denominator: string) {
  return new BigNumber(numerator)
    .dividedBy(new BigNumber(denominator))
    .toFixed();
}
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function calculateMultiplied(number1: string, number2: string) {
  return new BigNumber(number1).multipliedBy(new BigNumber(number2)).toFixed(0);
}
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function minusBigNumber(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(0);
}
/**
 * x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function add(number1: string, number2: string) {
  return new BigNumber(number1).plus(new BigNumber(number2)).toFixed(10);
}
/**
 * x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function sub(number1: string, number2: string) {
  return new BigNumber(number1).minus(new BigNumber(number2)).toFixed(10);
}
/**
 * x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function mul(number1: string, number2: string) {
  return new BigNumber(number1).times(new BigNumber(number2)).toFixed(10);
}
/**
 * x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export function div(number1: string, number2: string) {
  return new BigNumber(number1).div(new BigNumber(number2)).toFixed(10);
}
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
export function getDeadLine(delay: number) {
  return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

interface DictObject {
  [key: string]: string;
}
/**
 * Find the key by value
 * @param obj 
 * @param value
 * @param compare 
 * @returns 
 */
export function findToken(obj: DictObject, value: string, compare = (a: string, b: string) => a.toLowerCase() === b.toLowerCase()) {
  return Object.keys(obj).find((k) => compare(obj[k], value));
}
/**
 * get token balance
 * @param token_address 
 * @returns 
 */
export async function getBalance(token_address: string) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let balance = (await tokenContract.callStatic.balanceOf(userInfo.account)).toString();
  return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
/**
 * transfer
 * @param token_address 
 * @param to_address 
 * @param amount 
 * @param callback 
 */
export async function transfer(token_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
}
/**
 * transfer from
 * @param token_address 
 * @param from_address 
 * @param to_address 
 * @param amount 
 * @param callback 
 */
export async function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}
/**
 * get token decimal
 * @param token_address 
 * @returns 
 */
export async function getDecimal(token_address: string) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let decimal = await tokenContract.callStatic.decimals();
  return decimal;
}
/**
 * approve Token
 * @param token_address 
 * @param destina_address 
 * @param callback 
 */
export async function approveToken(token_address: string, destina_address: string, callback: (code: number, hash: string) => void) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal(token_address));
  executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
}
/**
 * get token allowance
 * @param token_address 
 * @param destina_address 
 * @returns 
 */
export async function getAllowance(token_address: string, destina_address: string) {
  let tokenContract = new ethers.Contract(token_address, ERC20, wallet);
  let allowance = (await tokenContract.callStatic.allowance(userInfo.account, destina_address)).toString();
  return convertBigNumberToNormal(allowance, await getDecimal(token_address));
}
/**
 * execute contract
 * @param contract 
 * @param methodName 
 * @param value 
 * @param params 
 * @param callback 
 */
export async function executeContract(contract: Contract, methodName: string, value: number, params: any, callback: (code: number, hash: string) => void) {
  try {
    let tx = await contract[methodName](...params)
    let receipt = await tx.wait(2);
    callback(receipt.status, tx.hash);
  } catch (e) {
    callback(-1, {
      ...JSON.parse(e.error.error.body).error,
      code: -1
    })
  }
}

/**
 * connect
 * @param privatekey 
 * @param type 
 * @returns 
 */
export async function connect(privatekey: string, type: "Ethereum" | "Playground") {
  let amount = "";
  try {
    if (type === "Ethereum") {
      userInfo.chainID = 1;
      userInfo.chain = "Ethereum";
    } else if (type === "Playground") {
      userInfo.chainID = 336;
      userInfo.chain = "Playground";
    }
    let provider = new ethers.providers.JsonRpcProvider(ContractAddress[userInfo.chainID].rpcnetwork);
    wallet = new ethers.Wallet(privatekey, provider);
    userInfo.account = wallet.address.toLowerCase();
    let balance = await provider.getBalance(userInfo.account);
    amount = ethers.utils.formatEther(balance);
  } catch (e) {
    console.log(e);
  }
  return {
    account: userInfo.account,
    chain: userInfo.chain,
    amountETH: amount
  };
}
/**
 * exit
 * @returns 
 */
export function logout() {
  userInfo.account = "";
  userInfo.chainID = 1;
  userInfo.chain = "Ethereum";
  return {
    account: "",
    chainID: 1,
    chain: "",
    message: "logout",
  }
}