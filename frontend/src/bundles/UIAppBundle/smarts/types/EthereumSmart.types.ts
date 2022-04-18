import Web3 from "web3";

import { Contract } from "web3-eth-contract";

export type NFT = {
  latitude: string;
  longitude: string;
  name: string;
};

export type EthereumSmartState = {
  isReady: boolean;

  account: string;

  web3: Web3;

  supplyContract: Contract;
  tokenContract: Contract;

  NFTs: NFT[];
};

export type CreateNFTParams = {
  lat: string;
  long: string;
  name: string;
};
