const {getNamedAccounts, ethers} = require('hardhat');

async function main() {
    // const deployer = await getNamedAccounts().deployer;
    //or can be written as
    const {deployer} = await getNamedAccounts();
    const fundme = await ethers.getContract("FundMe", deployer);
    console.log("Withdrawing contract...");
    const transactionResponse = await fundme.withDrawAll();
    await transactionResponse.wait(1);
    console.log("Withdrawn!");

}

main()
.then(() => process.exit(0))
.catch(error => {
    console.error(error);
    process.exit(1);
}
);