// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

const stableSwapABI = require("../abi/stableSwap.json");
const usdcABI = require("../abi/usdc.json");
const fvault = require("../abi/fvault.json");
const stableSwap = "0xfF55Dd6D32EfbDC49490377Eb9a1eA524D14fA62";
const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const fusdc = "0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE";
const fusdt = "0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C";
const fdai = "0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const { ethers } = hre;

  const contractUsdc = await ethers.getContractAt(usdcABI, usdc);
  await contractUsdc.approve(stableSwap, BigNumber.from("0xfffffffffffffffffffffffff"));

  await contract.add_liquidity(["60000000", "60000000", "60000000", "60000000000000000000"], 0);
  console.log("Totaly 240 assets has been added to the pool");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
