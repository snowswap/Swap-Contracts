// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");

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
  const snow = "0xfe9a29ab92522d14fc65880d817214261d8479ae"; //Rewards Token
  const usdc = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const lpToken = "0xBa20Bbc0799B8654b5061668b272037d4881a0a8"; // TODO: change the lpt token address
  const rewardsDistribution = 30 * 86400; //UNIX timestamp for 1month(31 days);

  console.log("Deploying contracts with the account:", owner.address);
  // To deploy our contract, we just have to call Token.deploy() and await
  // for it to be deployed(), which happens onces its transaction has been
  // mined.

  const stArtifact = await ethers.getContractFactory("StakingRewardsFactory");
  stContract = await stArtifact.deploy();

  await stContract.deployed();

  console.log("Deployed Staking/Rewards Factory Contract: ", stContract.address);
  const stakingRewards = await stContract.deploy(lpToken, usdc, rewardsDistribution);
  await stakingRewards.wait();
  console.log(await stContract.stakingRewardsInfoByStakingToken("0xBa20Bbc0799B8654b5061668b272037d4881a0a8"));
}
// 0x40217fF7480ec0606de61522D43Ad1c6C88e3EBF
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
