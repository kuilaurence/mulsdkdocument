export { add, sub, mul, div, sleep, logout, connect, getBalance, wallet } from "./lib.utils";
export { getinvestList, getCreatStrategyinfo, getDayTvl, getGPRankList, getPoolHourPrices, getPoolPrice, getPositionInfo, getSingleStrategy, getTokenList, strategyEntities, riskManagement, performance, report } from "./graphql";
export { getBalance_OKEX, trade, init } from "./ok";
/**
 * get token address
 * @param token_symbol
 * @returns
 */
export declare function getTokenAddress(token_symbol: string): string;
/**
 * get token symbol
 * @param token_address
 * @returns
 */
export declare function getTokenSymbol(token_address: string): string;
/**
 * get token allowance
 * @param token_address
 * @param type
 * @returns
 */
export declare function getAllowance(token_address: string, type: "deposit" | "invest"): Promise<string>;
/**
 * pool information
 * @param token_address
 * @returns
 */
export declare function poolInfo(token_address: string): Promise<{
    data: {
        supplyToken: any;
        shareToken: any;
        shareTokenBalance: string;
        reward: string;
        totalBorrow: string;
        loss: string;
        totalDeposit: string;
    };
}>;
/**
 * get GP information
 * @returns
 */
export declare function workers(): Promise<{
    data: {
        createTime: any;
        created: any;
        lastWorkTime: any;
        power: any;
        totalProfit: any;
        workerId: any;
    };
}>;
/**
 * current fee
 * @param sid
 * @returns
 */
export declare function collect(sid: string): Promise<{
    data: {
        fee0: string;
        fee1: string;
    };
}>;
/**
 * get pool price
 * @param token0_address
 * @param token1_address
 * @returns
 */
export declare function getSqrtPrice(token0_address: string, token1_address: string): Promise<number>;
/**
 * get GP remain information
 * @param token0_address
 * @param token1_address
 * @returns
 */
export declare function getRemainQuota(token0_address: string, token1_address: string): Promise<{
    data: {
        token0: string;
        symbol0: string;
        remain0: string;
        token1: string;
        symbol1: string;
        remain1: string;
    };
}>;
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
export declare function getTokenValue(type: "token0" | "token1", token0_address: string, token1_address: string, priceLower: number, priceCurrent: number, priceUpper: number, amount: number): Promise<{
    amount: number;
}>;
/**
 * Get the latest price of Tick
 * @param token0_address
 * @param token1_address
 * @param price
 * @returns
 */
export declare function getCloseToTickPrice(token0_address: string, token1_address: string, price: number): number;
/**
 * approve token
 * @param token_address
 * @param type
 * @param callback
 */
export declare function approveToken(token_address: string, type: "deposit" | "invest", callback: (code: number, hash: string) => void): Promise<void>;
/**
 * deposit
 * @param token_address
 * @param amount
 * @param callback
 */
export declare function deposit(token_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * withdraw
 * @param token_address
 * @param amount
 * @param callback
 */
export declare function withdraw(token_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
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
export declare function invest(token0_address: string, token1_address: string, fee: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * addInvest
 * @param token0_address
 * @param token1_address
 * @param id
 * @param amount0
 * @param amount1
 * @param callback
 */
export declare function addInvest(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, callback: (code: number, hash: string) => void): Promise<void>;
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
export declare function switching(token0_address: string, token1_address: string, id: string, amount0: string, amount1: string, leftPrice: string, rightPrice: string, hedge: boolean, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * divest
 * @param id
 * @param isclose
 * @param callback
 */
export declare function divest(id: string, isclose: boolean, callback: (code: number, hash: string) => void): void;
/**
 * create GP account
 * @param callback
 */
export declare function createAccount(callback: (code: number, hash: string) => void): void;
