
const { ethers, network } = require("hardhat");
const fs = require("fs");

const FRONT_END_ADDRESS = "../nextjs-smartlottery/constants/contractAddresses.json";
const FRONT_END_ABI = "../nextjs-smartlottery/constants/abi.json";

const deploymentScript = require("./01-deploy-raffle.js");


module.exports = async function () {

    if(process.env.UPDATE_FRONT_END)
    {
        console.log('Updating front end...');
        await updateContractAddresses();
        await updateABI();
    }
}

async function updateABI() {

    // const raffle = await ethers.getContract('Raffle');
    // console.log(raffle.address);
    // fs.writeFileSync(FRONT_END_ABI, raffle.interface.format(ethers.FormatTypes.json));

    const raffle = await deploymentScript({ getNamedAccounts, deployments }); // Call your deployment script
    console.log("Raffle contract address1:", raffle.address);
    // fs.writeFileSync(FRONT_END_ABI, raffle.interface.format(ethers.FormatTypes.json));
    fs.writeFileSync(FRONT_END_ABI, JSON.stringify(raffle.abi));     //got this from co-pilot and surprisingly it worked

}

async function updateContractAddresses() {
    // const raffle = await ethers.getContract('Raffle');
    const raffle = await deploymentScript({ getNamedAccounts, deployments }); // Call your deployment script
    console.log('Raffle contract address2:' , raffle.address);
    const currentAddress = JSON.parse(fs.readFileSync(FRONT_END_ADDRESS, 'utf8'));
    const chainId = network.config.chainId.toString();


    if(chainId in currentAddress)
    {
        if(!currentAddress[chainId].includes(raffle.address))
        {
            currentAddress[chainId].push(raffle.address);
        }
    }else
    {
        currentAddress[chainId] = [raffle.address];
    }

    fs.writeFileSync(FRONT_END_ADDRESS, JSON.stringify(currentAddress));

}

module.exports.tags = ["all", "front-end"];