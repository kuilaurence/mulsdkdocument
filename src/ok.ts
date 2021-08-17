import crypto from "crypto";
import moment from 'moment';
import axios from 'axios';

const uri = "https://www.okex.com";
let key: string, secret: string, password: string, simulate: number;

/**
 * 初始化  
 * @param _key ok api的key
 * @param _secret secret passphase 
 * @param _password 
 * @param _simulate simulate 1模拟盘 0实盘
 */
export function init(_key: string, _secret: string, _password: string, _simulate: number) {
    key = _key;
    secret = _secret;
    password = _password;
    simulate = _simulate;
}

/**
 * 获取余额 
 * @param coin coin为对应币种
 * @returns 
 */
export async function getBalance_OKEX(coin: string) {
    let params = { "ccy": coin }
    let path = "/api/v5/account/balance";
    let time = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let message = time + 'GET' + path;
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(message);
    let sign = hmac.digest('base64');
    const instance = axios.create({
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
        let response = await instance.get(uri + path, params)
        return response.data.data[0].details;
    } catch (e) {
        console.log(e);
    }
}
/**
 * 限价交易
 * @param type  type buy为买 sell为卖
 * @param amount  amount 数量
 * @param price price 挂单价格
 * @returns 
 */
export async function trade(type: string, amount: number, price: number) {
    let path = "/api/v5/trade/order";
    let params = {
        instId: "ETH-USDT",
        tdMode: "cash",
        side: type,
        ordType: "limit",
        sz: amount.toString(),
        px: price.toString()
    }
    let time = moment().utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
    let message = time + 'POST' + path + JSON.stringify(params);
    const hmac = crypto.createHmac('sha256', secret)
    hmac.update(message);
    let sign = hmac.digest('base64');
    const instance = axios.create({
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
        let result = await instance.post(uri + path, params)
        if (parseInt(result.data.code) == 0) {
            return true;
        }
        console.log(result.data.data);
    } catch (e) {
        console.log(e);
    }
    return false;
}