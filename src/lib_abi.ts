import { ethers } from "ethers";
import { erc20 } from "./raw/erc20";
import { mulbank } from "./raw/mulbank";
import { mulwork } from "./raw/mulwork";
import { uniswapv3pool } from "./raw/uniswapv3pool";
import { uniswapv3strategy } from "./raw/uniswapv3strategy";

export const ERC20 = erc20 as ethers.ContractInterface;
export const MULBANK = mulbank as ethers.ContractInterface;
export const MULWORK = mulwork as ethers.ContractInterface;
export const UNISWAPV3POOL = uniswapv3pool as ethers.ContractInterface;
export const UNISWAPV3STRATEGY = uniswapv3strategy as ethers.ContractInterface;