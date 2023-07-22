// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";

//errors
error Raffle__NotEnoughETHEntered();
error Raffle__TransferToWinnerFailed();


contract Raffle is VRFConsumerBaseV2
{

    //state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players;        //needed to make address array payable coz when one of the player wins we need to pay him the prize money
   
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;   //named as 'Coordinator' in the chainlink example contract
   
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;


    //Lottey variables
    address private s_recentWinner;


    //Events
    event RaffleEnter(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked ( address indexed winner);


    constructor(address vrfCoordinatorV2 ,
     uint256 entranceFee ,
     bytes32 gasLane,
     uint64 subscriptionId,
     uint32 callbackGasLimit
    ) 
    VRFConsumerBaseV2(vrfCoordinatorV2)
    {
        i_entranceFee = entranceFee;

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;
    }


    function enterRaffle() public payable
    {
        // require(msg.value > i_entranceFee, "Not enough ETH to enter the raffle");    //but we are not going to do this way coz storing such strings in memory is expensive , so we will use custom errors
        if(msg.value < i_entranceFee) {revert Raffle__NotEnoughETHEntered(); }

        s_players.push(payable(msg.sender));                      //had to use 'payable' coz we were pushing no pushing non-payable address into payable array , so we typecasted it

        emit RaffleEnter(msg.sender);
    }

    function requestRandomWinner() external {
        //requesting a random winner
        //then doing something with it 
        //so it's a 2 tansaction process

        uint256 requestId = i_vrfCoordinator.requestRandomWords(           //this .requestRandomWords return a request id 
            i_gasLane ,                   // keyHash,
            i_subscriptionId,            //  s_subscriptionId,
            REQUEST_CONFIRMATIONS,       //requestConfirmations,
            i_callbackGasLimit,         //callbackGasLimit,
            NUM_WORDS
        );
        emit RequestRaffleWinner(requestId);
    }

    function fulfillRandomWords(uint256 /*requestId*/, uint256[] memory randomWords) internal override
    {
        //once we get a random number we want to pick a winnder from the players array (s_players)
        //here there is an array of randomWords , but we are only getting one big random word , so we will use randomWords[0]

        uint256 indexOfRandomWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfRandomWinner];                           //to get the address of the winner

        s_recentWinner = recentWinner;                                                          //to store the address of the winner in the state variable

        //ab iss recentWinner ko uske prize money dena hai , so we will transfer all the money that others have entered in the raffle to the winner
        (bool success, ) = recentWinner.call{value: address(this).balance}("");      
        // require(success, "Transfer to winner failed")         // could have done like this too but we are not doing this coz storing such strings in memory is expensive , so we will use custom errors     
        if(!success) {revert Raffle__TransferToWinnerFailed(); } 

        //now we have picked a winner , we don't have any track or history of previous winners , so we are gonna emit an event so that there is always an easily queriable history of event winners //watch at 14:27

        emit WinnerPicked(recentWinner);


    }


    function getEntranceFee() public view returns(uint256)
    {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address)
    {
        return s_players[index];
    }

    function getRecentWinner() public view returns(address)
    {
        return s_recentWinner;
    }
}