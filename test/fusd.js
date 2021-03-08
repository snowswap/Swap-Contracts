const { expect } = require("chai");
const { BigNumber } = require("ethers");
const usdcABI = require("../abi/usdc.json");
const fvault = require("../abi/fvault.json");

describe("Swapping Contracts", function () {
  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5";
  const USDC = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
  const FUSDC = "0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE";
  const FUSDT = "0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C";
  const FDAI = "0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C";
  const _A = 70;
  const _fee = 4000000;
  const _admin_fee = 0;

  let lpToken;
  let swap;

  before(async function () {
    // Get the ContractFactory and Signers here.
    const [owner] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", owner.address);
    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens onces its transaction has been
    // mined.

    const lpTokenArtifact = await ethers.getContractFactory("LpTokenV3");
    lpToken = await lpTokenArtifact.deploy("Snow usdc/fusdc/fusdt/fdai", "fusdSnow");

    await lpToken.deployed();

    console.log("Deployed Lp Token Contract: ", lpToken.address);

    const swapArtifact = await ethers.getContractFactory("StableSwapV3");
    swap = await swapArtifact.deploy(OwnerAddress, [USDC, FUSDC, FUSDT, FDAI], lpToken.address, _A, _fee, _admin_fee);

    await swap.deployed();

    // @notice: Set the swap contract address as minter on lp contract
    //          So that swap contract can mint the lp tokens

    await lpToken.set_minter(swap.address);
    console.log("StableSwap contract has been deployed: ", swap.address);
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      expect(await swap.owner()).to.equal(OwnerAddress);
    });

    it("Should have the right lp token", async function () {
      expect(await swap.lp_token()).to.equal(lpToken.address);
    });
  });

  describe("Add Liqudity", function () {
    // Requires all 4 coins for initial deposit

    it("Deposit each 60 assets as initilazing the", async function () {
      const contractUsdc = await ethers.getContractAt(usdcABI, USDC);
      await contractUsdc.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFusdc = await ethers.getContractAt(fvault, FUSDC);
      await contractFusdc.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFusdt = await ethers.getContractAt(fvault, FUSDT);
      await contractFusdt.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFdai = await ethers.getContractAt(fvault, FDAI);
      await contractFdai.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      await swap.add_liquidity(["60000000", "60000000", "60000000", "60000000000000000000"], 0);

      console.log("240 liqudity has been added");
    });
  });
});
