
const { network, ethers } = require("hardhat");
const {developmentChains, networkConfig} = require("../helper-hardhat-config");

const VRF_SUB_FUND_AMOUNT = ethers.utils.parseEther("2");


module.exports = async ({ getNamedAccounts, deployments }) => {

    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let VRFCoordinatorV2Address;
    let subscriptionId;

    if(developmentChains.includes(network.name))
    {
        const VRFCoordinatorV2 = await deployments.get("VRFCoordinatorV2Mock");
        VRFCoordinatorV2Address = VRFCoordinatorV2.address;
        const transactionResponse = await VRFCoordinatorV2.createSubscription();
        const transactionReceipt = await transactionResponse.wait(1);
        subscriptionId = transactionReceipt.events[0].args.subId;

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
    const arguments = [
                        VRFCoordinatorV2Address,
                        subscriptionId,
                        networkConfig[chainId]["entranceFee"],
                        networkConfig[chainId]["gasLane"],
                        networkConfig[chainId]["callbackGasLimit"],
                        networkConfig[chainId]["interval"],
                        ]
        
    
    const raffle = await deploy("Raffle", {
        from: deployer,
        args: [],
        log: true,
        waitConfirmations: network.conifg.blockConfirmations || 1,
    });
    }
