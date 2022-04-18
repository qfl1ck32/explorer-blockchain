import Web3 from "web3";

import { config } from "dotenv";

import { SUPPLY_ABI, TOKEN_ABI } from "./contract/ABI";

config();

const address = "0xA5D65839675eD6DFe79620167D1242D41F381BEE";

const web3 = new Web3(Web3.givenProvider || process.env.GANACHE_SERVER_URL);

const main = async () => {
  const supplyContract = new web3.eth.Contract(SUPPLY_ABI, address);

  const token = await supplyContract.methods.ownedToken().call();

  console.log("wtf?");

  const tokenContract = new web3.eth.Contract(TOKEN_ABI, token);

  const lat = 39866;
  const long = -70200;
  const name = "Atlantis";

  const from = "0x555547358A4B7e1c2aeb43278099b219E6EB8715";

  try {
    const gasCost = await supplyContract.methods
      .createToken(lat, long, name)
      .estimateGas({ from });

    console.log({ gasCost });

    await supplyContract.methods.createToken(lat, long, name).send({
      from,
      gas: gasCost,
    });

    const totalSupply = await tokenContract.methods.totalSupply().call();

    console.log({ totalSupply });

    console.log({
      location: await tokenContract.methods.getLocation(totalSupply).call(),
    });
  } catch (err) {
    console.log({ err });
  }
};

main();
