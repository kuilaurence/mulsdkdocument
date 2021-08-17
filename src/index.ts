import { ethers } from "ethers";
import { userInfo, tokenAddres, ContractAddress } from "./lib_config";
import { ERC20, MULBANK, MULWORK, UNISWAPV3POOL, UNISWAPV3STRATEGY } from "./lib_abi";
export { add, sub, mul, div, sleep, logout, connect, getBalance, wallet } from "./lib.utils"
export { getinvestList, getCreatStrategyinfo, getDayTvl, getGPRankList, getPoolHourPrices, getPoolPrice, getPositionInfo, getSingleStrategy, getTokenList, strategyEntities, riskManagement, performance, report } from "./graphql";
import { getBalance, findToken, getDecimal, convertBigNumberToNormal, convertNormalToBigNumber, executeContract, getAllowance as _getAllowance, approveToken as _approveToken, wallet } from "./lib.utils";
export { getBalance_OKEX, trade, init } from "./ok";
/**
 * get token address
 * @param token_symbol 
 * @returns 
 */
export function getTokenAddress(token_symbol: string) {
  return tokenAddres[userInfo.chainID][token_symbol as keyof typeof tokenAddres[1]];
}
/**
 * get token symbol
 * @param token_address 
 * @returns 
 */
export function getTokenSymbol(token_address: string) {
  let symbol = findToken(tokenAddres[userInfo.chainID], token_address);
  return symbol || "unknow";
}
/**
 * get token allowance
 * @param token_address 
 * @param type 
 * @returns 
 */
export async function getAllowance(token_address: string, type: "deposit" | "invest") {
  let destina_address = ContractAddress[userInfo.chainID].mulBank;
  if (type === "deposit") {
  } else {
    destina_address = ContractAddress[userInfo.chainID].v3strategy;
  }
  return await _getAllowance(token_address, destina_address);
}
/**
 * pool information
 * @param token_address 
 * @returns 
 */
export async function poolInfo(token_address: string) {
  let decimal = await getDecimal(token_address);
  let mulBankContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulBank, MULBANK, wallet);
  let _totalShare = (await mulBankContract.callStatic.getTotalShare(token_address)).toString();
  let totalShare = convertBigNumberToNormal(_totalShare, decimal);

  let res = await mulBankContract.callStatic.poolInfo(token_address);
  let tokenContract = new ethers.Contract(res.shareToken, ERC20, wallet);

  let _shareTokenTotalSupply = (await tokenContract.callStatic.totalSupply()).toString();
  let shareTokenTotalSupply = convertBigNumberToNormal(_shareTokenTotalSupply, decimal);

  let shareTokenBalance = await getBalance(res.shareToken);

  let reward = '0';
  if (+shareTokenTotalSupply <= 0) {
    reward = '0';
  } else {
    reward = (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8);
  }
  return {
    data: {
      supplyToken: res.supplyToken,
      shareToken: res.shareToken,
      shareTokenBalance: shareTokenBalance,
      reward: reward,
      totalBorrow: convertBigNumberToNormal((res.totalBorrow).toString(), decimal),
      loss: convertBigNumberToNormal((res.loss).toString(), decimal),
      totalDeposit: convertBigNumberToNormal((res.totalDeposit).toString(), decimal),
    }
  }
}
/**
 * get GP information
 * @returns 
 */
export async function workers() {
  let mulWorkContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulWork, MULWORK, wallet);
  let res = await mulWorkContract.callStatic.workers(userInfo.account);
  return {
    data: {
      createTime: res.createTime,
      created: res.created,
      lastWorkTime: res.lastWorkTime,
      power: res.power,
      totalProfit: res.totalProfit,
      workerId: res.workerId
    }
  }
}
/**
 * current fee
 * @param sid 
 * @returns 
 */
export async function collect(sid: string) {
  let v3strategyContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3strategy, UNISWAPV3STRATEGY, wallet);
  let res = await v3strategyContract.callStatic.collect(+sid);
  return {
    data: {
      fee0: convertBigNumberToNormal((res.fee0).toString(), 6),
      fee1: convertBigNumberToNormal((res.fee1).toString(), 18),
    }
  }
}
/**
 * 
 * @param token0_address 
 * @param token1_address 
 * @param ratio 
 * @returns 
 */
function getTick(token0_address: string, token1_address: string, price: number) {
  let space = 60;
  if (Number(token0_address) > Number(token1_address)) {
    let temp = token0_address;
    token0_address = token1_address;
    token1_address = temp;
  }
  let ans = Math.floor(Math.log2(1 / price * 1e12) / Math.log2(1.0001));
  if (Math.log2(1 / price * 1e12) > 0) {
    if (ans % space >= space / 2) {
      ans = ans + space - ans % space;
    } else {
      ans = ans - ans % space;
    }
    return ans.toString();
  }
  else {
    return (ans - (200 - Math.abs(ans) % space)).toString();
  }
}
/**
 * get pool price
 * @param token0_address 
 * @param token1_address 
 * @returns 
 */
export async function getSqrtPrice(token0_address: string, token1_address: string) {
  if (Number(token0_address) > Number(token1_address)) {
    [token0_address, token1_address] = [token1_address, token0_address];
  }
  let v3poolContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3pool, UNISWAPV3POOL, wallet);
  let res = await v3poolContract.callStatic.slot0();
  let temp = Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2);
  return 1 / temp * 1e12;
}
/**
 * get GP remain information 
 * @param token0_address 
 * @param token1_address 
 * @returns 
 */
export async function getRemainQuota(token0_address: string, token1_address: string) {
  let mulWorkContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulWork, MULWORK, wallet);
  let remain0 = (await mulWorkContract.callStatic.getRemainQuota(userInfo.account, token0_address)).toString();
  let remain1 = (await mulWorkContract.callStatic.getRemainQuota(userInfo.account, token1_address)).toString();
  return {
    data: {
      token0: token0_address,
      symbol0: getTokenSymbol(token0_address),
      remain0: convertBigNumberToNormal(remain0, await getDecimal(token0_address)),
      token1: token1_address,
      symbol1: getTokenSymbol(token1_address),
      remain1: convertBigNumberToNormal(remain1, await getDecimal(token1_address)),
    }
  }
}
/**
 *calculate token amount  sqrtPrice = sqrt(b/a) * 2^96 = sqrt(1.0001^tick) * 2^96
 * @param type 
 * @param token0_address 
 * @param token1_address 
 * @param priceLower 
 * @param priceCurrent 
 * @param priceUpper 
 * @param amount 
 * @returns c * b / (c - b) * (b - a);      c a  change position
 */
export async function getTokenValue(type: "token0" | "token1", token0_address: string, token1_address: string, priceLower: number, priceCurrent: number, priceUpper: number, amount: number) {
  let v3poolContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3pool, UNISWAPV3POOL, wallet);
  let res = await v3poolContract.callStatic.slot0();
  let resultAmount = 0;
  let tickLower = getTick(token0_address, token1_address, priceUpper);
  let tickUpper = getTick(token0_address, token1_address, priceLower);
  let sqrtPricelower = Math.sqrt(Math.pow(1.0001, +tickLower))
  let sqrtPriceupper = Math.sqrt(Math.pow(1.0001, +tickUpper))
  let a = sqrtPricelower;
  let b = res.sqrtPriceX96 / (Math.pow(2, 96));
  let c = sqrtPriceupper;

  if (type === "token0") {//USDT
    let temp = c * b / (c - b) * (b - a);
    resultAmount = temp / 1e12 * amount;
  } else {//ETH
    let temp = (c - b) / (b - a) / (b * c);
    resultAmount = temp * 1e12 * amount;
  }
  return { amount: resultAmount }
}
/**
 * Get the latest price of Tick
 * @param token0_address 
 * @param token1_address 
 * @param price 
 * @returns 
 */
export function getCloseToTickPrice(token0_address: string, token1_address: string, price: number) {
  let tick = getTick(token0_address, token1_address, price);
  return 1 / Math.pow(1.0001, +tick) * 1e12;
}
//---------------------------------------------------------------------------------------------------------
/**
 * approve token
 * @param token_address 
 * @param type 
 * @param callback 
 */
export async function approveToken(token_address: string, type: "deposit" | "invest", callback: (code: number, hash: string) => void) {
  let destina_address = ContractAddress[userInfo.chainID].mulBank;
  if (type === "deposit") {
  } else {
    destina_address = ContractAddress[userInfo.chainID].v3strategy;
  }
  _approveToken(token_address, destina_address, callback);
}
/**
 * deposit
 * @param token_address 
 * @param amount 
 * @param callback 
 */
export async function deposit(token_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let mulBankContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulBank, MULBANK, wallet);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
}
/**
 * withdraw
 * @param token_address 
 * @param amount 
 * @param callback 
 */
export async function withdraw(token_address: string, amount: string, callback: (code: number, hash: string) => void) {
  let mulBankContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulBank, MULBANK, wallet);
  let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
  executeContract(mulBankContract, "withdraw", 0, [token_address, bigAmount], callback);
}
/**
 * invest
 * @param token0_address 
 * @param token1_address 
 * @param fee 
 * @param amount0 
 * @param amount1 
 * @param leftPrice 
 * @param rightPrice 
 * @param callback 
 */
export async function invest(token0_address: string, token1_address: string, fee: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3strategy, UNISWAPV3STRATEGY, wallet);
  let tickLower = getTick(token0_address, token1_address, +leftPrice);
  let tickUpper = getTick(token0_address, token1_address, +rightPrice);
  if (+tickLower > +tickUpper) {
    [tickLower, tickUpper] = [tickUpper, tickLower];
  }
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
  executeContract(v3strategyContract, "invest", 0, [
    {
      "token0": token0_address,
      "token1": token1_address,
      "fee": fee,
      "amount0Desired": bigAmount0,
      "amount1Desired": bigAmount1,
      "tickLower": tickLower,
      "tickUpper": tickUpper
    }
  ], callback);
}
/**
 * addInvest
 * @param token0_address 
 * @param token1_address 
 * @param id 
 * @param amount0 
 * @param amount1 
 * @param callback 
 */
export async function addInvest(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3strategy, UNISWAPV3STRATEGY, wallet);
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
  executeContract(v3strategyContract, "add", 0, [id, bigAmount0, bigAmount1], callback);
}
/**
 * switching
 * @param token0_address 
 * @param token1_address 
 * @param id 
 * @param amount0 
 * @param amount1 
 * @param leftPrice 
 * @param rightPrice 
 * @param hedge 
 * @param callback 
 */
export async function switching(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, hedge: boolean, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3strategy, UNISWAPV3STRATEGY, wallet);
  let tickLower = getTick(token0_address, token1_address, +leftPrice);
  let tickUpper = getTick(token0_address, token1_address, +rightPrice);
  if (+tickLower > +tickUpper) {
    [tickLower, tickUpper] = [tickUpper, tickLower];
  }
  let bigAmount0 = convertNormalToBigNumber(amount0, await getDecimal(token0_address));
  let bigAmount1 = convertNormalToBigNumber(amount1, await getDecimal(token1_address));
  executeContract(v3strategyContract, "switching", 0, [id, {
    tickLower: tickLower,
    tickUpper: tickUpper,
    amount0Desired: bigAmount0,
    amount1Desired: bigAmount1,
  }, hedge], callback);
}
/**
 * divest
 * @param id 
 * @param isclose 
 * @param callback 
 */
export function divest(id: string, isclose: boolean, callback: (code: number, hash: string) => void) {
  let v3strategyContract = new ethers.Contract(ContractAddress[userInfo.chainID].v3strategy, UNISWAPV3STRATEGY, wallet);
  executeContract(v3strategyContract, "divest", 0, [id, isclose], callback);
}
/**
 * create GP account
 * @param callback 
 */
export function createAccount(callback: (code: number, hash: string) => void) {
  let mulWorkContract = new ethers.Contract(ContractAddress[userInfo.chainID].mulWork, MULWORK, wallet);
  executeContract(mulWorkContract, "createAccount", 0, [], callback);
}