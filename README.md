# Guide

- `yarn run-node` to run the local node uisng hardhat

  \*\*NOTE: For now hardhat mainnet work is not working properly. Recommend using `ganache-cli` to fork the mainnet: `ganache-cli -f https://eth-mainnet.alchemyapi.io/v2/<API_KEY>`

- `yarn deploy` to deploy the `LpToken` and `StableSwapContract`

  \*\* NOTE: Please remember the deployed address you can check this on your terminal

  **EXAMPLE:**

  > **Deploying contracts with the account**: 0x11D70f3cFd7f5e9B77640cBb522eB9299cFf5aCd  
  > **Deployed Lp Token Contract**: 0xA9530926Ceb4904a0F8d90Ccc5c6fD74851C82f0  
  > **StableSwap contract has been deployed**: 0x051fdaEd31f416877BAB9a76cDCD2ba29d413858  
  > **Minter address has been set!**

- `yarn test`
  Mocha will run the `/test/fusd.js` script. This will deploy the Lptoken and StableSwapping contract. After that, it will try to deposit each **60** assests to the pool. If all tests cases are successful, this means everything is fine.
- Extra Test
  After run `yarn test`, the Swap contract is being deployed on the localhost(mainnet-fork).

  In this case, we are free to make some task script on `/scripts/test.js`

  By running `yarn test-script` the hardhat will run this script. Example test task script is exsit on `scripts` folder. Currently, it's fetching the lptoken virtual price and the quote of exchange to target token.
