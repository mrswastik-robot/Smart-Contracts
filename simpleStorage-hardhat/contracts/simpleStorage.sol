// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

//Patric Collins is fuckin starting from this contract

contract SimpleStorage
{
    //want to create an array where every people has a favorite number and a name.

    uint favno; //just for store function so that it can be used from StorageFactory.sol

    struct People
    {
        uint favouriteNumber;
        string name;
    }

    People[] public peopleArray;

    mapping(string => uint) public  nameToFavNum;
    //naam daalne pr hame uss aadmi ka fav number pata chal jaaye

    function addPerson(string memory _name, uint _favNumber) public 
    {
        People memory newPeople =  People(_favNumber, _name);  //watch at 2hr 43min to understand completely
        peopleArray.push(newPeople);

        nameToFavNum[_name] = _favNumber;

    }

    //writing a simple function store just to be overridden by next contract StorageFactory.sol

    function store(uint _favoritenumber) public virtual 
    {
        favno = _favoritenumber;
    }

    function retreive() public view returns (uint)
    {
        return favno;

    }

    function funForStorageFactory(string memory _name) public view returns (uint)
    {
        return nameToFavNum[_name];
    }


}