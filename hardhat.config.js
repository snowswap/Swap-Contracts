require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-vyper");

require("dotenv").config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    localhost: {
      uri: "http://127.0.0.1:8545",
      chainId: 1337,
    },
    hardhat: {
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/ULzKnrrt6iflDEREoi2qNJzqRL6N6y6X",
      },
      accounts: {
        mnemonic: process.env.MEMONIC_KEY,
        accountsBalance: "10000000000000000000000",
      },
      chainId: 1337,
    },
  },
  vyper: {
    version: "0.2.8",
  },
  solidity: {
    version: "0.6.12",
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
    timeout: 20000,
  },
};
