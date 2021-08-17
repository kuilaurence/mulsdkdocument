"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getV3LP = exports.fetchTicksSurroundingPrice = void 0;
const jsbi_1 = __importDefault(require("jsbi"));
const lodash_keyby_1 = __importDefault(require("lodash.keyby"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const sdk_core_1 = require("@uniswap/sdk-core");
const bignumber_1 = require("@ethersproject/bignumber");
const lib_config_1 = require("./lib_config");
const sdk_core_2 = require("@uniswap/sdk-core");
const v3_sdk_1 = require("@uniswap/v3-sdk");
const PRICE_FIXED_DIGITS = 4;
const DEFAULT_SURROUNDING_TICKS = 300;
const MAX_UINT128 = bignumber_1.BigNumber.from(2).pow(128).sub(1);
const FEE_TIER_TO_TICK_SPACING = (feeTier) => {
    switch (feeTier) {
        case "10000":
            return 200;
        case "3000":
            return 60;
        case "500":
            return 10;
        default:
            throw Error(`Tick spacing for fee tier ${feeTier} undefined.`);
    }
};
const fetchData = (query) => {
    return node_fetch_1.default(lib_config_1.ContractAddress[lib_config_1.userInfo.chainID].v3gql, {
        method: "post",
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({ query }),
    }).then((response) => response.json());
};
const fetchInitializedTicks = function (low, upper) {
    const query = `
        query {
          ticks(first: 1000, skip: 0, where: {poolAddress: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e", tickIdx_lte: ${upper}, tickIdx_gte: ${low}}) {
            tickIdx
            liquidityGross
            liquidityNet
            price0
            price1
          }
        }
        `;
    return fetchData(query);
};
const fetchPools = function () {
    const query = `
         query {
            pool(id: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e") {
            tick
            token0 {
                symbol
                id
                decimals
            }
            token1 {
                symbol
                id
                decimals
            }
            feeTier
            sqrtPrice
            liquidity
            }

         }
  `;
    return fetchData(query);
};
const fetchTicksSurroundingPrice = async (numSurroundingTicks = DEFAULT_SURROUNDING_TICKS) => {
    let result1 = await fetchPools();
    const { data: poolResult } = result1;
    const { pool: { tick: poolCurrentTick, feeTier, liquidity, token0: { id: token0Address, decimals: token0Decimals }, token1: { id: token1Address, decimals: token1Decimals }, }, } = poolResult;
    const poolCurrentTickIdx = parseInt(poolCurrentTick);
    const tickSpacing = FEE_TIER_TO_TICK_SPACING(feeTier);
    // The pools current tick isn't necessarily a tick that can actually be initialized.
    // Find the nearest valid tick given the tick spacing.
    const activeTickIdx = Math.floor(poolCurrentTickIdx / tickSpacing) * tickSpacing;
    // Our search bounds must take into account fee spacing. i.e. for fee tier 1%, only
    // ticks with index 200, 400, 600, etc can be active.
    const tickIdxLowerBound = activeTickIdx - numSurroundingTicks * tickSpacing;
    const tickIdxUpperBound = activeTickIdx + numSurroundingTicks * tickSpacing;
    const initializedTicksResult = await fetchInitializedTicks(tickIdxLowerBound, tickIdxUpperBound);
    // console.log('--------initializedTicksResult----',initializedTicksResult)
    const { ticks: initializedTicks } = initializedTicksResult.data;
    const tickIdxToInitializedTick = lodash_keyby_1.default(initializedTicks, "tickIdx");
    const token0 = new sdk_core_1.Token(1, token0Address, parseInt(token0Decimals));
    const token1 = new sdk_core_1.Token(1, token1Address, parseInt(token1Decimals));
    // console.log({ activeTickIdx, poolCurrentTickIdx }, "Active ticks");
    // If the pool's tick is MIN_TICK (-887272), then when we find the closest
    // initializable tick to its left, the value would be smaller than MIN_TICK.
    // In this case we must ensure that the prices shown never go below/above.
    // what actual possible from the protocol.
    let activeTickIdxForPrice = activeTickIdx;
    if (activeTickIdxForPrice < v3_sdk_1.TickMath.MIN_TICK) {
        activeTickIdxForPrice = v3_sdk_1.TickMath.MIN_TICK;
    }
    if (activeTickIdxForPrice > v3_sdk_1.TickMath.MAX_TICK) {
        activeTickIdxForPrice = v3_sdk_1.TickMath.MAX_TICK;
    }
    const activeTickProcessed = {
        liquidityActive: jsbi_1.default.BigInt(liquidity),
        tickIdx: activeTickIdx,
        liquidityNet: jsbi_1.default.BigInt(0),
        price0: v3_sdk_1.tickToPrice(token0, token1, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
        price1: v3_sdk_1.tickToPrice(token1, token0, activeTickIdxForPrice).toFixed(PRICE_FIXED_DIGITS),
        liquidityGross: jsbi_1.default.BigInt(0),
    };
    // If our active tick happens to be initialized (i.e. there is a position that starts or
    // ends at that tick), ensure we set the gross and net.
    // correctly.
    const activeTick = tickIdxToInitializedTick[activeTickIdx];
    if (activeTick) {
        activeTickProcessed.liquidityGross = jsbi_1.default.BigInt(activeTick.liquidityGross);
        activeTickProcessed.liquidityNet = jsbi_1.default.BigInt(activeTick.liquidityNet);
    }
    let Direction;
    (function (Direction) {
        Direction[Direction["ASC"] = 0] = "ASC";
        Direction[Direction["DESC"] = 1] = "DESC";
    })(Direction || (Direction = {}));
    // Computes the numSurroundingTicks above or below the active tick.
    const computeSurroundingTicks = (activeTickProcessed, tickSpacing, numSurroundingTicks, direction) => {
        let previousTickProcessed = Object.assign({}, activeTickProcessed);
        // Iterate outwards (either up or down depending on 'Direction') from the active tick,
        // building active liquidity for every tick.
        let processedTicks = [];
        for (let i = 0; i < numSurroundingTicks; i++) {
            const currentTickIdx = direction == Direction.ASC
                ? previousTickProcessed.tickIdx + tickSpacing
                : previousTickProcessed.tickIdx - tickSpacing;
            if (currentTickIdx < v3_sdk_1.TickMath.MIN_TICK ||
                currentTickIdx > v3_sdk_1.TickMath.MAX_TICK) {
                break;
            }
            const currentTickProcessed = {
                liquidityActive: previousTickProcessed.liquidityActive,
                tickIdx: currentTickIdx,
                liquidityNet: jsbi_1.default.BigInt(0),
                price0: v3_sdk_1.tickToPrice(token0, token1, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                price1: v3_sdk_1.tickToPrice(token1, token0, currentTickIdx).toFixed(PRICE_FIXED_DIGITS),
                liquidityGross: jsbi_1.default.BigInt(0),
            };
            // Check if there is an initialized tick at our current tick.
            // If so copy the gross and net liquidity from the initialized tick.
            const currentInitializedTick = tickIdxToInitializedTick[currentTickIdx.toString()];
            if (currentInitializedTick) {
                currentTickProcessed.liquidityGross = jsbi_1.default.BigInt(currentInitializedTick.liquidityGross);
                currentTickProcessed.liquidityNet = jsbi_1.default.BigInt(currentInitializedTick.liquidityNet);
            }
            // Update the active liquidity.
            // If we are iterating ascending and we found an initialized tick we immediately apply
            // it to the current processed tick we are building.
            // If we are iterating descending, we don't want to apply the net liquidity until the following tick.
            if (direction == Direction.ASC && currentInitializedTick) {
                currentTickProcessed.liquidityActive = jsbi_1.default.add(previousTickProcessed.liquidityActive, jsbi_1.default.BigInt(currentInitializedTick.liquidityNet));
            }
            else if (direction == Direction.DESC &&
                jsbi_1.default.notEqual(previousTickProcessed.liquidityNet, jsbi_1.default.BigInt(0))) {
                // We are iterating descending, so look at the previous tick and apply any net liquidity.
                currentTickProcessed.liquidityActive = jsbi_1.default.subtract(previousTickProcessed.liquidityActive, previousTickProcessed.liquidityNet);
            }
            processedTicks.push(currentTickProcessed);
            previousTickProcessed = currentTickProcessed;
        }
        if (direction == Direction.DESC) {
            processedTicks = processedTicks.reverse();
        }
        return processedTicks;
    };
    const subsequentTicks = computeSurroundingTicks(activeTickProcessed, tickSpacing, numSurroundingTicks, Direction.ASC);
    const previousTicks = computeSurroundingTicks(activeTickProcessed, tickSpacing, numSurroundingTicks, Direction.DESC);
    const ticksProcessed = previousTicks
        .concat(activeTickProcessed)
        .concat(subsequentTicks);
    return {
        data: {
            ticksProcessed,
            feeTier,
            tickSpacing,
            activeTickIdx,
        },
    };
};
exports.fetchTicksSurroundingPrice = fetchTicksSurroundingPrice;
const getV3LP = () => exports.fetchTicksSurroundingPrice()
    .then((res) => {
    return formatData(res.data);
});
exports.getV3LP = getV3LP;
const token0 = new sdk_core_1.Token(1, "0x751290426902f507a9c0c536994b0f3997855BA0", 6);
const token1 = new sdk_core_1.Token(1, "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a", 18);
async function formatData(poolTickData) {
    const newData = await Promise.all(poolTickData.ticksProcessed.map(async (t, i) => {
        const active = t.tickIdx === poolTickData.activeTickIdx;
        const sqrtPriceX96 = v3_sdk_1.TickMath.getSqrtRatioAtTick(t.tickIdx);
        const feeAmount = 3000;
        const mockTicks = [
            {
                index: t.tickIdx - 60,
                liquidityGross: t.liquidityGross,
                liquidityNet: jsbi_1.default.multiply(t.liquidityNet, jsbi_1.default.BigInt("-1")),
            },
            {
                index: t.tickIdx,
                liquidityGross: t.liquidityGross,
                liquidityNet: t.liquidityNet,
            },
        ];
        const pool = new v3_sdk_1.Pool(token0, token1, 3000, sqrtPriceX96, t.liquidityActive, t.tickIdx, mockTicks);
        const nextSqrtX96 = poolTickData.ticksProcessed[i - 1]
            ? v3_sdk_1.TickMath.getSqrtRatioAtTick(poolTickData.ticksProcessed[i - 1].tickIdx)
            : undefined;
        const maxAmountToken0 = token0
            ? sdk_core_2.CurrencyAmount.fromRawAmount(token0, MAX_UINT128.toString())
            : undefined;
        const outputRes0 = pool && maxAmountToken0
            ? await pool.getOutputAmount(maxAmountToken0, nextSqrtX96)
            : undefined;
        const token1Amount = outputRes0 === null || outputRes0 === void 0 ? void 0 : outputRes0[0];
        const amount0 = token1Amount
            ? parseFloat(token1Amount.toExact()) * parseFloat(t.price1)
            : 0;
        const amount1 = token1Amount ? parseFloat(token1Amount.toExact()) : 0;
        return {
            index: i,
            isCurrent: active,
            activeLiquidity: parseFloat(t.liquidityActive.toString()),
            price0: parseFloat(t.price0),
            price1: parseFloat(t.price1),
            tvlToken0: amount0,
            tvlToken1: amount1,
        };
    }));
    // offset the values to line off bars with TVL used to swap across bar
    newData === null || newData === void 0 ? void 0 : newData.map((entry, i) => {
        if (i > 0) {
            newData[i - 1].tvlToken0 = entry.tvlToken0;
            newData[i - 1].tvlToken1 = entry.tvlToken1;
        }
    });
    return newData;
}
//# sourceMappingURL=api2.js.map