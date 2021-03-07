// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

const uniRouterV2ABI = require("../abi/uniRouterV2.json");

const uniAddr = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
const WETH_TOKEN = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
const SNOW_TOKEN = "0xfe9a29ab92522d14fc65880d817214261d8479ae";
const USDC_TOKEN = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const yUSDC_ADDR = "0xd6aD7a6750A7593E092a9B218d66C0A814a3436e";
const DAI_ADDR = "0x6b175474e89094c44da98b954eedeac495271d0f";
const yDAI_ADDR = "0x16de59092dAE5CcF4A1E6439D611fd0653f0Bd01";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const { ethers } = hre;

  const accounts = await ethers.getSigners();
  const pubAddr = accounts[0].address;
  const contract = await ethers.getContractAt(uniRouterV2ABI, uniAddr);

  let overrides = {
    value: ethers.utils.hexValue(BigNumber.from("100000000000000000000").toHexString()),
  };
  const swap = await contract.swapExactETHForTokens("1", [WETH_TOKEN, USDC_TOKEN], pubAddr, "1713093319", overrides);
  const result = await swap.wait();

  console.log("swapped 100ETH to USDC");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
