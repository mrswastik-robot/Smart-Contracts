
const { network, ethers } = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat-config");

const {verify} = require("../utils/verify.js")

const VRF_SUB_FUND_AMOUNT = ethers.parseEther("2");


module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let VRFCoordinatorV2Address;
    let subscriptionId;

    if(developmentChains.includes(network.name))
    {
        let VRFCoordinatorV2 = await ethers.getContract("VRFCoordinatorV2Mock");
        VRFCoordinatorV2Address = VRFCoordinatorV2.target;
        const transactionResponse = await VRFCoordinatorV2.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        // subscriptionId = transactionReceipt.events[0].args.subId;
        subscriptionId = 1;

        //Funding the subscription
        //usually you would use the LINK token faucet for this
        await VRFCoordinatorV2.fundSubscription(subscriptionId, VRF_SUB_FUND_AMOUNT);
    }
    //now for main net or test nets 
    else
    {
        VRFCoordinatorV2Address = networkConfig[chainId]["vrfCoordinatorV2"];
        subscriptionId = networkConfig[chainId]["subscriptionId"];
    }

    log("-------------------------------------")

    console.log(chainId);

    let config;

    if (networkConfig[chainId]) {
        config = networkConfig[chainId];
        console.log(config);
      } else {
        config = {}; // default config
        console.log('bhakkk jaaa');
      }

    const entranceFee = config?.entranceFee;
    const gasLane = config?.gasLane;
    const callbackGasLimit = config?.callbackGasLimit;
    const interval = config?.interval;
    console.log(entranceFee);


    const arguments = [
                        VRFCoordinatorV2Address,
                        subscriptionId,
                        // networkConfig[chainId]["entranceFee"],
                        entranceFee,
                        // networkConfig[chainId]["gasLane"],
                        // networkConfig[chainId]["callbackGasLimit"],
                        // networkConfig[chainId]["interval"],
                        gasLane,
                        callbackGasLimit,
                        interval,
                        ]
        
    
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: arguments,
        log: true,
        // waitConfirmations: network.config.blockConfirmations || 1,
        waitConfirmations: 1,
    });

    // Verify the deployment
    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        log("Verifying...")
        await verify(raffle.address, arguments)
    }

    log('-------------------------------------');

}

module.exports.tags = ["all", "raffle"];
