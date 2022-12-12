//imports

const { assert, expect } = require("chai")
const { network, getNamedAccounts, deployments, ethers } = require("hardhat")
const { developmentChains } = require("../../helper-hardhat-config")

// development chain only go thru the test
!developmentChains.includes(network.name)
    ? describe.skip
    : describe("FundMe", async () => {
          //declarations
          let deployer
          let fundMe
          let mockV3Aggregator
          const sendValue = ethers.utils.parseEther("1")
          const lowvalue = ethers.utils.parseEther("0.000001")
          console.log(`low value = ${lowvalue}`)

          //beforeEach --get all required contracts ready
          beforeEach(async () => {
              deployer = (await getNamedAccounts()).deployer
              await deployments.fixture(["all"])
              fundMe = await ethers.getContract("FundMe", deployer)
              //mockV3Aggregator = await ethers.getContract("MockV3Aggregator", deployer)
              mockV3Aggregator = await ethers.getContract("MockV3Aggregator")
          })

          //describe constructor
          describe("constructor", async () => {
              it("Sets the aggregator addresses correctly", async () => {
                  const response = await fundMe.priceFeed()
                  //console.log(`priceFeed = ${response}`)

                  assert.equal(response, mockV3Aggregator.address)
              })
          })
          //describe fund
          describe("fund", async () => {
              it("Fails if you don't sent enough Eth", async () => {
                  await expect(
                      fundMe.fund({ value: lowvalue })
                  ).to.be.revertedWith("You need to spend more ETH!")
              })

              it("Updates the amount funded data structure", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.addressToAmountFunded(deployer)
                  assert.equal(sendValue.toString(), response.toString())
              })

              it("Adds funder to array of funders", async () => {
                  await fundMe.fund({ value: sendValue })
                  const response = await fundMe.funders(0)
                  assert.equal(deployer, response)
              })
          })

          //describe withdraw
          describe("withdraw", async () => {
              beforeEach(async () => {
                  await fundMe.fund({ value: sendValue })
              })

              it("withdraws ETH from a single funder", async () => {
                  const startingContractBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  const starting = startingContractBalance.add(
                      startingDeployerBalance
                  )

                  transactionResponse = await fundMe.withdraw()
                  transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingContractBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  const ending = endingContractBalance.add(
                      endingDeployerBalance
                  )

                  assert.equal(endingContractBalance.toString(), "0")
                  assert.equal(
                      starting.toString(),
                      ending.add(gasCost).toString()
                  )
              })

              it("withdraws Eth from multiple accounts", async () => {
                  const accounts = await ethers.getSigners()

                  for (i = 1; i < 6; i++) {
                      const fundMeConnectedContract = fundMe.connect(
                          accounts[i]
                      )
                      await fundMeConnectedContract.fund({ value: sendValue })
                  }

                  const startingContractBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const startingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  const starting = startingContractBalance.add(
                      startingDeployerBalance
                  )

                  transactionResponse = await fundMe.withdraw()
                  transactionReceipt = await transactionResponse.wait(1)
                  const { gasUsed, effectiveGasPrice } = transactionReceipt
                  const gasCost = effectiveGasPrice.mul(gasUsed)

                  const endingContractBalance =
                      await fundMe.provider.getBalance(fundMe.address)
                  const endingDeployerBalance =
                      await fundMe.provider.getBalance(deployer)
                  const ending = endingContractBalance.add(
                      endingDeployerBalance
                  )

                  //console.log(`Balance = ${endingContractBalance}`)

                  assert.equal(endingContractBalance.toString(), "0")
                  assert.equal(
                      starting.toString(),
                      ending.add(gasCost).toString()
                  )

                  for (i = 1; i < 6; i++) {
                      const response = await fundMe.addressToAmountFunded(
                          accounts[i].address
                      )
                      assert.equal(response.toString(), "0")

                      await expect(fundMe.funders(0)).to.be.reverted
                  }
              })

              it("Only allows the owner to withdraw", async () => {
                  const accounts = await ethers.getSigners()
                  const fundMeConnectedContract = await fundMe.connect(
                      accounts[4]
                  )
                  await expect(fundMeConnectedContract.withdraw()).to.be
                      .reverted
              })
          })
      })
