import Web3 from "web3";
import ganache from "ganache";

import { config } from "dotenv";

import { ABI, ABI_2 } from "./contract/ABI";

config();

const address = "0x48352b63800a3577B5037d2e7D6cA4fb1E441553";

const web3 = new Web3(Web3.givenProvider || process.env.GANACHE_SERVER_URL);

const main = async () => {
  const contract = new web3.eth.Contract(ABI, address);

  const accounts = await web3.eth.getAccounts();

  const token = await contract.methods.ownedToken().call();

  const tokenContract = new web3.eth.Contract(ABI_2, token);

  //   const reason = web3.utils.toAscii(
  //     "0xd34b07a9832ce731a7723daafeec7512b0c43634e8c879f01981e34e56fa3f54"
  //   );

  //   console.log(reason);

  //   return;

  try {
    const result = await contract.methods
      .createToken()
      .send({ from: "0xFF35B71924C9b97884aC2905fe37769B3ABf4a0D" });

    console.log(await tokenContract.methods.totalSupply().call());
  } catch (err) {
    console.log({ err });
  }

  //   console.log(token);

  //   console.log(JSON.stringify(token));
};

main();
