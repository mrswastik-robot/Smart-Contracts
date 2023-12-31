
const { network  , ethers} = require("hardhat");
const {developmentChains,} = require("../helper-hardhat-config");

const BASE_FEE = ethers.parseEther('0.25') // 0.25 is this the premium in LINK?
const GAS_PRICE_LINK = 1e9 // link per gas, is this the gas lane? // 0.000000001 LINK per gas

module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(chainId == 31337 || chainId == 1337 ){

        log("Local network detected, deploying mocks...")
        // Deploy a mock vrf coordinator
        await deploy("VRFCoordinatorV2Mock", {
            from: deployer,
            log: true,
            args: [BASE_FEE, GAS_PRICE_LINK],
            waitConfirmations: 1,
        }); 

        log("Mocks deployed balle balle")
        log("-------------------------------------")
    }

};

module.exports.tags = ["all", "mocks"];