// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const hre = require("hardhat");

const stableSwapABI = require("../abi/stableSwap.json");
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

  const contract = await ethers.getContractAt(stableSwapABI, stableSwap);

  const lpPrice = await contract.get_virtual_price();

  console.log("lpPrice: ", lpPrice.toString());

  const dy = await contract.get_dy(3, 0, "10000000000000000000");
  console.log("dy: ", dy.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
