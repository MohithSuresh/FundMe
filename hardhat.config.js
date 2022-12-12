require("@nomicfoundation/hardhat-toolbox")
require("@nomiclabs/hardhat-ethers")
require("hardhat-deploy")
require("dotenv").config()
require("solidity-coverage")
require("@nomicfoundation/hardhat-chai-matchers")

/** @type import('hardhat/config').HardhatUserConfig */

GOERLI_RPC_URL = process.env.GOERLI_RPC_URL || ""
ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || ""
COINMARKETCAP_API = process.env.COINMARKETCAP_API || ""
GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || ""

module.exports = {
    solidity: {
        compilers: [
            {
                version: "0.8.8",
            },
            {
                version: "0.6.7",
                settings: {},
            },
        ],
    },

    defaultNetwork: "hardhat",

    networks: {
        //got from hardhat-deploy documentation of
        hardhat: {
            chainId: 31337,
        },
        goerli: {
            chainId: 5,
            url: GOERLI_RPC_URL,
            accounts: [GOERLI_PRIVATE_KEY],
        },
    },

    namedAccounts: {
        //got from hardhat-deploy documentation
        deployer: {
            default: 0, // here this will by default take the first account as deployer
            1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another

            goerli: 0, //it can also specify a specific netwotk name (specified in hardhat.config.js)
        },

        mocha: {
            timeout: 40000,
        },
    },
}
