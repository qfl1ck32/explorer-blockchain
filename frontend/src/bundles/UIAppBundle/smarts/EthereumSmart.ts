import { Service } from "@bluelibs/core";
import { Smart } from "@bluelibs/x-ui";
import { createContext } from "react";
import { CreateNFTParams, EthereumSmartState } from "./types";

import Web3 from "web3";
import { SUPPLY_ABI, TOKEN_ABI } from "./utils";

const EthereumSmartContext = createContext(null);

@Service()
export class EthereumSmart extends Smart<EthereumSmartState, undefined> {
  private ethereum: typeof window.ethereum;

  constructor() {
    super();
    this.ethereum = window.ethereum;

    this.setState({
      isReady: false,

      web3: new Web3(Web3.givenProvider || process.env.GANACHE_SERVER_URL),

      account: null,
      supplyContract: null,
      tokenContract: null,

      NFTs: [],
    });
  }

  static getContext() {
    return EthereumSmartContext;
  }

  async init() {
    const account = (
      await this.ethereum.request({
        method: "eth_requestAccounts",
      })
    )[0];

    const supplyContract = new this.state.web3.eth.Contract(
      SUPPLY_ABI,
      process.env.CONTRACT_ADDRESS
    );

    const token = await supplyContract.methods.ownedToken().call();

    const tokenContract = new this.state.web3.eth.Contract(TOKEN_ABI, token);

    this.updateState({
      account,

      supplyContract,
      tokenContract,
    });

    await this.updateNFTsState();

    this.updateState({ isReady: true });
  }

  async updateNFTsState() {
    const numberOfNFTs = parseInt(
      await this.state.tokenContract.methods.totalSupply().call()
    );

    const NFTs = await Promise.all(
      new Array(numberOfNFTs)
        .fill(null)
        .map((_, index) =>
          this.state.tokenContract.methods.getLocation(index + 1).call()
        )
    );

    this.updateState({ NFTs });
  }

  async createNFT(params: CreateNFTParams) {
    const { lat, long, name } = params;

    try {
      const createToken = await this.state.supplyContract.methods.createToken(
        parseFloat(lat) * 1000,
        parseFloat(long) * 1000,
        name
      );

      const gas = await createToken.estimateGas({ from: this.state.account });

      await createToken.send({
        from: this.state.account,

        gas,
      });

      await this.updateNFTsState();
    } catch (err: any) {
      const errMessage = err.message as string;

      const message = JSON.parse(errMessage.substring(errMessage.indexOf("{")))
        .message as string;

      const errText = message.substring(message.indexOf("revert ") + 7);

      throw new Error(errText);
    }
  }
}
