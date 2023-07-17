
//Staging test for after deployement , to ensure after deployement on the testnet that everything is working as expected to be

const {getNamedAccounts , ethers, deployments} = require("hardhat");
const {developmentChains} = require("../../helper-hardhat-config");
const {assert} = require("chai");

developmentChains.includes(network.name) ? describe.skip("Staging tests", () => {}) :

//only going to run this if we are on test net and not on a local network(deploymentChains)
describe("FundMe", () => {
    let fundme;
    let deployer;
    const sendValue = ethers.utils.parseEther("1");

    beforeEach(async () => {
        deployer = (await getNamedAccounts()).deployer;
        fundme = await ethers.getContract("FundMe" , deployer);
        //just this , not going to deploy this (through fixtures) , coz on staging test we are assuming it has already been deplyed on a testnet
        //and neither 'mock' is required as staging test is only for test nets , not for the local network
    });

    it("Allows people to fund and owner to withDrawAll" , async () => {
        await fundme.fund({value : sendValue});
        await fundme.withdrawAll();
        const addressBalanceAtLast = await fundme.provider.getBalance(fundme.address);
        assert.equal(addressBalanceAtLast.toString() , "0");
        //just diya aur just hi le liya to 0 hi bacha na contract me
    })
})

//Ok so this test run when deploying to a testnet , and we are only running 1 passing test , just the above one 
//when deploying to local network , we are running the unit test where 9 cases have to be passed 
//12:17