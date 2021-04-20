const { expect } = require("chai");
const { BigNumber } = require("ethers");
const bcrvRenWBTCAbi = require("../abi/bcrvRenWBTC.json");
const wBTCAbi = require("../abi/wBTC.json");

describe("bsnow Swapping Contracts", function () {
  const OwnerAddress = "0x4FB2bb19Df86feF113b2016E051898065f963CC5";
  const wBTC = "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599";
  const bcrvRenWBTC = "0x6def55d2e18486b9ddfaa075bc4e4ee0b28c1545";
  const bcrvRenWSBTC = "0xd04c48a53c111300ad41190d63681ed3dad998ec";
  const btBTC = "0xb9d076fde463dbc9f915e5392f807315bf940334";
  const _A = 10;
  const _fee = 4000000; // 0.04%
  const _admin_fee = 5000000000; // 50%

  let lpToken;
  let swap;

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    before(async function () {
      // Get the ContractFactory and Signers here.
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
    });

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
      const contractwBTC = await ethers.getContractAt(wBTCAbi, wBTC);
      await contractwBTC.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractBcrvRenWBTC = await ethers.getContractAt(bcrvRenWBTCAbi, bcrvRenWBTC);
      await contractBcrvRenWBTC.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractBcrvRenWSBTC = await ethers.getContractAt(bcrvRenWBTCAbi, bcrvRenWSBTC);
      await contractBcrvRenWSBTC.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      const contractBtBTC = await ethers.getContractAt(bcrvRenWBTCAbi, btBTC);
      await contractBtBTC.approve(swap.address, BigNumber.from("0xfffffffffffffffffffffffff"));

      await swap.add_liquidity(["50000", "500000000000000", "500000000000000", "100000000000000"], 0);

      const wBTCBalance = await swap.balances(0);
      const bcrvRenWBTCBalance = await swap.balances(1);
      const bcrvRenWSBTCBalance = await swap.balances(2);
      const btBTCBalance = await swap.balances(3);

      console.log("shit?", wBTCBalance, bcrvRenWBTCBalance, bcrvRenWSBTCBalance, btBTCBalance);
      expect(wBTCBalance).to.equal("50000");
      expect(bcrvRenWBTCBalance).to.equal("500000000000000");
      expect(bcrvRenWSBTCBalance).to.equal("500000000000000");
      expect(btBTCBalance).to.equal("100000000000000");
    });
  });
});
