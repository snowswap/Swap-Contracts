// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");
const hre = require("hardhat");
const { BigNumber } = require("ethers");
const stableSwapABI = require("../abi/stableSwap.json");

const { usdc, fUSDC, fUSDT, fDAI } = require("../abi");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  const contractUsdc = await ethers.getContractAt(usdc.abi, usdc.addr);
  const contractFusdc = await ethers.getContractAt(fUSDC.abi, fUSDC.addr);
  const contractFusdt = await ethers.getContractAt(fUSDT.abi, fUSDT.addr);
  const contractFdai = await ethers.getContractAt(fDAI.abi, fDAI.addr);

  const getCombinedBalance = async (wallet) => {
    console.log("Checking the balance of ", wallet);

    const balanceUsdc = await contractUsdc.balanceOf(wallet);
    const balanceFusdc = await contractFusdc.balanceOf(wallet);
    const balanceFusdt = await contractFusdt.balanceOf(wallet);
    const balanceFfdai = await contractFdai.balanceOf(wallet);

    console.log("balace:");
    console.log({
      Usdc: balanceUsdc.toString(),
      Fusdc: balanceFusdc.toString(),
      Fusdt: balanceFusdt.toString(),
      Ffdai: balanceFfdai.toString(),
    });
  };

  const [owner, addr1] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", owner.address);

  const lpContractArtifact = await hre.ethers.getContractFactory("LpTokenV3");
  const lpContract = await lpContractArtifact.deploy(
    "Snow usdc/fusdc/fusdt/fdai",
    "fusdSnow"
  );

  await lpContract.deployed();

  console.log("Deployed Lp Token Contract: ", lpContract.address);

  const _A = 10;
  const _fee = 4000000;
  const _admin_fee = 0;
  // _owner: address,
  // _coins: address[N_COINS],
  // _pool_token: address,
  // _A: uint256,
  // _fee: uint256,
  // _admin_fee: uint256

  const StableSwapArtifact = await hre.ethers.getContractFactory(
    "StableSwapV3"
  );
  const stableSwapContract = await StableSwapArtifact.deploy(
    "0xE8fed9d7b9E7eD19671ee35f169db6F007b2FFd4",
    [usdc.addr, fUSDC.addr, fUSDT.addr, fDAI.addr],
    lpContract.address,
    _A,
    _fee,
    _admin_fee
  );

  await stableSwapContract.deployed();
  console.log(
    "StableSwap contract has been deployed: ",
    stableSwapContract.address
  );

  // @notice: Set the swap contract address as minter on lp contract
  //          So that swap contract can mint the lp tokens
  await lpContract.set_minter(stableSwapContract.address);

  console.log("Minter address has been set!");
  //////////////////////

  console.log("Adding liquidity...");
  const stableSwap = stableSwapContract.address;
  const infinite = BigNumber.from("0xfffffffffffffffffffffffff");

  await contractUsdc.approve(stableSwap, infinite);
  await contractFusdc.approve(stableSwap, infinite);
  await contractFusdt.approve(stableSwap, infinite);
  await contractFdai.approve(stableSwap, infinite);
  const swapContract = await ethers.getContractAt(stableSwapABI, stableSwap);
  await swapContract.add_liquidity(
    ["60000000", "60000000", "60000000", "60000000000000000000"],
    0
  );
  const wallet = "0x4fb2bb19df86fef113b2016e051898065f963cc5";
  await getCombinedBalance(wallet);
  await getCombinedBalance(stableSwap);
  //exchange usdc, fUSDC, fUSDT, fDAI
  //exchange usdc->fUSDC
  const res = await swapContract.exchange(0, 1, 40000000, 20000000);
  // console.log(res);
  await getCombinedBalance(wallet);
  await getCombinedBalance(stableSwap);

  console.log("providing a single liquidity...");

  await swapContract.add_liquidity(["0", "76706490", "0", "0"], 0);
  await getCombinedBalance(wallet);
  await getCombinedBalance(stableSwap);
  const liq = await lpContract.balanceOf(wallet);
  console.log({ liquidity: liq.toString() });

  console.log("remove liquidity...");

  swapContract.remove_liquidity(liq, [1, 1, 1, 1]);
  await getCombinedBalance(wallet);
  await getCombinedBalance(stableSwap);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
