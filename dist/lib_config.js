"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenAddres = exports.ContractAddress = exports.userInfo = exports.chainIdDict = void 0;
exports.chainIdDict = {
    1: "Ethereum",
    3: "Ropsten",
    4: "Rinkeby",
    5: "Goerli",
    42: "Kovan",
    56: "BSC",
    97: "BSCTest",
    128: "HECO",
    336: "MULTEST"
};
exports.userInfo = {
    account: "",
    chainID: 1,
    chain: "Ethereum",
};
exports.ContractAddress = {
    1: {
        mulBank: "0x7E9D7bc52fe0AeA4ddD975eE7Ce94F2F4353e664",
        mulWork: "0x19dA267a9D7b2a2E7e3e237985A1526ADc75826F",
        v3strategy: "0x2a3f7a059fED698C30E34026F65C2ae5487c4A96",
        v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
        v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
        strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/playground",
        rankgql: "https://api-ground.multiple.fi/",
        rpcnetwork: "https://jsonrpc.maiziqianbao.net/",
    },
    336: {
        mulBank: "0x7E9D7bc52fe0AeA4ddD975eE7Ce94F2F4353e664",
        mulWork: "0x19dA267a9D7b2a2E7e3e237985A1526ADc75826F",
        v3strategy: "0x2a3f7a059fED698C30E34026F65C2ae5487c4A96",
        v3pool: "0xe7f7eebc62f0ab73e63a308702a9d0b931a2870e",
        v3gql: "https://graph.multiple.fi/subgraphs/name/multiple/v3",
        strateggql: "https://graph.multiple.fi/subgraphs/name/multiple/playground",
        rankgql: "https://api-ground.multiple.fi/",
        rpcnetwork: "https://testnet.multiple.fi",
    },
};
exports.tokenAddres = {
    1: {
        USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
        ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
    },
    336: {
        USDC: "0x751290426902f507a9c0c536994b0f3997855BA0",
        ETH: "0xcfFd1542b1Fa9902C6Ef2799394B4de482AaC33a",
    }
};
//# sourceMappingURL=lib_config.js.map