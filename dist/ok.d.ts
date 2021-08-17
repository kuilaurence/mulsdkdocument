/**
 * 初始化
 * @param _key ok api的key
 * @param _secret secret passphase
 * @param _password
 * @param _simulate simulate 1模拟盘 0实盘
 */
export declare function init(_key: string, _secret: string, _password: string, _simulate: number): void;
/**
 * 获取余额
 * @param coin coin为对应币种
 * @returns
 */
export declare function getBalance_OKEX(coin: string): Promise<any>;
/**
 * 限价交易
 * @param type  type buy为买 sell为卖
 * @param amount  amount 数量
 * @param price price 挂单价格
 * @returns
 */
export declare function trade(type: string, amount: number, price: number): Promise<boolean>;
