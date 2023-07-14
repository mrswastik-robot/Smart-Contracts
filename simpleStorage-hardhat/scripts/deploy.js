//imports

const {ethers , run ,network} = require("hardhat");
//by importing  run we get to run the hardhat tasks from the command line
//by importing network we get to know which network we are deploying to whether test network or local hardhat network , basically we get to know the network configuraion information


//main async function
async function main() {

  const SimpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
  console.log("Deploying SimpleStorage...");
  const simpleStorage = await SimpleStorageFactory.deploy();
  await simpleStorage.deployed();
  console.log("SimpleStorage deployed to:", simpleStorage.address);

  // console.log(network.config);

  //now as for veryfing the contract , we don't want the contract to be verified when we are deploying in the hardhat local network, only needs to be verfifed when we are deploying to the mainnet or testnet
  // await verify(simpleStorage.address, []);

  if(network.config.chainId == 11155111 && process.env.ETHERSCAN_API_KEY) {
    //etherscan ko thoda time dete hai contract ko verify karne me , so we will wait for 6 blocks to be mined
    console.log("Waiting for 6 blocks to be mined on order for verfication...");
    await simpleStorage.deployTransaction.wait(6);
    await verify(simpleStorage.address, []);
  }

  //now interacting with the contract
  const currentValue = await simpleStorage.retreive();
  console.log("Current value:", currentValue.toString());

  //update the current value
  const transactionResponse = await simpleStorage.store(7);
  //wait for the transaction to be mined 1 block
  await transactionResponse.wait(1);
  const updateValue = await simpleStorage.retreive();
  console.log("Updated value:", updateValue.toString());

}


async function verify( contractAddress, constructorArguments) {
  console.log("Verifying contract...");

  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: constructorArguments,
    });
  }
  catch (e) {
    if(e.message.includes("Contract source code already verified")) {
      console.log("Contract already verified");
    }
    else {
      console.log("Failed to verify contract");
      console.log(e);
    }
  }
  
}


//run main function
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }
);