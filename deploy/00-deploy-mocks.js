//import
const { network } = require("hardhat")
const DECIMAL = "8"
const INITIAL_VALUE = "200000000000"
//module.exports
module.exports = async ({ getNamedAccounts, deployments }) => {
    //import
    const { deploy, log } = deployments
    const { deployer } = await getNamedAccounts()
    const chainId = network.config.chainId

    //if local network deploy contracts
    if (chainId == 31337) {
        log("Deploying contract....")
        await deploy("MockV3Aggregator", {
            //contract: "MockAggregator",
            from: deployer,
            args: [DECIMAL, INITIAL_VALUE],
            log: true,
        })
        log("MockAggregator deployed....")
    }
}
//module.exports.tags
module.exports.tags = ["all", "mock"]
