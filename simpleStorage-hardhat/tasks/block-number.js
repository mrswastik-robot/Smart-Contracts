const {task} = require("hardhat/config");

task("block-number", "Prints the current block number", async (taskArgs, hre) => {

    //taskArgs are the arguments that we pass to the task from the command line, that we here don't have any
    //hrer is the hardhat runtime environment, it has all the information about the hardhat project, it's equivalent to require("hardhat") in deploy.js

    const blockNumber = await hre.ethers.provider.getBlockNumber();
    console.log("Current block number: ", blockNumber);
    }
);

module.exports = {};

//tasks and scripts both can do the work , but prefer mostly scripts
//tasks are good for plugin stuff and scripts are good for your own local development enivronment