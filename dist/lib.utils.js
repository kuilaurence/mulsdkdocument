"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.connect = exports.executeContract = exports.getAllowance = exports.approveToken = exports.getDecimal = exports.transferFrom = exports.transfer = exports.getBalance = exports.findToken = exports.sleep = exports.getDeadLine = exports.div = exports.mul = exports.sub = exports.add = exports.minusBigNumber = exports.calculateMultiplied = exports.calculatePercentage = exports.convertNormalToBigNumber = exports.convertBigNumberToNormal = exports.wallet = void 0;
const lib_abi_1 = require("./lib_abi");
const ethers_1 = require("ethers");
const bignumber_js_1 = require("bignumber.js");
const lib_config_1 = require("./lib_config");
bignumber_js_1.BigNumber.config({ ROUNDING_MODE: 1 });
bignumber_js_1.BigNumber.config({ EXPONENTIAL_AT: 1e+9 });
/**
 * BigNumber To Normal
 * @param number
 * @param decimals
 * @returns
 */
function convertBigNumberToNormal(number, decimals = 18) {
    let result = new bignumber_js_1.BigNumber(number).dividedBy(new bignumber_js_1.BigNumber(Math.pow(10, decimals)));
    return result.toFixed(10);
}
exports.convertBigNumberToNormal = convertBigNumberToNormal;
/**
 * Normal To BigNumber
 * @param number
 * @param decimals
 * @param fix
 * @returns
 */
function convertNormalToBigNumber(number, decimals = 18, fix = 0) {
    return new bignumber_js_1.BigNumber(number).multipliedBy(new bignumber_js_1.BigNumber(Math.pow(10, decimals))).minus(fix).toFixed(0);
}
exports.convertNormalToBigNumber = convertNormalToBigNumber;
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
function calculatePercentage(numerator, denominator) {
    return new bignumber_js_1.BigNumber(numerator)
        .dividedBy(new bignumber_js_1.BigNumber(denominator))
        .toFixed();
}
exports.calculatePercentage = calculatePercentage;
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function calculateMultiplied(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).multipliedBy(new bignumber_js_1.BigNumber(number2)).toFixed(0);
}
exports.calculateMultiplied = calculateMultiplied;
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function minusBigNumber(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).minus(new bignumber_js_1.BigNumber(number2)).toFixed(0);
}
exports.minusBigNumber = minusBigNumber;
/**
 * x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function add(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).plus(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.add = add;
/**
 * x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function sub(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).minus(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.sub = sub;
/**
 * x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function mul(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).times(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.mul = mul;
/**
 * x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
function div(number1, number2) {
    return new bignumber_js_1.BigNumber(number1).div(new bignumber_js_1.BigNumber(number2)).toFixed(10);
}
exports.div = div;
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
function getDeadLine(delay) {
    return Math.floor(new Date().getTime() / 1000 + 60 * delay);
}
exports.getDeadLine = getDeadLine;
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
exports.sleep = sleep;
/**
 * Find the key by value
 * @param obj
 * @param value
 * @param compare
 * @returns
 */
function findToken(obj, value, compare = (a, b) => a.toLowerCase() === b.toLowerCase()) {
    return Object.keys(obj).find((k) => compare(obj[k], value));
}
exports.findToken = findToken;
/**
 * get token balance
 * @param token_address
 * @returns
 */
async function getBalance(token_address) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let balance = (await tokenContract.callStatic.balanceOf(lib_config_1.userInfo.account)).toString();
    return convertBigNumberToNormal(balance, await getDecimal(token_address));
}
exports.getBalance = getBalance;
/**
 * transfer
 * @param token_address
 * @param to_address
 * @param amount
 * @param callback
 */
async function transfer(token_address, to_address, amount, callback) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transfer", 0, [to_address, bigAmount], callback);
}
exports.transfer = transfer;
/**
 * transfer from
 * @param token_address
 * @param from_address
 * @param to_address
 * @param amount
 * @param callback
 */
async function transferFrom(token_address, from_address, to_address, amount, callback) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let bigAmount = convertNormalToBigNumber(amount, await getDecimal(token_address));
    executeContract(tokenContract, "transferFrom", 0, [from_address, to_address, bigAmount], callback);
}
exports.transferFrom = transferFrom;
/**
 * get token decimal
 * @param token_address
 * @returns
 */
async function getDecimal(token_address) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let decimal = await tokenContract.callStatic.decimals();
    return decimal;
}
exports.getDecimal = getDecimal;
/**
 * approve Token
 * @param token_address
 * @param destina_address
 * @param callback
 */
async function approveToken(token_address, destina_address, callback) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let bigAmount = convertNormalToBigNumber("500000000000", await getDecimal(token_address));
    executeContract(tokenContract, "approve", 0, [destina_address, bigAmount], callback);
}
exports.approveToken = approveToken;
/**
 * get token allowance
 * @param token_address
 * @param destina_address
 * @returns
 */
async function getAllowance(token_address, destina_address) {
    let tokenContract = new ethers_1.ethers.Contract(token_address, lib_abi_1.ERC20, exports.wallet);
    let allowance = (await tokenContract.callStatic.allowance(lib_config_1.userInfo.account, destina_address)).toString();
    return convertBigNumberToNormal(allowance, await getDecimal(token_address));
}
exports.getAllowance = getAllowance;
/**
 * execute contract
 * @param contract
 * @param methodName
 * @param value
 * @param params
 * @param callback
 */
async function executeContract(contract, methodName, value, params, callback) {
    try {
        let tx = await contract[methodName](...params);
        let receipt = await tx.wait(2);
        callback(receipt.status, tx.hash);
    }
    catch (e) {
        callback(-1, Object.assign(Object.assign({}, JSON.parse(e.error.error.body).error), { code: -1 }));
    }
}
exports.executeContract = executeContract;
/**
 * connect
 * @param privatekey
 * @param type
 * @returns
 */
async function connect(privatekey, type) {
    let amount = "";
    try {
        if (type === "Ethereum") {
            lib_config_1.userInfo.chainID = 1;
            lib_config_1.userInfo.chain = "Ethereum";
        }
        else if (type === "Playground") {
            lib_config_1.userInfo.chainID = 336;
            lib_config_1.userInfo.chain = "Playground";
        }
        let provider = new ethers_1.ethers.providers.JsonRpcProvider(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].rpcnetwork);
        exports.wallet = new ethers_1.ethers.Wallet(privatekey, provider);
        lib_config_1.userInfo.account = exports.wallet.address.toLowerCase();
        let balance = await provider.getBalance(lib_config_1.userInfo.account);
        amount = ethers_1.ethers.utils.formatEther(balance);
    }
    catch (e) {
        console.log(e);
    }
    return {
        account: lib_config_1.userInfo.account,
        chain: lib_config_1.userInfo.chain,
        amountETH: amount
    };
}
exports.connect = connect;
/**
 * exit
 * @returns
 */
function logout() {
    lib_config_1.userInfo.account = "";
    lib_config_1.userInfo.chainID = 1;
    lib_config_1.userInfo.chain = "Ethereum";
    return {
        account: "",
        chainID: 1,
        chain: "",
        message: "logout",
    };
}
exports.logout = logout;
//# sourceMappingURL=lib.utils.js.map