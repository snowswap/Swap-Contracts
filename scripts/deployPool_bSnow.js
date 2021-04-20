// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5"; // TODO: Change to team's wallet address
  const wBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const bcrvRenWBTC = "0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545";
  const bcrvRenWSBTC = "0xd04c48a53c111300ad41190d63681ed3dad998ec";
  const btBTC = "0xb9d076fde463dbc9f915e5392f807315bf940334";
  const _A = 10;
  const _fee = 4000000; // 0.04%
  const _admin_fee = 5000000000; // 50%

  let lpToken;
  let swap;

  const [owner] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", owner.address);
  // To deploy our contract, we just have to call Token.deploy() and await
  // for it to be deployed(), which happens onces its transaction has been
  // mined.

  const lpTokenArtifact = await ethers.getContractFactory("LpTokenV3");
  lpToken = await lpTokenArtifact.deploy("SnowSwap wBTCbcrvRenWBTC/bcrvRenWSBTC/(btBTC/sBTCcrv)", "bSnow");

  await lpToken.deployed();

  console.log("Deployed Lp Token Contract: ", lpToken.address);

  const swapArtifact = await ethers.getContractFactory("StableSwapV3_bSnow");
  swap = await swapArtifact.deploy(
    OwnerAddress,
    [wBTC, bcrvRenWBTC, bcrvRenWSBTC, btBTC],
    lpToken.address,
    _A,
    _fee,
    _admin_fee
  );

  await swap.deployed();

  // @notice: Set the swap contract address as minter on lp contract
  //          So that swap contract can mint the lp tokens

  await lpToken.set_minter(swap.address);
  console.log("StableSwap contract has been deployed: ", swap.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
