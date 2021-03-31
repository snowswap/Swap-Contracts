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
const { usdc, fUSDC, fUSDT, fDAI } = require("../abi");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const [owner] = await ethers.getSigners();
  const wallet = "0x0bF48CAE99B82D4fE215F3432Bb6D7c3B54e75e5";
  usdc, fUSDC, fUSDT, fDAI;
  const contractUsdc = await ethers.getContractAt(usdcABI, usdc.addr);
  const contractFusdc = await ethers.getContractAt(usdcABI, fUSDC.addr);
  const contractFusdt = await ethers.getContractAt(usdcABI, fUSDT.addr);
  const contractFdai = await ethers.getContractAt(usdcABI, fDAI.addr);

  const balanceUsdc = await contractUsdc.balanceOf(wallet);
  const balanceFusdc = await contractFusdc.balanceOf(wallet);
  const balanceFusdt = await contractFusdt.balanceOf(wallet);
  const balanceFfdai = await contractFdai.balanceOf(wallet);

  console.log("balace:");
  console.log({
    Usdc: balanceUsdc.toString(),
    Fusdc: balanceFusdc.toString(),
    Fusdt: balanceFusdt.toString(),
    Ffdai: balanceFfdai.toString(),
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
