// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");
const { usdc, fUSDC, fUSDT, fDAI } = require("../abi");

const stableSwapABI = require("../abi/stableSwap.json");
const usdcABI = require("../abi/usdc.json");
const fvault = require("../abi/fvault.json");
const stableSwap = "0x0bF48CAE99B82D4fE215F3432Bb6D7c3B54e75e5";

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const { ethers } = hre;
  const infinite = BigNumber.from("0xfffffffffffffffffffffffff");
  
  const contractUsdc = await ethers.getContractAt(usdcABI, usdc.addr);
  const contractFusdc = await ethers.getContractAt(usdcABI, fUSDC.addr);
  const contractFusdt = await ethers.getContractAt(usdcABI, fUSDT.addr);
  const contractFdai = await ethers.getContractAt(usdcABI, fDAI.addr);
  
  await contractUsdc.approve(stableSwap, infinite);
  await contractFusdc.approve(stableSwap, infinite);
  await contractFusdt.approve(stableSwap, infinite);
  await contractFdai.approve(stableSwap, infinite);

  const contract = await ethers.getContractAt(stableSwapABI, stableSwap);
  const res = await contract.add_liquidity(
    ["60000000", "60000000", "60000000", "60000000000000000000"],
    0
  );
  console.log(res);
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
