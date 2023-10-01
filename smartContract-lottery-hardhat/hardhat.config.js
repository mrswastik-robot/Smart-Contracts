require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("hardhat-contract-sizer")
require("dotenv").config()
// require("@nomicfoundation/hardhat-chai-matchers");       // won't work with waffle parallely installed




module.exports = {
  solidity: "0.8.18",
  defaultNetwork: "hardhat",

  
  networks: {
    hardhat: {
      chainId: 1337,
      blockConfirmations: 5,
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 5,
    },
    // gasReporter: {
    //   // currency: 'USD',
    //   // gasPrice: 100,
    //   enabled: false,
    // },

    localhost: {
      url: "http://127.0.0.1:8545/",
      //accounts: "thanks hardhat",
      chainId: 31337,
    }
  },


  namedAccounts: {
    deployer: {
      default: 0,
      1: 0,
    },
    player1: {
      default: 1,
    },
  },
};
