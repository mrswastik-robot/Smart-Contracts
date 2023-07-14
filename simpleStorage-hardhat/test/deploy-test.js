const {ethers} = require("hardhat");
const { expect, assert } = require("chai");

describe("SimpleStorage", function () {
  let simpleStorageFactory , simpleStorage;

  // struct People
  //   {
  //       uint favouriteNumber;
  //       string name;
  //   }

  //   People[] public peopleArray;

  //   mapping(string => uint) public  nameToFavNum;

  //ye upar jo comment out kiya , mujhe laga tha addPerson ki testing k liye ye jaroori hoga kyunki first attempt me test pass ni hua 
  //peopleArray is not defined aaya
  //lekin phir solution dekh kr samajh aaya simepleStorage.peopleArray krne hoga

  beforeEach(async function () {
    simpleStorageFactory = await ethers.getContractFactory("SimpleStorage");
    simpleStorage = await simpleStorageFactory.deploy();
  })

  it("Should start with the favourite number of 0", async function () {
    const currentValue = await simpleStorage.retreive();
    const expectedValue = '0';

    assert.equal(currentValue.toString(), expectedValue);
  });

  it("Should update when we call store", async function () {
    const transactionResponse = await simpleStorage.store(7);
    await transactionResponse.wait(1);

    const currentValue = await simpleStorage.retreive();
    const expectedValue = '7';

    assert.equal(currentValue.toString(), expectedValue);

  });

  //ye saare tests khud se kiya wow
  it("Should add to array when we call addPerson", async function () {
    const transactionResponse = await simpleStorage.addPerson("swastik", '55');
    await transactionResponse.wait(1);

    // const currentFav = await simpleStorage.peopleArray[0].favouriteNumber;
    // const currentName = await simpleStorage.peopleArray[0].name;
    //I don't know why this is not working...

    const {favouriteNumber: currentFav, name: currentName} = await simpleStorage.peopleArray(0);

    const userfav = await simpleStorage.funForStorageFactory("swastik");

    const expectedName = 'swastik';
    const expectedFav = '55';
    const expectedUserFav = '55';

    assert.equal(currentName, expectedName);
    assert.equal(currentFav, expectedFav);
    assert.equal(userfav, expectedUserFav);
  
  });


}); 