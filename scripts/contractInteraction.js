// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { providers } = require("ethers");
const { checkResultErrors } = require("ethers/lib/utils");
const { ethers } = require("hardhat");
const hre = require("hardhat");
const fusdABI = require("../abi/fusd.json");
const usdcABI = require("../abi/usdc.json");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [owner] = await ethers.getSigners();

  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FUSDC = "0xc3f7ffb5d5869b3ade9448d094d81b0521e8326f";
  const FUSDT = "0xc7ee21406bb581e741fbb8b21f213188433d9f2f";
  const FDAI = "0xe85c8581e60d7cd32bbfd86303d2a4fa6a951dac";

  const usdcContract = await ethers.getContractAt(usdcABI, USDC);
  const fusdcContract = await ethers.getContractAt(fusdABI, FUSDC);
  const fusdtContract = await ethers.getContractAt(fusdABI, FUSDT);
  const fdaiContract = await ethers.getContractAt(fusdABI, FDAI);

  const balance = await usdcContract.balanceOf("0xd12AD9B723f4937fEb1cE95945e1230911639375");

  console.log("balace: ", balance.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
