import { Contract, ethers } from "ethers";
export declare var wallet: ethers.Wallet;
/**
 * BigNumber To Normal
 * @param number
 * @param decimals
 * @returns
 */
export declare function convertBigNumberToNormal(number: string, decimals?: number): string;
/**
 * Normal To BigNumber
 * @param number
 * @param decimals
 * @param fix
 * @returns
 */
export declare function convertNormalToBigNumber(number: string, decimals?: number, fix?: number): string;
/**
 * calculatePercentage
 * @param numerator x
 * @param denominator y
 * @returns string
 */
export declare function calculatePercentage(numerator: string, denominator: string): string;
/**
 * multipliedBy
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function calculateMultiplied(number1: string, number2: string): string;
/**
 * minus
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function minusBigNumber(number1: string, number2: string): string;
/**
 * x+y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function add(number1: string, number2: string): string;
/**
 * x-y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function sub(number1: string, number2: string): string;
/**
 * x*y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function mul(number1: string, number2: string): string;
/**
 * x/y
 * @param number1 x
 * @param number2 y
 * @returns string
 */
export declare function div(number1: string, number2: string): string;
/**
 * deadline
 * @param delay time
 * @returns timestemp
 */
export declare function getDeadLine(delay: number): number;
export declare const sleep: (ms: number) => Promise<unknown>;
interface DictObject {
    [key: string]: string;
}
/**
 * Find the key by value
 * @param obj
 * @param value
 * @param compare
 * @returns
 */
export declare function findToken(obj: DictObject, value: string, compare?: (a: string, b: string) => boolean): string | undefined;
/**
 * get token balance
 * @param token_address
 * @returns
 */
export declare function getBalance(token_address: string): Promise<string>;
/**
 * transfer
 * @param token_address
 * @param to_address
 * @param amount
 * @param callback
 */
export declare function transfer(token_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * transfer from
 * @param token_address
 * @param from_address
 * @param to_address
 * @param amount
 * @param callback
 */
export declare function transferFrom(token_address: string, from_address: string, to_address: string, amount: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * get token decimal
 * @param token_address
 * @returns
 */
export declare function getDecimal(token_address: string): Promise<any>;
/**
 * approve Token
 * @param token_address
 * @param destina_address
 * @param callback
 */
export declare function approveToken(token_address: string, destina_address: string, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * get token allowance
 * @param token_address
 * @param destina_address
 * @returns
 */
export declare function getAllowance(token_address: string, destina_address: string): Promise<string>;
/**
 * execute contract
 * @param contract
 * @param methodName
 * @param value
 * @param params
 * @param callback
 */
export declare function executeContract(contract: Contract, methodName: string, value: number, params: any, callback: (code: number, hash: string) => void): Promise<void>;
/**
 * connect
 * @param privatekey
 * @param type
 * @returns
 */
export declare function connect(privatekey: string, type: "Ethereum" | "Playground"): Promise<{
    account: string;
    chain: "Ethereum" | "Playground";
    amountETH: string;
}>;
/**
 * exit
 * @returns
 */
export declare function logout(): {
    account: string;
    chainID: number;
    chain: string;
    message: string;
};
export {};
