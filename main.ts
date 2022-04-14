import Web3 from "web3";
import ganache from "ganache";

import { config } from "dotenv";

import { ABI } from "./contract/ABI";

config();

const address = "0x58A4e8cDCE29cCcc8c19C70643BeF8d35b80381b";

const web3 = new Web3(Web3.givenProvider || process.env.GANACHE_SERVER_URL);

const main = async () => {
  const accounts = await web3.eth.getAccounts();

  const contract = new web3.eth.Contract(ABI, address);

  //   console.log(contract.methods);

  console.log(accounts);
};

main();

// 0x98794a4A92D741c956cff401591E8765F0c5e57F
