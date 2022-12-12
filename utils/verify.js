const { run } = require("hardhat")

const verify = async (fundMeAddress, args) => {
    console.log("Veryfying Contract...")

    try {
        await run("verify:verify", {
            address: fundMeAddress,
            constructorArguments: args,
        })
    } catch (e) {
        if (e.message.toLowercase.includes("already verified")) {
            console.log("Already Verified!")
        } else {
            console.log(e)
        }
    }
}

module.exports = { verify }
