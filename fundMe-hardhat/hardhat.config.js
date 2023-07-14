require("dotenv").config();

// require("@nomicfoundation/hardhat-toolbox")


// require("@nomiclabs/hardhat-etherscan");
// require("@nomicfoundation/hardhat-verify");
require("@nomiclabs/hardhat-waffle");
require("hardhat-gas-reporter");
require("solidity-coverage");
require("hardhat-deploy");
require("@nomiclabs/hardhat-etherscan")


// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  solidity: {
    compilers: [{version: '0.8.18'}, {version: '0.6.6'}]
  },
  
  defaultNetwork: "hardhat",

  networks: {

    hardhat: {
      chainId: 31337,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 5,
    },

    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: "thanks hardhat",
      chainId: 31337,
    }
  },
  gasReporter: {
    enabled: true,
    currency: "USD",
    outputFile: "gasReport.txt",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },

  namedAccounts: {
    deployer: {
      default: 0,           //bahot mushkil se mila ye, all thanks to github discussions
    },
  },

  // verify: {
  //   autoVerify: true,
  //   runsOn: "sepolia",

  // },
};
