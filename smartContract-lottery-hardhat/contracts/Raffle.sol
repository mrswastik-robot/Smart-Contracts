// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

error Raffle__NotEnoughETHEntered();


contract Raffle 
{

    //state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;        //needed to make address array payable coz when one of the player wins we need to pay him the prize money

    constructor(uint256 entranceFee)
    {
        i_entranceFee = entranceFee;
    }


    function enterRaffle() public payable
    {
        // require(msg.value > i_entranceFee, "Not enough ETH to enter the raffle");    //but we are not going to do this way coz storing such strings in memory is expensive , so we will use custom errors
        if(msg.value < i_entranceFee) {revert Raffle__NotEnoughETHEntered(); }

        s_players.push(payable(msg.sender));                      //had to use 'payable' coz we were pushing no pushing non-payable address into payable array , so we typecasted it
    }

    // function pickRandomWinner(){}


    function getEntranceFee() public view returns(uint256)
    {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address)
    {
        return s_players[index];
    }
}