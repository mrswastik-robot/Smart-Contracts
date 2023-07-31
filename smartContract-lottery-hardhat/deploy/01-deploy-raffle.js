const { network } = require("hardhat");


module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    
    await deploy("Raffle", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.conifg.blockConfirmations || 1,
    });
    }