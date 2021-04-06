import { task } from "hardhat/config";
import { ethers } from "hardhat";

import { HardhatUserConfig } from "hardhat/types";

import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-vyper";

import { config as env } from "dotenv";
// import { ethers } from "hardhat";

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html

// task("accounts", "Prints the list of accounts", async () => {
//   const accounts = await ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });
env();
const PRIVATE_KEY =
  process.env.PRIVATE_KEY ||
  "41e0d1636f937f2ae9c09902be4503ee1f7047e640b3d90dbda1419868b21efe";
// commiting the above private key is safe, as the wallet (0x12845f392DBbe1470D0Bf32d90822AD6c43e7FB8) compromised

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    mainnet: {
      url:
        "https://eth-mainnet.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      chainId: 1,
      accounts: [PRIVATE_KEY],
      // gas: 2000000,
      // gasPrice: 100000000000,
    },
    hardhat: {
      forking: {
        url:
          "https://eth-mainnet.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      },
      accounts: [
        {
          privateKey: PRIVATE_KEY,
          balance: "12300000000000000000000",
          // mnemonic: process.env.MEMONIC_KEY,
          // accountsBalance: "10000000000000000000000",
        },
      ],
      chainId: 1337,
    },
  },
  vyper: {
    version: "0.2.8",
  },
  solidity: {
    version: "0.5.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  mocha: {
    timeout: 300000,
  },
};

export default config;
