require("@nomiclabs/hardhat-waffle");

require("dotenv").config();

//plugins installed
require("@nomicfoundation/hardhat-verify");
require("hardhat-gas-reporter");
require("solidity-coverage");


require("./tasks/block-number");


// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//   const accounts = await hre.ethers.getSigners();

//   for (const account of accounts) {
//     console.log(account.address);
//   }
// });

//hardhat tasks are used to run the scripts from the command line, hum khud k custom tasks bhi bana sakte hai 
//custom tasks yaa to yahi bana lo ya fir tasks folder me bana lo aur phir import kr lo yaha pe


/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: "0.8.18",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
    },

    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: "thanks hardhat",
      chainId: 31337,
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  gasReporter: {
    // currency: 'USD',
    // gasPrice: 100,
    enabled: true,
    currency: 'USD',
    outputFile: 'gas-report.txt',
    noColors: true,
  },
  // solidity-coverage plugin doesn't need anything here , it will automatically run when we run the test command with it's defalut config
};
