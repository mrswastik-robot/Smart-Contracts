// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";
import "./PriceConverter.sol";

contract FundMe
{
    using PriceConverter for uint;

    uint public constant MINIMUM_USD = 50*10**18;
    address[] public funders;
    mapping (address => uint) public addressToAmountFunded;

    address public owner;

    //now making changes coz we are being fundMe to hardhat
    //watch at around 10:25:00
    AggregatorV3Interface public priceFeed;

    constructor(address priceFeedAddress)           //jabbhi deploy krte hain contract waise hi sbse pehle constructor call hota hain , to jaise hi sbse pehle jisne deploy kiya usi ko apan owner set kr diye
    {
        owner = msg.sender;
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    modifier onlyOwner
    {
        require(msg.sender == owner,"You are not the owner of this contract.");
        _;
    }


    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }




    function fund() public payable 
    {
        require(msg.value.getConversionRate(priceFeed) >= MINIMUM_USD, "You need to spend more ETH!!");      //equal to getConversionRate(msg.value) , kyunki library se extract kr rahe na function , to msg.value will already be considered as the first parameter to getConversionRate

        funders.push(msg.sender);
        addressToAmountFunded[msg.sender] += msg.value;
    }

    function withDrawAll() public onlyOwner// contract me bhej to koi bhi skta lekin withdraw sirf owner kr skta jisne deploy kiya contract , sbse pehle msg.sender ko hi apan owner banane waale hain constructor ki madad se
    {
        for(uint index=0; index<funders.length; index++)
        {
            address funderAddress = funders[index];
            addressToAmountFunded[funderAddress] = 0;
        }
        //'funders' array se saare funders uthaaye ek ek kr k , unka address store krte gye 'funderAddress' me aur waha se mapping wali chiz me amount funded by that specific address '0' krte gye

        //resetting the array kyunki abto saare funders khatam , sbke paise utha liye apan ne
        funders = new address[](0); 

        //lekin abhi tk actual paise to transfer kiye hi nhi , chaahe to .send ya .transfer() use kr skte the  .... watch at around 4:53:00

        (bool callSuccess, ) = payable (owner).call{value: address(this).balance}("");
        require(callSuccess, "Call Failed");
    }
}