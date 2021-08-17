"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uniswapv3strategy = void 0;
exports.uniswapv3strategy = [{ "inputs": [{ "internalType": "contract IUniswapV3Factory", "name": "_factory", "type": "address" }, { "internalType": "contract IMulWork", "name": "_work", "type": "address" }, { "internalType": "contract IMulBank", "name": "_bank", "type": "address" }, { "internalType": "address", "name": "_rewardAddr", "type": "address" }], "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" }], "name": "Add", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "fee0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "fee1", "type": "uint256" }], "name": "Collect", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "indexed": false, "internalType": "bool", "name": "hedge", "type": "bool" }], "name": "Divest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "indexed": false, "internalType": "address", "name": "pool", "type": "address" }, { "indexed": false, "internalType": "address", "name": "token0", "type": "address" }, { "indexed": false, "internalType": "address", "name": "token1", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "invest0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "invest1", "type": "uint256" }, { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" }], "name": "Invest", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "user", "type": "address" }, { "indexed": false, "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "exit0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "exit1", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "invest0", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "invest1", "type": "uint256" }, { "indexed": false, "internalType": "uint128", "name": "liquidity", "type": "uint128" }, { "indexed": false, "internalType": "bool", "name": "hedge", "type": "bool" }], "name": "Switching", "type": "event" }, { "inputs": [], "name": "_nextId", "outputs": [{ "internalType": "uint176", "name": "", "type": "uint176" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "internalType": "uint256", "name": "amount0Desired", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Desired", "type": "uint256" }], "name": "add", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "internalType": "uint128", "name": "liquidity", "type": "uint128" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "bank", "outputs": [{ "internalType": "contract IMulBank", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "positionId", "type": "uint256" }], "name": "collect", "outputs": [{ "internalType": "uint128", "name": "fee0", "type": "uint128" }, { "internalType": "uint128", "name": "fee1", "type": "uint128" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "internalType": "bool", "name": "hedge", "type": "bool" }], "name": "divest", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "factory", "outputs": [{ "internalType": "contract IUniswapV3Factory", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "components": [{ "internalType": "address", "name": "token0", "type": "address" }, { "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "uint256", "name": "amount0Desired", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Desired", "type": "uint256" }, { "internalType": "int24", "name": "tickLower", "type": "int24" }, { "internalType": "int24", "name": "tickUpper", "type": "int24" }], "internalType": "struct UniswapV3Strategy.MintParams", "name": "params", "type": "tuple" }], "name": "invest", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "internalType": "uint128", "name": "liquidity", "type": "uint128" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "positions", "outputs": [{ "internalType": "bool", "name": "close", "type": "bool" }, { "internalType": "address", "name": "token0", "type": "address" }, { "internalType": "address", "name": "token1", "type": "address" }, { "internalType": "uint24", "name": "fee", "type": "uint24" }, { "internalType": "uint256", "name": "debt0", "type": "uint256" }, { "internalType": "uint256", "name": "debt1", "type": "uint256" }, { "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "uint256", "name": "exit0", "type": "uint256" }, { "internalType": "uint256", "name": "exit1", "type": "uint256" }, { "components": [{ "internalType": "int24", "name": "tickLower", "type": "int24" }, { "internalType": "int24", "name": "tickUpper", "type": "int24" }, { "internalType": "uint256", "name": "feeGrowthInside0LastX128", "type": "uint256" }, { "internalType": "uint256", "name": "feeGrowthInside1LastX128", "type": "uint256" }, { "internalType": "uint128", "name": "liquidity", "type": "uint128" }, { "internalType": "uint256", "name": "fee0", "type": "uint256" }, { "internalType": "uint256", "name": "fee1", "type": "uint256" }], "internalType": "struct UniswapV3Strategy.Tick", "name": "tick", "type": "tuple" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "rewardAddr", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "positionId", "type": "uint256" }, { "components": [{ "internalType": "int24", "name": "tickLower", "type": "int24" }, { "internalType": "int24", "name": "tickUpper", "type": "int24" }, { "internalType": "uint256", "name": "amount0Desired", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Desired", "type": "uint256" }], "internalType": "struct UniswapV3Strategy.SwitchParams", "name": "params", "type": "tuple" }, { "internalType": "bool", "name": "hedge", "type": "bool" }], "name": "switching", "outputs": [{ "internalType": "uint256", "name": "amount0", "type": "uint256" }, { "internalType": "uint256", "name": "amount1", "type": "uint256" }, { "internalType": "uint128", "name": "liquidity", "type": "uint128" }, { "internalType": "uint256", "name": "exit0", "type": "uint256" }, { "internalType": "uint256", "name": "exit1", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "amount0Owed", "type": "uint256" }, { "internalType": "uint256", "name": "amount1Owed", "type": "uint256" }, { "internalType": "bytes", "name": "data", "type": "bytes" }], "name": "uniswapV3MintCallback", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "work", "outputs": [{ "internalType": "contract IMulWork", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }];
//# sourceMappingURL=uniswapv3strategy.js.map