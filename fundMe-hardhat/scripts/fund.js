const {getNamedAccounts, ethers} = require('hardhat');

async function main() {
    // const deployer = await getNamedAccounts().deployer;
    //or can be written as
    const {deployer} = await getNamedAccounts();
    const fundme = await ethers.getContract("FundMe", deployer);
    console.log("Funding contract at address: ", fundme.address, "...");
    const transactionResponse = await fundme.fund({
        value: ethers.utils.parseEther("0.1")
    });
    await transactionResponse.wait(1);
    console.log("Funded!");
}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
}
);