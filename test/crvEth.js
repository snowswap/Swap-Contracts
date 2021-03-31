const { expect } = require("chai");
const { BigNumber } = require("ethers");

describe("Swapping Contracts", function () {
  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5";
  const wETH = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"; //Decimal: 18
  const eCRV = "0xa3d87fffce63b53e0d54faa1cc983b7eb0b74a9c"; //Decimal: 18
  const steCRV = "0x06325440d014e39736583c165c2963ba99faf14e"; //Decimal: 18
  const ankrCRV = "0xaa17a236f2badc98ddc0cf999abb47d47fc0a6cf"; // Decimal: 18
  const _A = 10;
  const _fee = 4000000; // 0.04%
  const _admin_fee = 5000000000; // 50%

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
    lpToken = await lpTokenArtifact.deploy("SnowSwap WETH/eCRV/steCRV/ankrCRV", "crvETHSnow");

    await lpToken.deployed();

    console.log("Deployed Lp Token Contract: ", lpToken.address);

    const swapArtifact = await ethers.getContractFactory("StableSwapV3");
    swap = await swapArtifact.deploy(
      OwnerAddress,
      [wETH, eCRV, steCRV, ankrCRV],
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
    it("Should have the exact amount of assets after the initializing of the Liqudity pool", async function () {
      const contractUsdc = await ethers.getContractAt(usdcABI, USDC);
      await contractUsdc.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFusdc = await ethers.getContractAt(fvault, FUSDC);
      await contractFusdc.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFusdt = await ethers.getContractAt(fvault, FUSDT);
      await contractFusdt.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractFdai = await ethers.getContractAt(fvault, FDAI);
      await contractFdai.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      await swap.add_liquidity(["60000000", "60000000", "60000000", "60000000000000000000"], 0);

      const usdcBalance = await swap.balances(0);
      const fusdcBalance = await swap.balances(1);
      const fusdtBalance = await swap.balances(2);
      const fdaiBalance = await swap.balances(3);

      expect(usdcBalance).to.equal("60000000");
      expect(fusdcBalance).to.equal("60000000");
      expect(fusdtBalance).to.equal("60000000");
      expect(fdaiBalance).to.equal("60000000000000000000");
    });
  });
});
