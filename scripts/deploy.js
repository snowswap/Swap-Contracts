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

  const [owner, addr1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  const lpContractArtifact = await hre.ethers.getContractFactory("LpTokenV3");
  const lpContract = await lpContractArtifact.deploy("Snow usdc/fusdc/fusdt/fdai", "fusdSnow");

  await lpContract.deployed();

  console.log("Deployed Lp Token Contract: ", lpContract.address);

  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FUSDC = "0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE";
  const FUSDT = "0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C";
  const FDAI = "0xab7fa2b2985bccfc13c6d86b1d5a17486ab1e04c";
  const _A = 70;
  const _fee = 4000000;
  const _admin_fee = 0;
  // _owner: address,
  // _coins: address[N_COINS],
  // _pool_token: address,
  // _A: uint256,
  // _fee: uint256,
  // _admin_fee: uint256

  const StableSwapArtifact = await hre.ethers.getContractFactory("StableSwapV3");
  const stableSwapContract = await StableSwapArtifact.deploy(
    "0xE8fed9d7b9E7eD19671ee35f169db6F007b2FFd4",
    [USDC, FUSDC, FUSDT, FDAI],
    lpContract.address,
    _A,
    _fee,
    _admin_fee
  );

  await stableSwapContract.deployed();
  console.log("StableSwap contract has been deployed: ", stableSwapContract.address);

  // @notice: Set the swap contract address as minter on lp contract
  //          So that swap contract can mint the lp tokens
  await lpContract.set_minter(stableSwapContract.address);

  console.log("Minter address has been set!");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
