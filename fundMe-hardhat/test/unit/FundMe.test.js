
const { assert, expect } = require("chai");
const {deployments, ethers , getNamedAccounts} = require("hardhat");
//require hardhat se kro yaa hre se, dono kindoff similar se
//yaad kro getNamedAccounts() se hume deployer milta hai aur ise ham hre se import krte the yaha hardhat se kr lenge


describe("FundMe", function()  { 

    let fundme;
    let deployer;
    let mockV3Aggregator;
    const sendValue = ethers.utils.parseEther("1")   //did this instead of writing 1000000000000000000

    //sbse pehle to deploy krna padega, simpleStorage me contractFactory se deploy kr dete the lekin hamne iss project me hardhat-deploy use krna hain na

    beforeEach(async () => {

        // const accounts = await ethers.getSigners();  //this will give us the list of all the accounts in the network section of hardhat.config.js
        // const accoutZero = accounts[0];  //deployer is the first account in the list of accounts
        //upar wala code bhi kaam kr skta par we are going with the following

        // const {deployer} = await getNamedAccounts();     // ye kisi variable me store karana padega taki hume baad me use kr sake
        deployer = (await getNamedAccounts()).deployer;
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
        });

        it("Updates the mapping correctly" , async function() {
            await fundme.fund({value : sendValue});
            const response = await fundme.addressToAmountFunded(deployer);
            assert.equal(response.toString() , sendValue.toString());
        });

        it("Add the funders to the array of funders" , async function() {
            await fundme.fund({value : sendValue});
            const response = await fundme.funders(0);
            assert.equal(response , deployer);
        });

    })

    //now test withDrawAll() function
    describe("withdrawAll" , async function() {
        //for testing  withDrawAll() function we need to have some funds already in the contract so can we can test withdrawAll() function
        //so we will fund the contract before testing withdrawAll() functions using in beforeEach()

        beforeEach(async () => {
            await fundme.fund({value : sendValue});
        });

        it("Withdraws ETH in correct amount from a single funder" , async function() {

            //Arrange

            //getting the intial balance of fundme contract
            const startingFundMeBalance = await fundme.provider.getBalance(fundme.address);

            //getting the intial balance of deployer
            const startingDeployerBalance = await fundme.provider.getBalance(deployer);

            //Act
            //calling withdrawAll() function
            const transactionResponse = await fundme.withDrawAll();
            const transactionReceipt = await transactionResponse.wait(1);  //watch at 11:30 , we have to come here from Assert part for the gas to be measured and debugging section is covered that how to debug in VScode 
            // how to extract the gasUsed and effectiveGasPrice from the transactionReceipt is covered at 11:30 using brekapoints and debugging using VScode
            const {gasUsed , effectiveGasPrice} = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);
            //can't multiply it like 'gasUsed * effectiveGasPrice' as both are of type BigNumber and we can't multiply them like this , same is applied for addition , subtraction and division in case of bigNumber

            //now we should be able to see that complete startingFundmeBalance has been transferred to the startingDeployerBalance
            //getting the final balance of fundme contract
            const endingFundMeBalance = await fundme.provider.getBalance(fundme.address);
            const endingDeployerBalance = await fundme.provider.getBalance(deployer);

            //Assert
            assert.equal(endingFundMeBalance , 0);
            // assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString() , endingDeployerBalance.toString()); //ye were doing this expecting it be correct but it's not , jab withDrawAll call hua line 81 me to deployer in khuch gas bhi spend kiya as he is calling a transaction
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString() , endingDeployerBalance.add(gasCost).toString());


        });

        it("Withdraws correctly from multiple funders" , async function() {

            //Arrange
            const accounts = await ethers.getSigners();    //bahot saare account mil gye
            //now we will loop with all the accounts and then call fund function with each account
            for (let i = 1; i < 5; i++) {        //starting with 1 as 0th account is the deployer as in the line 24
                const fundmeConnectedAccount = await fundme.connect(accounts[i]); 
                await fundmeConnectedAccount.fund({value: sendValue})  //this will connect the account with the fundme contract
            }
            
            //we have funded the contract with 5 accounts
            //ab upar se copy paste krlo
            const startingFundMeBalance = await fundme.provider.getBalance(fundme.address);
            const startingDeployerBalance = await fundme.provider.getBalance(deployer);

            //Act
            const transactionResponse = await fundme.withDrawAll();
            const transactionReceipt = await transactionResponse.wait(1); 
            const {gasUsed , effectiveGasPrice} = transactionReceipt;
            const gasCost = gasUsed.mul(effectiveGasPrice);

            // Assert
            const endingFundMeBalance = await fundme.provider.getBalance(fundme.address);
            const endingDeployerBalance = await fundme.provider.getBalance(deployer);

            assert.equal(endingFundMeBalance , 0);
            assert.equal(startingFundMeBalance.add(startingDeployerBalance).toString() , endingDeployerBalance.add(gasCost).toString());

            //yaha tak to similar tha upar wale section se

            //now make sure that funders are reset properly
            for (let i = 1; i < 5; i++) {        
                assert.equal(await fundme.addressToAmountFunded(accounts[i].address) , 0);  //this will check that all the accounts have been reset to 0
            }


        })

        it("Only owner (the first deployer in line 24) is able to withDrawAll" , async function() {
            const accounts = await ethers.getSigners();    //bahot saare account mil gye
            const attacker = accounts[1];                  //now let's assume ki ye attacker account is trying to call withDrawAll() function
            const fundmeConnectedAttacker = await fundme.connect(attacker); //this will connect the attacker account with the fundme contract
            await expect(fundmeConnectedAttacker.withDrawAll()).to.be.revertedWith("You are not the owner of this contract.");  //this will check that the attacker account is not able to call withDrawAll() function
        })
    })
    
            
          

});