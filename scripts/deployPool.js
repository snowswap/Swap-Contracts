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

  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5"; // TODO: Change to team's wallet address
  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FUSDC = "0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE";
  const FUSDT = "0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C";
  const FDAI = "0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C";
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
  lpToken = await lpTokenArtifact.deploy("SnowSwap USDC/fDAI/fUSDC/fUSDT", "fSnow");

  await lpToken.deployed();

  console.log("Deployed Lp Token Contract: ", lpToken.address);

  const swapArtifact = await ethers.getContractFactory("StableSwapV3");
  swap = await swapArtifact.deploy(OwnerAddress, [USDC, FUSDC, FUSDT, FDAI], lpToken.address, _A, _fee, _admin_fee);

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
