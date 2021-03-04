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
  const lpContract = await lpContractArtifact.deploy("Snow usdc/fusdc/fusdt/fdai", "usdc/fusdc/fusdt/fdai");

  await lpContract.deployed();
  // await lo.mint('0xe5c382532179e5086ef8e862c6e13d331a3618da', hre.ethers.BigNumber.from('2000000000000000000000'));

  console.log("Deployed Lp Token Contract: ", lpContract.address);

  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FUSDC = "0xc3f7ffb5d5869b3ade9448d094d81b0521e8326f";
  const FUSDT = "0xc7ee21406bb581e741fbb8b21f213188433d9f2f";
  const FDAI = "0xe85c8581e60d7cd32bbfd86303d2a4fa6a951dac";
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

  await stableSwap.deployed();
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
