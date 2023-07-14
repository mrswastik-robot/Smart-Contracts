
const { assert, expect } = require("chai");
const {deployments, ethers , getNamedAccounts} = require("hardhat");
//require hardhat se kro yaa hre se, dono kindoff similar se
//yaad kro getNamedAccounts() se hume deployer milta hai aur ise ham hre se import krte the yaha hardhat se kr lenge


describe("FundMe", () => { 

    let fundme;
    let deployer;
    let mockV3Aggregator;

    //sbse pehle to deploy krna padega, simpleStorage me contractFactory se deploy kr dete the lekin hamne iss project me hardhat-deploy use krna hain na

    beforeEach(async () => {

        // const accounts = await ethers.getSigners();  //this will give us the list of all the accounts in the network section of hardhat.config.js
        // const accoutZero = accounts[0];  //deployer is the first account in the list of accounts
        //upar wala code bhi kaam kr skta par we are going with the following

        // const {deployer} = await getNamedAccounts();     // ye kisi variable me store karana padega taki hume baad me use kr sake
        deployer = await (getNamedAccounts()).deployer;
        await deployments.fixture(["all"]);    //this will deploy the all the contracts inside deploy folder with 'all' tag
        fundme = await ethers.getContract("FundMe" , deployer);   //this will get the most recently deployed 'FundMe' contract with name FundMe
        mockV3Aggregator = await ethers.getContract("MockV3Aggregator" , deployer);
    });


    describe("constructor" ,() => {

        it("Sets the Aggregator address correctly", async function( ){
            const response = await fundme.priceFeed();
            assert.equal(response , mockV3Aggregator.address);
        })
    })


    describe("fund" , async function ()  {
        it("Fails if you don't send enough eth" , async function() {
            await expect(fundme.fund()).to.be.revertedWith("You need to spend more ETH!!");  
        }
        );

    })


});