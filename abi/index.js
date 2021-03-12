const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");

const usdcABI = require("./usdc.json");
const fvault = require("./fvault.json");

const usdc = {
  addr: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
  abi: usdcABI,
};
const fUSDC = {
  addr: "0xf0358e8c3CD5Fa238a29301d0bEa3D63A17bEdBE",
  abi: fvault,
};
const fUSDT = {
  addr: "0x053c80eA73Dc6941F518a68E2FC52Ac45BDE7c9C",
  abi: fvault,
};
const fDAI = {
  addr: "0xab7FA2B2985BCcfC13c6D86b1D5A17486ab1e04C",
  abi: fvault,
};

module.exports = { usdc, fUSDC, fUSDT, fDAI };
