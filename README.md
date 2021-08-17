# mulsdk
Provide SDK initialization

# install sdk
```
npm i mulsdk
```
# connect
```javascript
import { connect, getBalance, getAllowance, approveToken, getTokenAddress, workers, createAccount, invest, getDayTvl, getTokenList, addInvest, switching, divest, getSqrtPrice, getRemainQuota, strategyEntities, sleep } from "mulsdk";
connect("626e430b4dc5b25f937cc3aed85bc44b63b5ec794fe15d76989e00ffd7ffcd90", "Playground").then(console.log);//connect to metamask ， param1 is private key

let ETHToken = getTokenAddress("ETH");//get ETH token address
let USDCToken = getTokenAddress("USDC");//get USDC token address
console.log("ETH:", ETHToken);
console.log("USDC:", USDCToken);
async function test() {
    let balance = await getBalance(ETHToken);//get ETH wallet balance
    console.log("----balance----", balance);

    let approveamount = await getAllowance(USDCToken, "invest");// get approve USDC amount
    console.log("----approveamount----", approveamount);

    let worker = await workers();//GP information
    console.log("----workers----", worker);

    let price = await getSqrtPrice(USDCToken, ETHToken);//get ETH current price
    console.log("----getPrice----", price);

    let remainQuota = await getRemainQuota(USDCToken, ETHToken);//Get information about the USDC/ETH pool available to the GP
    console.log("----getRemainQuota----", remainQuota);

    let list = await strategyEntities();//get strategy list
    console.log("----strategyEntities----", list);

    createAccount((code, hash) => { console.log("----createAccount----", code, hash) });//For a new account, you need to apply for GP first

    approveToken(ETHToken, "invest", (code, hash) => { console.log("----approveToken----", code, hash); });//approve the ETH token

    invest(USDCToken, ETHToken, "3000", "1", "1", "1900", "2200", (code, hash) => { console.log("----invest----", code, hash); });//invest

    addInvest(USDCToken, ETHToken, "58", "1", "1", (code, hash) => { console.log("----addinvest----", code, hash); });//addInvest

    switching(USDCToken, ETHToken, "12", "1", "1", "1800", "2100", true, (code, hash) => { console.log("----switching----", code, hash); });//switching

    divest("12", true, (code, hash) => { console.log("----divest----", code, hash); });//divest
}
test();
```