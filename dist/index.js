"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAccount = exports.divest = exports.switching = exports.addInvest = exports.invest = exports.withdraw = exports.deposit = exports.approveToken = exports.getCloseToTickPrice = exports.getTokenValue = exports.getRemainQuota = exports.getSqrtPrice = exports.collect = exports.workers = exports.poolInfo = exports.getAllowance = exports.getTokenSymbol = exports.getTokenAddress = exports.init = exports.trade = exports.getBalance_OKEX = exports.report = exports.performance = exports.riskManagement = exports.strategyEntities = exports.getTokenList = exports.getSingleStrategy = exports.getPositionInfo = exports.getPoolPrice = exports.getPoolHourPrices = exports.getGPRankList = exports.getDayTvl = exports.getCreatStrategyinfo = exports.getinvestList = exports.wallet = exports.getBalance = exports.connect = exports.logout = exports.sleep = exports.div = exports.mul = exports.sub = exports.add = void 0;
const ethers_1 = require("ethers");
const lib_config_1 = require("./lib_config");
const lib_abi_1 = require("./lib_abi");
var lib_utils_1 = require("./lib.utils");
Object.defineProperty(exports, "add", { enumerable: true, get: function () { return lib_utils_1.add; } });
Object.defineProperty(exports, "sub", { enumerable: true, get: function () { return lib_utils_1.sub; } });
Object.defineProperty(exports, "mul", { enumerable: true, get: function () { return lib_utils_1.mul; } });
Object.defineProperty(exports, "div", { enumerable: true, get: function () { return lib_utils_1.div; } });
Object.defineProperty(exports, "sleep", { enumerable: true, get: function () { return lib_utils_1.sleep; } });
Object.defineProperty(exports, "logout", { enumerable: true, get: function () { return lib_utils_1.logout; } });
Object.defineProperty(exports, "connect", { enumerable: true, get: function () { return lib_utils_1.connect; } });
Object.defineProperty(exports, "getBalance", { enumerable: true, get: function () { return lib_utils_1.getBalance; } });
Object.defineProperty(exports, "wallet", { enumerable: true, get: function () { return lib_utils_1.wallet; } });
var graphql_1 = require("./graphql");
Object.defineProperty(exports, "getinvestList", { enumerable: true, get: function () { return graphql_1.getinvestList; } });
Object.defineProperty(exports, "getCreatStrategyinfo", { enumerable: true, get: function () { return graphql_1.getCreatStrategyinfo; } });
Object.defineProperty(exports, "getDayTvl", { enumerable: true, get: function () { return graphql_1.getDayTvl; } });
Object.defineProperty(exports, "getGPRankList", { enumerable: true, get: function () { return graphql_1.getGPRankList; } });
Object.defineProperty(exports, "getPoolHourPrices", { enumerable: true, get: function () { return graphql_1.getPoolHourPrices; } });
Object.defineProperty(exports, "getPoolPrice", { enumerable: true, get: function () { return graphql_1.getPoolPrice; } });
Object.defineProperty(exports, "getPositionInfo", { enumerable: true, get: function () { return graphql_1.getPositionInfo; } });
Object.defineProperty(exports, "getSingleStrategy", { enumerable: true, get: function () { return graphql_1.getSingleStrategy; } });
Object.defineProperty(exports, "getTokenList", { enumerable: true, get: function () { return graphql_1.getTokenList; } });
Object.defineProperty(exports, "strategyEntities", { enumerable: true, get: function () { return graphql_1.strategyEntities; } });
Object.defineProperty(exports, "riskManagement", { enumerable: true, get: function () { return graphql_1.riskManagement; } });
Object.defineProperty(exports, "performance", { enumerable: true, get: function () { return graphql_1.performance; } });
Object.defineProperty(exports, "report", { enumerable: true, get: function () { return graphql_1.report; } });
const lib_utils_2 = require("./lib.utils");
var ok_1 = require("./ok");
Object.defineProperty(exports, "getBalance_OKEX", { enumerable: true, get: function () { return ok_1.getBalance_OKEX; } });
Object.defineProperty(exports, "trade", { enumerable: true, get: function () { return ok_1.trade; } });
Object.defineProperty(exports, "init", { enumerable: true, get: function () { return ok_1.init; } });
/**
 * get token address
 * @param token_symbol
 * @returns
 */
function getTokenAddress(token_symbol) {
    return lib_config_1.tokenAddres[lib_config_1.userInfo.chainID][token_symbol];
}
exports.getTokenAddress = getTokenAddress;
/**
 * get token symbol
 * @param token_address
 * @returns
 */
function getTokenSymbol(token_address) {
    let symbol = lib_utils_2.findToken(lib_config_1.tokenAddres[lib_config_1.userInfo.chainID], token_address);
    return symbol || "unknow";
}
exports.getTokenSymbol = getTokenSymbol;
/**
 * get token allowance
 * @param token_address
 * @param type
 * @returns
 */
async function getAllowance(token_address, type) {
    let destina_address = lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulBank;
    if (type === "deposit") {
    }
    else {
        destina_address = lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy;
    }
    return await lib_utils_2.getAllowance(token_address, destina_address);
}
exports.getAllowance = getAllowance;
/**
 * pool information
 * @param token_address
 * @returns
 */
async function poolInfo(token_address) {
    let decimal = await lib_utils_2.getDecimal(token_address);
    let mulBankContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulBank, lib_abi_1.MULBANK, lib_utils_2.wallet);
    let _totalShare = (await mulBankContract.callStatic.getTotalShare(token_address)).toString();
    let totalShare = lib_utils_2.convertBigNumberToNormal(_totalShare, decimal);
    let res = await mulBankContract.callStatic.poolInfo(token_address);
    let tokenContract = new ethers_1.ethers.Contract(res.shareToken, lib_abi_1.ERC20, lib_utils_2.wallet);
    let _shareTokenTotalSupply = (await tokenContract.callStatic.totalSupply()).toString();
    let shareTokenTotalSupply = lib_utils_2.convertBigNumberToNormal(_shareTokenTotalSupply, decimal);
    let shareTokenBalance = await lib_utils_2.getBalance(res.shareToken);
    let reward = '0';
    if (+shareTokenTotalSupply <= 0) {
        reward = '0';
    }
    else {
        reward = (+shareTokenBalance - (+shareTokenBalance * +totalShare / +shareTokenTotalSupply)).toFixed(8);
    }
    return {
        data: {
            supplyToken: res.supplyToken,
            shareToken: res.shareToken,
            shareTokenBalance: shareTokenBalance,
            reward: reward,
            totalBorrow: lib_utils_2.convertBigNumberToNormal((res.totalBorrow).toString(), decimal),
            loss: lib_utils_2.convertBigNumberToNormal((res.loss).toString(), decimal),
            totalDeposit: lib_utils_2.convertBigNumberToNormal((res.totalDeposit).toString(), decimal),
        }
    };
}
exports.poolInfo = poolInfo;
/**
 * get GP information
 * @returns
 */
async function workers() {
    let mulWorkContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulWork, lib_abi_1.MULWORK, lib_utils_2.wallet);
    let res = await mulWorkContract.callStatic.workers(lib_config_1.userInfo.account);
    return {
        data: {
            createTime: res.createTime,
            created: res.created,
            lastWorkTime: res.lastWorkTime,
            power: res.power,
            totalProfit: res.totalProfit,
            workerId: res.workerId
        }
    };
}
exports.workers = workers;
/**
 * current fee
 * @param sid
 * @returns
 */
async function collect(sid) {
    let v3strategyContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy, lib_abi_1.UNISWAPV3STRATEGY, lib_utils_2.wallet);
    let res = await v3strategyContract.callStatic.collect(+sid);
    return {
        data: {
            fee0: lib_utils_2.convertBigNumberToNormal((res.fee0).toString(), 6),
            fee1: lib_utils_2.convertBigNumberToNormal((res.fee1).toString(), 18),
        }
    };
}
exports.collect = collect;
/**
 *
 * @param token0_address
 * @param token1_address
 * @param ratio
 * @returns
 */
function getTick(token0_address, token1_address, price) {
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
        }
        else {
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
async function getSqrtPrice(token0_address, token1_address) {
    if (Number(token0_address) > Number(token1_address)) {
        [token0_address, token1_address] = [token1_address, token0_address];
    }
    let v3poolContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3pool, lib_abi_1.UNISWAPV3POOL, lib_utils_2.wallet);
    let res = await v3poolContract.callStatic.slot0();
    let temp = Math.pow(res.sqrtPriceX96 / (Math.pow(2, 96)), 2);
    return 1 / temp * 1e12;
}
exports.getSqrtPrice = getSqrtPrice;
/**
 * get GP remain information
 * @param token0_address
 * @param token1_address
 * @returns
 */
async function getRemainQuota(token0_address, token1_address) {
    let mulWorkContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulWork, lib_abi_1.MULWORK, lib_utils_2.wallet);
    let remain0 = (await mulWorkContract.callStatic.getRemainQuota(lib_config_1.userInfo.account, token0_address)).toString();
    let remain1 = (await mulWorkContract.callStatic.getRemainQuota(lib_config_1.userInfo.account, token1_address)).toString();
    return {
        data: {
            token0: token0_address,
            symbol0: getTokenSymbol(token0_address),
            remain0: lib_utils_2.convertBigNumberToNormal(remain0, await lib_utils_2.getDecimal(token0_address)),
            token1: token1_address,
            symbol1: getTokenSymbol(token1_address),
            remain1: lib_utils_2.convertBigNumberToNormal(remain1, await lib_utils_2.getDecimal(token1_address)),
        }
    };
}
exports.getRemainQuota = getRemainQuota;
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
async function getTokenValue(type, token0_address, token1_address, priceLower, priceCurrent, priceUpper, amount) {
    let v3poolContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3pool, lib_abi_1.UNISWAPV3POOL, lib_utils_2.wallet);
    let res = await v3poolContract.callStatic.slot0();
    let resultAmount = 0;
    let tickLower = getTick(token0_address, token1_address, priceUpper);
    let tickUpper = getTick(token0_address, token1_address, priceLower);
    let sqrtPricelower = Math.sqrt(Math.pow(1.0001, +tickLower));
    let sqrtPriceupper = Math.sqrt(Math.pow(1.0001, +tickUpper));
    let a = sqrtPricelower;
    let b = res.sqrtPriceX96 / (Math.pow(2, 96));
    let c = sqrtPriceupper;
    if (type === "token0") { //USDT
        let temp = c * b / (c - b) * (b - a);
        resultAmount = temp / 1e12 * amount;
    }
    else { //ETH
        let temp = (c - b) / (b - a) / (b * c);
        resultAmount = temp * 1e12 * amount;
    }
    return { amount: resultAmount };
}
exports.getTokenValue = getTokenValue;
/**
 * Get the latest price of Tick
 * @param token0_address
 * @param token1_address
 * @param price
 * @returns
 */
function getCloseToTickPrice(token0_address, token1_address, price) {
    let tick = getTick(token0_address, token1_address, price);
    return 1 / Math.pow(1.0001, +tick) * 1e12;
}
exports.getCloseToTickPrice = getCloseToTickPrice;
//---------------------------------------------------------------------------------------------------------
/**
 * approve token
 * @param token_address
 * @param type
 * @param callback
 */
async function approveToken(token_address, type, callback) {
    let destina_address = lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulBank;
    if (type === "deposit") {
    }
    else {
        destina_address = lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy;
    }
    lib_utils_2.approveToken(token_address, destina_address, callback);
}
exports.approveToken = approveToken;
/**
 * deposit
 * @param token_address
 * @param amount
 * @param callback
 */
async function deposit(token_address, amount, callback) {
    let mulBankContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulBank, lib_abi_1.MULBANK, lib_utils_2.wallet);
    let bigAmount = lib_utils_2.convertNormalToBigNumber(amount, await lib_utils_2.getDecimal(token_address));
    lib_utils_2.executeContract(mulBankContract, "deposit", 0, [token_address, bigAmount], callback);
}
exports.deposit = deposit;
/**
 * withdraw
 * @param token_address
 * @param amount
 * @param callback
 */
async function withdraw(token_address, amount, callback) {
    let mulBankContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulBank, lib_abi_1.MULBANK, lib_utils_2.wallet);
    let bigAmount = lib_utils_2.convertNormalToBigNumber(amount, await lib_utils_2.getDecimal(token_address));
    lib_utils_2.executeContract(mulBankContract, "withdraw", 0, [token_address, bigAmount], callback);
}
exports.withdraw = withdraw;
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
async function invest(token0_address, token1_address, fee, amount0, amount1, leftPrice, rightPrice, callback) {
    let v3strategyContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy, lib_abi_1.UNISWAPV3STRATEGY, lib_utils_2.wallet);
    let tickLower = getTick(token0_address, token1_address, +leftPrice);
    let tickUpper = getTick(token0_address, token1_address, +rightPrice);
    if (+tickLower > +tickUpper) {
        [tickLower, tickUpper] = [tickUpper, tickLower];
    }
    let bigAmount0 = lib_utils_2.convertNormalToBigNumber(amount0, await lib_utils_2.getDecimal(token0_address));
    let bigAmount1 = lib_utils_2.convertNormalToBigNumber(amount1, await lib_utils_2.getDecimal(token1_address));
    lib_utils_2.executeContract(v3strategyContract, "invest", 0, [
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
exports.invest = invest;
/**
 * addInvest
 * @param token0_address
 * @param token1_address
 * @param id
 * @param amount0
 * @param amount1
 * @param callback
 */
async function addInvest(token0_address, token1_address, id, amount0, amount1, callback) {
    let v3strategyContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy, lib_abi_1.UNISWAPV3STRATEGY, lib_utils_2.wallet);
    let bigAmount0 = lib_utils_2.convertNormalToBigNumber(amount0, await lib_utils_2.getDecimal(token0_address));
    let bigAmount1 = lib_utils_2.convertNormalToBigNumber(amount1, await lib_utils_2.getDecimal(token1_address));
    lib_utils_2.executeContract(v3strategyContract, "add", 0, [id, bigAmount0, bigAmount1], callback);
}
exports.addInvest = addInvest;
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
async function switching(token0_address, token1_address, id, amount0, amount1, leftPrice, rightPrice, hedge, callback) {
    let v3strategyContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy, lib_abi_1.UNISWAPV3STRATEGY, lib_utils_2.wallet);
    let tickLower = getTick(token0_address, token1_address, +leftPrice);
    let tickUpper = getTick(token0_address, token1_address, +rightPrice);
    if (+tickLower > +tickUpper) {
        [tickLower, tickUpper] = [tickUpper, tickLower];
    }
    let bigAmount0 = lib_utils_2.convertNormalToBigNumber(amount0, await lib_utils_2.getDecimal(token0_address));
    let bigAmount1 = lib_utils_2.convertNormalToBigNumber(amount1, await lib_utils_2.getDecimal(token1_address));
    lib_utils_2.executeContract(v3strategyContract, "switching", 0, [id, {
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: bigAmount0,
            amount1Desired: bigAmount1,
        }, hedge], callback);
}
exports.switching = switching;
/**
 * divest
 * @param id
 * @param isclose
 * @param callback
 */
function divest(id, isclose, callback) {
    let v3strategyContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3strategy, lib_abi_1.UNISWAPV3STRATEGY, lib_utils_2.wallet);
    lib_utils_2.executeContract(v3strategyContract, "divest", 0, [id, isclose], callback);
}
exports.divest = divest;
/**
 * create GP account
 * @param callback
 */
function createAccount(callback) {
    let mulWorkContract = new ethers_1.ethers.Contract(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].mulWork, lib_abi_1.MULWORK, lib_utils_2.wallet);
    lib_utils_2.executeContract(mulWorkContract, "createAccount", 0, [], callback);
}
exports.createAccount = createAccount;
//# sourceMappingURL=index.js.map