/**
 * get invest list
 * @returns
 */
export declare function getinvestList(): Promise<{
    data: any;
} | {
    data: never[];
}>;
/**
 * get position information
 * @returns
 */
export declare function getPositionInfo(poolAddress: string): Promise<{
    data: {
        poolInfo: any;
        ethPriceUSD: any;
    };
}>;
/**
 * get position information2
 * @param poolAddress
 * @returns
 */
export declare function getPositionInfo2(poolAddress: string): Promise<{
    poolInfo: any;
    ethPriceUSD: any;
}>;
export declare function getSingleStrategy(sid: string): Promise<{
    data: {
        token0amount: number;
        token1amount: number;
        totalvalue: number;
        sid: any;
        pool: any;
        token0: any;
        token1: any;
        token0Price: any;
        createdAtTimestamp: any;
        currLiquidity: any;
        currPriceLower: number;
        currPriceUpper: number;
        fee0: string;
        fee1: string;
        accFee0: any;
        accFee1: any;
        collectFee0: string;
        collectFee1: string;
        accumulativefee: number;
        unbalance0: number;
        unbalance1: number;
    };
} | {
    data: {};
}>;
/**
 * get strategies
 * @returns
 */
export declare function strategyEntities(): Promise<any>;
export declare function calculatetoken0token1(tickLower: number, tickCurrent: number, tickUpper: number, lp: number, sqrtPrice: number, token0Price: number): {
    token0amount: number;
    token1amount: number;
    totalvalue: number;
};
/**
 * token list
 * @returns
 */
export declare function getTokenList(): Promise<void | []>;
/**
 * Pool price
 * @returns
 */
export declare function getPoolPrice(): Promise<any>;
/**
 * Pool tvl for day
 * @returns
 */
export declare function getDayTvl(): Promise<{
    data: {
        tvlUSD: number;
        volumeUSD: number;
    };
}>;
/**
 * riskManagement chart
 * @param sid
 * @returns
 */
export declare function riskManagement(sid: string): Promise<{
    data: {
        switchEntities: any;
    };
}>;
/**
 * performance chart
 * @param sid
 * @returns
 */
export declare function performance(sid: string): Promise<{
    data: {
        creattimestamp: any;
        collectEntities: any;
    };
}>;
/**
 * Pool price for half an hour
 * @returns
 */
export declare function getPoolHourPrices(poolAddress: string, timestame: string): Promise<{
    poolHourDatas: any;
}>;
/**
 * Create strategy information
 * @param sid
 * @returns
 */
export declare function getCreatStrategyinfo(sid: string): Promise<{
    switchingdetail: any;
}>;
/**
 * report chart
 * @param sid
 */
export declare function report(poolAddress: string, sid: string): Promise<{
    data: {
        day24hswitchcount: number;
        totalswitchcount: number;
        result: any;
    };
}>;
/**
 * get GP rank
 * @returns
 */
export declare function getGPRankList(): Promise<{
    data: {
        selfIndex: number;
        ranklist: any;
        selfinfo: any;
    };
}>;
