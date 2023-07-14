const { network } = require("hardhat")

const {networkConfig, developmentChains} = require("../helper-hardhat-config")

// const {verify} = require("../utils/verify");

//imports
//no main function 
//no call to main function

//can be done in the following way as well
// async function main(hre) {
//     console.log("hi");
    //    hre.getNamedAccounts();
    //      hre.deployments;
// }
// module.exports.default = main;




//getNamedAccounts and deployments are objects coming from hre
module.exports = async ({ getNamedAccounts, deployments }) => {
    const { deploy,log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = await network.config.chainId;

    let ethUsdPriceFeedAddress;
    if(chainId == 31337){
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }else{
        ethUsdPriceFeedAddress = networkConfig[chainId].ethUsdPriceFeed;
    }
    log("----------------------------------------------------");
    log("deploying contracts with the account: ", deployer);
    log("chainId: ", chainId);
    log("ethUsdPriceFeedAddress: ", ethUsdPriceFeedAddress);
    log("----------------------------------------------------");


    //deploying the contract
    //isse pehle contractFacoory use krte the deploy krne ke liye par yaha to apan ne hardhat-deploy install kiya hain na to wo use krenge , wo scripts ko deploy krne asaan bana deta
    const fundMe = await deploy("FundMe", {
        from: deployer,
        args: [ethUsdPriceFeedAddress],    //priceFeedAddress abhi abhi to hamne pass kiya tha FundMe.sol me , watch at 10:25:00
        log: true,
        // we need to wait if on a live network so we can verify properly
        waitConfirmations: network.config.blockConfirmations || 1,     //this is coming from hardhat.config.js
    });

    log("FundMe deployed to: ", fundMe.address);
    log("----------------------------------------------------");
    log("You have deployed to a live network!");

    //verifying the contract only when deploying to a testnet , no need to verify on localhost network or hardhat network
    if(!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY){
        log("waiting to verify...");
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
        log("verifying contract..."); 

    }

}

module.exports.tags = ["all", "fundme"]