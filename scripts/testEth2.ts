// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { BigNumber } from "ethers";
import { ethers } from "hardhat";

const stakingABI = require("../abi/staking.json");
const usdcABI = require("../abi/usdc.json");

//recent add
const eth2StackingAddr = "0x6208D3fdfC396eB065c8FFc291e6BC1902b8b1bf";
const activeAccount = "0xbbd46439ad25f9b04ad0103d655323a9fe9952af";
const snowToken = "0xfe9A29aB92522D14Fc65880d817214261D8479AE";

const ohne15 = (balance: BigNumber): number =>
  balance.div(BigNumber.from("1000000000000000")).toNumber();
async function main() {
  const [owner] = await ethers.getSigners();

  const balance = await owner.getBalance();
  if (
    balance.div(BigNumber.from("1000000000000000000")).lt(BigNumber.from("10"))
  ) {
    console.log("Low balance alert - may be the mainnet!!!");
    return;
  }
  console.log({ balance: ohne15(balance) });
  const eth2Stacking = await ethers.getContractAt(stakingABI, eth2StackingAddr);

  const rewardToken = await ethers.getContractAt(usdcABI, snowToken);

  const getBalanceOfStackingRewardToken = async () => {
    const stackingBalance: BigNumber = await rewardToken.balanceOf(
      eth2Stacking.address
    );
    console.log("Balance of staking:", ohne15(stackingBalance));
  };

  await getBalanceOfStackingRewardToken();

  // return;
  const getEarnedForClient = async () => {
    const earnedB = await eth2Stacking.earned(activeAccount);
    console.log("Earned:", ohne15(earnedB));
  };
  await getEarnedForClient();

  // RecoverERC20
  // await eth2Stacking.recoverERC20(snowToken, "7000000000000000000000");
  // console.log("RecoverERC20");

  // Change the Rewards duration
  await eth2Stacking.setRewardsDuration("10587200");
  console.log("Change the Rewards duration");

  await getBalanceOfStackingRewardToken();

  await getEarnedForClient();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
