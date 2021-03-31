// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const hre = require("hardhat");

const stableSwapABI = require("../abi/stableSwap.json");
const stableSwap = "0x0bF48CAE99B82D4fE215F3432Bb6D7c3B54e75e5";
const stakingABI = require("../abi/staking.json");
const factoryABI = require("../abi/factory.json");
const usdcABI = require("../abi/usdc.json");

async function main() {
  const [owner] = await ethers.getSigners();
  const factoryAddr = "0x09835697e79095d25652F41182Ca9Df7A5d9e18e";
  const stakingAddr = "0x0482161E603B761493ed96CC42a81bfb18b40A34";
  const rewardAddr = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";

  const lp = "0xBa20Bbc0799B8654b5061668b272037d4881a0a8"; // TODO: change the LP
  const staking = await ethers.getContractAt(stakingABI, stakingAddr);
  const factory = await ethers.getContractAt(factoryABI, factoryAddr);
  const rewardToken = await ethers.getContractAt(usdcABI, rewardAddr);
  // const stakingRewards = await st.deploy(snow, snow, rewardsDistribution);

  // uint256 public periodFinish = 0;
  // uint256 public rewardRate = 0;
  // uint256 public rewardsDuration;
  // uint256 public lastUpdateTime;
  // uint256 public rewardPerTokenStored;
  await staking.recoverERC20("0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48", 10000000);
  console.log("RecoverERC20");

  console.log("Balance of staking:", await rewardToken.balanceOf(stakingAddr));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
