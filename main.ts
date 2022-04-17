// import Web3 from "web3";

const Web3 = require('web3');

import { config } from "dotenv";

import { SUPPLY_ABI, TOKEN_ABI } from "./contract/ABI";

config();

const address = "0x2115e86d7Fd859905F3Dd8b450139092a108C8F2";

const web3 = new Web3(Web3.givenProvider || process.env.GANACHE_SERVER_URL);

const main = async () => {
  const supplyContract = new web3.eth.Contract(SUPPLY_ABI, address);

  const token = await supplyContract.methods.ownedToken().call();

  const tokenContract = new web3.eth.Contract(TOKEN_ABI, token);

  const lat = 39866;
  const long = -70200;
  const name = 'Atlantis';

  try {
    const gasCost = await supplyContract.methods.createToken(lat, long, name).estimateGas({ from: '0xA3778D82E01C557E8E83fbf00A082187308De5d5' });
    console.log(gasCost);
    await supplyContract.methods
      .createToken(lat, long, name)
      .send({ from: '0xA3778D82E01C557E8E83fbf00A082187308De5d5', gas: gasCost });
    const totalSupply = await tokenContract.methods.totalSupply().call();
    console.log(totalSupply);
    console.log(await tokenContract.methods.getLocation(totalSupply).call());
  } catch (err) {
    console.log({ err });
  }
};

main();
