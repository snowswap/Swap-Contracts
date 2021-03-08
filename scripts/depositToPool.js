// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

const fvaultABI = require("../abi/fvault.json");

const fusdc = "0xc3f7ffb5d5869b3ade9448d094d81b0521e8326f";
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
  const contract = await ethers.getContractAt(fvaultABI, fusdc);

  console.log(contract);
  await contract.deposit("10000000");
  console.log("Deposited 1000USDC to fvault");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
