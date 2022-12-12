//import

//module.exports.default alternate syntax

const { network, ethers } = require("hardhat")
const { networkConfig, developmentChains } = require("../helper-hardhat-config")
const { verify } = require("../utils/verify")
require("dotenv").config()

module.exports = async ({ getNamedAccounts, deployments }) => {
    //state vars
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId
    let ethUsdPriceFeedAddress

    //get PriceFeedAggregator addresses according to network
    if (chainId == 31337) {
        const MockV3Aggregator = await ethers.getContract("MockV3Aggregator")
        ethUsdPriceFeedAddress = MockV3Aggregator.address
        log(`ethUsdPriceFeedAddress = ${ethUsdPriceFeedAddress}`)
    } else {
        ethUsdPriceFeedAddress = process.env.GOERLI_PRICE_FEED_ADDRESS
    }

    //deploy FundMe and give proper ethUsdAddress
    const FundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],
        log: true,
    })

    //verify if nework is testnet
    if (chainId != 31337 && process.env.ETHERSCAN_API_KEY) {
        // log("Verifying Contract...") --its already present in ../utils/verify
        verify(FundMe.address, [ethUsdPriceFeedAddress])
        log("Verified.")
    }
}
//module.export.tags
module.exports.tags = ["all", "fund-me"]
