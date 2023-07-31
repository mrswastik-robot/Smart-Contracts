
const { network } = require("hardhat");
const {developmentChains,} = require("../helper-hardhat-config");

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(chainId == 31337 || chainId == 1337 ){

        // Deploy a mock vrf coordinator
    }


};