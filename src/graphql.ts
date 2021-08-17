import { getTokenSymbol, collect } from "./index";
import { userInfo, ContractAddress } from "./lib_config";
import { convertBigNumberToNormal } from "./lib.utils";
import fetch from "node-fetch";

var tokenList: [];
let graphql = "https://api.thegraph.com/subgraphs/name/winless/multiple";// https://graph.multiple.fi/
/**
 * get invest list
 * @returns
 */
export async function getinvestList() {
  const query = `
      {
        positions(where:{user:"${userInfo.account}"}) {
          id
          user
          positionId
          token0
          token1
          debt0
          debt1
          exit0
          exit1
          liquidity
          tickLower
          tickUpper
          close
          }
        }
      `;
  return fetch(graphql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let history = data.data.positions;
      return {
        data: history.map((item: any) => {
          return {
            ...item,
            debt0: convertBigNumberToNormal(item.debt0, 18),
            debt1: convertBigNumberToNormal(item.debt1, 18),
            priceLower: Math.pow(1.0001, item.tickLower),
            priceUpper: Math.pow(1.0001, item.tickUpper),
            symbol0: getTokenSymbol(item.token0),
            symbol1: getTokenSymbol(item.token1),
          };
        }),
      };
    })
    .catch(() => {
      return { data: [] };
    });
}
/**
 * get position information
 * @returns 
 */
export async function getPositionInfo(poolAddress: string) {
  let res2 = await getPositionInfo2(poolAddress)
  return {
    data: {
      poolInfo: res2.poolInfo,
      ethPriceUSD: res2.ethPriceUSD,
    }
  }
}
/**
 * get position information2
 * @param poolAddress 
 * @returns 
 */
export async function getPositionInfo2(poolAddress: string) {
  const query = `
    {
        bundles {
          ethPriceUSD
        }
        pool(id: "${poolAddress}") {
            id
            feeTier
            liquidity
            sqrtPrice
            tick
            token0 {
              id
              symbol
              name
              decimals
              derivedETH
            }
            token1 {
              id
              symbol
              name
              decimals
              derivedETH
            }
            token0Price
            token1Price
            volumeUSD
            txCount
            totalValueLockedToken0
            totalValueLockedToken1
            totalValueLockedUSD
        }
      }
      `;
  return fetch(ContractAddress[userInfo.chainID].v3gql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let ethPriceUSD = data.data.bundles[0].ethPriceUSD;
      let poolInfo = data.data.pool;
      return {
        poolInfo: poolInfo,
        ethPriceUSD: ethPriceUSD,
      }
    })
}
export async function getSingleStrategy(sid: string) {
  let res = await getPoolPrice();
  const query = `
  {
    strategyEntities(where: {sid:"${sid}",user: "${userInfo.account}",end:false}) {
      sid
      pool
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      accFee0
      accFee1
      accInvest0
      accInvest1
      preInvest0
      preInvest1
      createdAtTimestamp
      currTickLower
      currTickUpper
      currLiquidity
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].strateggql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then(async (data) => {
      if (data.data.strategyEntities.length > 0) {
        let strategyEntitie = data.data.strategyEntities[0];
        let currPriceLower = calculatePrice(strategyEntitie.currTickLower);
        let currPriceUpper = calculatePrice(strategyEntitie.currTickUpper);
        if (currPriceLower > currPriceUpper) {
          [currPriceLower, currPriceUpper] = [currPriceUpper, currPriceLower]
        }
        let token0token1Info = calculatetoken0token1(strategyEntitie.currTickLower, res.tick, strategyEntitie.currTickUpper, strategyEntitie.currLiquidity, res.sqrtPrice, res.token0Price);
        let result = await collect(strategyEntitie.sid);
        let fee0 = (+result.data.fee0 + +strategyEntitie.accFee0).toFixed(8);
        let fee1 = (+result.data.fee1 + +strategyEntitie.accFee1).toFixed(8);
        return {
          data: {
            sid: strategyEntitie.sid,
            pool: strategyEntitie.pool,
            token0: strategyEntitie.token0.symbol,
            token1: strategyEntitie.token1.symbol,
            token0Price: res.token0Price,
            createdAtTimestamp: strategyEntitie.createdAtTimestamp,
            currLiquidity: strategyEntitie.currLiquidity,
            currPriceLower: currPriceLower,
            currPriceUpper: currPriceUpper,
            fee0: fee0,
            fee1: fee1,
            accFee0: strategyEntitie.accFee0,
            accFee1: strategyEntitie.accFee1,
            collectFee0: result.data.fee0,
            collectFee1: result.data.fee1,
            accumulativefee: (+fee0 + +fee1 * +res.token0Price),
            unbalance0: +token0token1Info.token0amount - strategyEntitie.preInvest0,
            unbalance1: +token0token1Info.token1amount - strategyEntitie.preInvest1,
            ...token0token1Info,
          }
        }
      } else {
        return { data: {} };
      }
    })
}
/**
 * get strategies
 * @returns 
 */
export async function strategyEntities() {
  let res = await getPoolPrice();
  const query = `
  {
    strategyEntities(where: {user: "${userInfo.account}",end:false}) {
      sid
      pool
      token0 {
        symbol
      }
      token1 {
        symbol
      }
      accFee0
      accFee1
      accInvest0
      accInvest1
      preInvest0
      preInvest1
      createdAtTimestamp
      currTickLower
      currTickUpper
      currLiquidity
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].strateggql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let strategyEntities = data.data.strategyEntities;
      return strategyEntities.map((item: any) => {
        let currPriceLower = calculatePrice(item.currTickLower);
        let currPriceUpper = calculatePrice(item.currTickUpper);
        if (currPriceLower > currPriceUpper) {
          [currPriceLower, currPriceUpper] = [currPriceUpper, currPriceLower]
        }
        let token0token1Info = calculatetoken0token1(item.currTickLower, res.tick, item.currTickUpper, item.currLiquidity, res.sqrtPrice, res.token0Price);
        return {
          sid: item.sid,
          pool: item.pool,
          token0: item.token0.symbol,
          token1: item.token1.symbol,
          token0Price: res.token0Price,
          accFee0: item.accFee0,
          accFee1: item.accFee1,
          createdAtTimestamp: item.createdAtTimestamp,
          currLiquidity: item.currLiquidity,
          currPriceLower: currPriceLower,
          currPriceUpper: currPriceUpper,
          accumulativefee: +item.accFee0 + +item.accFee1 * +res.token0Price,
          unbalance0: +token0token1Info.token0amount - item.preInvest0,
          unbalance1: +token0token1Info.token1amount - item.preInvest1,
          ...token0token1Info,
        }
      })
    }).then(async data => {
      data.sort((a: any, b: any) => { return a.sid - b.sid });
      for (var i = 0; i < data.length; i++) {
        if (data[i].end) {
          data.splice(i, 1);
          i -= 1;
        }
      }
      const sids = data.map((item: any) => item.sid)
      //@ts-ignore
      await sids.reduce(async (pre, sid, i) => {
        await pre
        let result = await collect(sid);
        data[i]["fee0"] = result.data.fee0;
        data[i]["fee1"] = result.data.fee1;
        data[i]["collectFee0"] = result.data.fee0;
        data[i]["collectFee1"] = result.data.fee1;

        data[i]["fee0"] = +data[i]["accFee0"] + +data[i]["fee0"];
        data[i]["fee1"] = +data[i]["accFee1"] + +data[i]["fee1"];
        data[i]["fee0"] = data[i]["fee0"];
        data[i]["fee1"] = data[i]["fee1"];

        data[i]["accumulativefee"] = data[i]["fee0"] + data[i]["fee1"] * +data[i].token0Price;
      }, Promise.resolve())
      return data
    })
}
function calculatePrice(tick: number) {
  return 1 / Math.pow(1.0001, tick) * 1e12;
}
export function calculatetoken0token1(tickLower: number, tickCurrent: number, tickUpper: number, lp: number, sqrtPrice: number, token0Price: number) {
  let a = Math.sqrt(Math.pow(1.0001, tickLower));
  let b = sqrtPrice / Math.pow(2, 96);
  let c = Math.sqrt(Math.pow(1.0001, tickUpper));
  let token0amount = 0;
  let token1amount = 0;
  if (b <= a) {
    token0amount = lp * (c - a) / (c * a) / 1e6;
    token1amount = 0;
  } else if (c <= b) {
    token0amount = 0;
    token1amount = lp * (c - a) / 1e18;
  } else {
    token0amount = lp * (c - b) / (c * b) / 1e6;
    token1amount = lp * (b - a) / 1e18;
  }
  return {
    token0amount: token0amount,
    token1amount: token1amount,
    totalvalue: token0amount + token1amount * token0Price,
  }
}
/**
 * token list
 * @returns 
 */
export async function getTokenList() {
  const query = `
    {
        tokens {
          id
          symbol
          decimals
        }
    }
    `;
  return fetch(ContractAddress[userInfo.chainID].v3gql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      tokenList = data.data.tokens;
      return tokenList
    })
    .catch(() => {
      tokenList = [];
    });
}
/**
 * Pool price
 * @returns 
 */
export async function getPoolPrice() {
  const query = `
  {
    pools(where: {id: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e"}) {
      token0Price
      token1Price
      sqrtPrice
      tick
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].v3gql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let pools = data.data.pools[0];
      return pools
    })
}
/**
 * Pool tvl for day
 * @returns 
 */
export async function getDayTvl() {
  const query = `
  {
    poolDayDatas(orderBy: date, orderDirection: desc, first: 1) {
      pool {
        id
        token0 {
          symbol
          id
        }
        token1 {
          symbol
          id
        }
      }
      date
      tvlUSD
      volumeUSD
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].v3gql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let day0 = data.data.poolDayDatas[0];
      return {
        data: {
          tvlUSD: +day0.tvlUSD,
          volumeUSD: +day0.volumeUSD,
        }
      }
    })
}
/**
 * riskManagement chart
 * @param sid 
 * @returns 
 */
export async function riskManagement(sid: string) {
  const query = `
  {
    switchEntities(orderBy: timestamp,where: {sid: "${sid}"}) {
      position {
        tick {
          sqrtPriceX96
        }
      }
      accInvest0
      accInvest1
      timestamp
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].strateggql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let switchEntities = data.data.switchEntities.map((item: any) => {
        return {
          ...item,
          price: (1 / Math.pow(+item.position.tick.sqrtPriceX96 / (Math.pow(2, 96)), 2) * 1e12).toFixed(6)
        }
      });
      return {
        data: {
          switchEntities,
        }
      }
    })
}
/**
 * performance chart
 * @param sid 
 * @returns 
 */
export async function performance(sid: string) {
  const query = `
  {
    strategyEntities(where: {sid: "${sid}"}) {
      accFee0
      accFee1
    }
    position2Strategy(id: "${sid}") {
      timestamp
    }
    collectEntities(orderBy: timestamp, where: {sid: "${sid}"}) {
      timestamp
      accFee0
      accFee1
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].strateggql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let collectEntities = data.data.collectEntities;
      return {
        data: {
          creattimestamp: data.data.position2Strategy.timestamp,
          collectEntities
        }
      }
    })
}
/**
 * Pool price for half an hour
 * @returns 
 */
export async function getPoolHourPrices(poolAddress: string, timestame: string) {
  const query = `
  {
    poolHourDatas(orderBy: timestamp, first: 1000, where: {timestamp_gt: "${timestame}", pool: "${poolAddress}"}) {
      timestamp
      token0Price
      tick
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].v3gql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let poolHourDatas = data.data.poolHourDatas;
      return {
        poolHourDatas
      }
    })
}
/**
 * Create strategy information
 * @param sid 
 * @returns 
 */
export async function getCreatStrategyinfo(sid: string) {
  const query = `
  {
    strategyEntities(where: {sid: "${sid}"}) {
      position {
        tick {
          timestamp
          tickLower
          tickUpper
        }
      }
      switching (orderBy:timestamp,first:500){
        position {
          tick {
            timestamp
            tickLower
            tickUpper
          }
        }
      }
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].strateggql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let priceLower = calculatePrice(+data.data.strategyEntities[0].position.tick.tickLower);
      let priceUpper = calculatePrice(+data.data.strategyEntities[0].position.tick.tickUpper);
      if (priceLower > priceUpper) {
        [priceLower, priceUpper] = [priceUpper, priceLower];
      }
      let firstPosition = {
        priceLower: priceLower,
        priceUpper: priceUpper,
        timestamp: data.data.strategyEntities[0].position.tick.timestamp,
      }
      let switchingdetail = data.data.strategyEntities[0].switching.map((item: any) => {
        let priceLower = calculatePrice(+item.position.tick.tickLower);
        let priceUpper = calculatePrice(+item.position.tick.tickUpper);
        if (priceLower > priceUpper) {
          [priceLower, priceUpper] = [priceUpper, priceLower];
        }
        return {
          priceLower: priceLower,
          priceUpper: priceUpper,
          timestamp: item.position.tick.timestamp,
        }
      })
      switchingdetail.unshift(firstPosition);
      return {
        switchingdetail
      }
    })
}
/**
 * report chart
 * @param sid 
 */
export async function report(poolAddress: string, sid: string) {
  let res1 = await getCreatStrategyinfo(sid);
  let firstTimestemp = res1.switchingdetail[0].timestamp;
  let timestame = (Number(firstTimestemp) - 1800).toString();
  let res2 = await getPoolHourPrices(poolAddress, timestame);
  let totalswitchcount = res1.switchingdetail.length - 1;
  let day24hswitchcount = 0;
  let day24htimestamp = Math.floor(Date.now() / 1000) - 86400;
  for (let i = res1.switchingdetail.length - 1; i > 0; i--) {
    if (+res1.switchingdetail[i].timestamp > day24htimestamp) {
      day24hswitchcount++;
    } else {
      break;
    }
  }
  let resultList: any = [];
  res1.switchingdetail.forEach((item: any) => {
    resultList.push({
      type: "L",
      price: +Number(item.priceLower).toFixed(6),
      timestamp: +item.timestamp,
    })
    resultList.push({
      type: "U",
      price: +Number(item.priceUpper).toFixed(6),
      timestamp: +item.timestamp,
    })
  });
  res2.poolHourDatas.forEach((item: any) => {
    resultList.push({
      type: "C",
      price: +Number(item.token0Price).toFixed(6),
      timestamp: +item.timestamp,
    })
  });

  return {
    data: {
      day24hswitchcount: day24hswitchcount,
      totalswitchcount: totalswitchcount,
      result: resultList.sort((a: any, b: any) => a.type > b.type ? -1 : 1)
    }
  }
}
/**
 * get GP rank
 * @returns 
 */
export async function getGPRankList() {
  const query = `
  {
    ranks(paging:{orderBy:"feeValue",order:desc}){
      user
      value
      feeValue
      profit
      updateTime
    }
    rank(user:"${userInfo.account}"){
      user
      value
      feeValue
      profit
      updateTime
    }
  }
    `;
  return fetch(ContractAddress[userInfo.chainID].rankgql, {
    method: "post",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify({ query }),
  }).then((response) => response.json())
    .then((data) => {
      let ranklist = data.data.ranks;
      let selfinfo = data.data.rank;
      let selfIndex = ranklist.indexOf(ranklist.filter((item: any) => item.user == userInfo.account)[0]);
      return {
        data: {
          selfIndex: 1 + +selfIndex,
          ranklist: ranklist,
          selfinfo: selfinfo,
        }
      }
    })
}