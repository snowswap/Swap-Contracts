// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.

const { ethers } = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy

  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5"; // TODO: Change to team's wallet address
  const wETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; //Decimal: 18
  const eCRV = "0xa3d87fffce63b53e0d54faa1cc983b7eb0b74a9c"; //Decimal: 18
  const steCRV = "0x06325440d014e39736583c165c2963ba99faf14e"; //Decimal: 18
  const ankrCRV = "0xaa17a236f2badc98ddc0cf999abb47d47fc0a6cf"; // Decimal: 18
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
  lpToken = await lpTokenArtifact.deploy("SnowSwap WETH/eCRV/steCRV/ankrCRV", "crvETHSnow");

  await lpToken.deployed();

  console.log("Deployed Lp Token Contract: ", lpToken.address);

  const swapArtifact = await ethers.getContractFactory("StableSwapV3_crvETHSnow");
  swap = await swapArtifact.deploy(OwnerAddress, [wETH, eCRV, steCRV, ankrCRV], lpToken.address, _A, _fee, _admin_fee);

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
