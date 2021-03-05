# Guide

1. `yarn run-node` to run the local node uisng hardhat  
   \*\* NOTE: For now hardhat mainnet work is not working properly. Recommend using `ganache-cli` to fork the mainnet: `ganache-cli -f https://eth-mainnet.alchemyapi.io/v2/<API_KEY>`
2. `yarn deploy` to deploy the `LpToken` and `StableSwapContract`  
   \*\* NOTE: Please remember the deployed address you can check this on your terminal

````Deploying contracts with the account: 0x11D70f3cFd7f5e9B77640cBb522eB9299cFf5aCd
Deployed Lp Token Contract:  0xA9530926Ceb4904a0F8d90Ccc5c6fD74851C82f0
StableSwap contract has been deployed:  0x051fdaEd31f416877BAB9a76cDCD2ba29d413858
Minter address has been set!```

(Will move this to test script. Right now it is a part of task script)
````
