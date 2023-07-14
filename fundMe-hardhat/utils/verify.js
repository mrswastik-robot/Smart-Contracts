const {run} = require("hardhat");


//the main reason why we are writing verify function in utils is because we want to use it in multiple  deploy scrips , so we can just import it from here and use it in any deploy script
//agar 50 deploy scripts hote to har ek me verify function likhna padta , isliye utils me likh diya
//bhai copilot gawd hain kya 

const verify = async (contractAddress, args) => {
    console.log("Verifying contract...")
    try {
      await run("verify:verify", {
        address: contractAddress,
        constructorArguments: args,
      })
    } catch (e) {
      if (e.message.toLowerCase().includes("already verified")) {
        console.log("Already verified!")
      } else {
        console.log(e)
      }
    }
  }
  
  module.exports = { verify }