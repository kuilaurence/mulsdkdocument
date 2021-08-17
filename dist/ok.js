"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.trade = exports.getBalance_OKEX = exports.init = void 0;
const crypto_1 = __importDefault(require("crypto"));
const moment_1 = __importDefault(require("moment"));
const axios_1 = __importDefault(require("axios"));
const uri = "https://www.okex.com";
let key, secret, password, simulate;
/**
 * 初始化
 * @param _key ok api的key
 * @param _secret secret passphase
 * @param _password
 * @param _simulate simulate 1模拟盘 0实盘
 */
function init(_key, _secret, _password, _simulate) {
    key = _key;
    secret = _secret;
    password = _password;
    simulate = _simulate;
}
exports.init = init;
/**
 * 获取余额
 * @param coin coin为对应币种
 * @returns
 */
async function getBalance_OKEX(coin) {
    let params = { "ccy": coin };
    let path = "/api/v5/account/balance";
    let time = moment_1.default().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let message = time + 'GET' + path;
    const hmac = crypto_1.default.createHmac('sha256', secret);
    hmac.update(message);
    let sign = hmac.digest('base64');
    const instance = axios_1.default.create({
        headers: {
            'x-simulated-trading': simulate,
            'OK-ACCESS-KEY': key,
            "OK-ACCESS-TIMESTAMP": time,
            "OK-ACCESS-SIGN": sign,
            "OK-ACCESS-PASSPHRASE": password,
            'content-type': 'application/json; charset=utf-8'
        }
    });
    try {
        //@ts-ignore
        let response = await instance.get(uri + path, params);
        return response.data.data[0].details;
    }
    catch (e) {
        console.log(e);
    }
}
exports.getBalance_OKEX = getBalance_OKEX;
/**
 * 限价交易
 * @param type  type buy为买 sell为卖
 * @param amount  amount 数量
 * @param price price 挂单价格
 * @returns
 */
async function trade(type, amount, price) {
    let path = "/api/v5/trade/order";
    let params = {
        instId: "ETH-USDT",
        tdMode: "cash",
        side: type,
        ordType: "limit",
        sz: amount.toString(),
        px: price.toString()
    };
    let time = moment_1.default().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let message = time + 'POST' + path + JSON.stringify(params);
    const hmac = crypto_1.default.createHmac('sha256', secret);
    hmac.update(message);
    let sign = hmac.digest('base64');
    const instance = axios_1.default.create({
        headers: {
            'x-simulated-trading': simulate,
            'OK-ACCESS-KEY': key,
            "OK-ACCESS-TIMESTAMP": time,
            "OK-ACCESS-SIGN": sign,
            "OK-ACCESS-PASSPHRASE": password,
            'content-type': 'application/json; charset=utf-8'
        }
    });
    try {
        let result = await instance.post(uri + path, params);
        if (parseInt(result.data.code) == 0) {
            return true;
        }
        console.log(result.data.data);
    }
    catch (e) {
        console.log(e);
    }
    return false;
}
exports.trade = trade;
//# sourceMappingURL=ok.js.map