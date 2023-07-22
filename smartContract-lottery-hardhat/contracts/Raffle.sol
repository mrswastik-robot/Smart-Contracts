// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/interfaces/AutomationCompatibleInterface.sol";      //preformUpKeep aur checkUpKeep function k liye ye import kiya hain

//errors
error Raffle__NotEnoughETHEntered();
error Raffle__TransferToWinnerFailed();
error Raffle__NotOpen();
error Raffle__UpkeepNotNeeded();


contract Raffle is VRFConsumerBaseV2, AutomationCompatibleInterface {
    //type declarations or ENUMS
    enum RaffleState {
        OPEN,
        CALCULATING
    } //ye tb k liye jaise maanlo constructor me open set kr diya to koi bhi participate kr skta , jab ham winner decide kr rhe honge tab pending me rkh lenge aur jab winner decide ho chuka hoga to closed kr denge ,
    //ye checkUpKeep me kaam aayega

    //state variables
    uint256 private immutable i_entranceFee;
    address payable[] private s_players; //needed to make address array payable coz when one of the player wins we need to pay him the prize money

    VRFCoordinatorV2Interface private immutable i_vrfCoordinator; //named as 'Coordinator' in the chainlink example contract

    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private immutable i_callbackGasLimit;
    uint32 private constant NUM_WORDS = 1;

    //Lottey variables
    address private s_recentWinner;
    RaffleState private s_raffleState; //ye upar enum se aa rha hain , isko construcor me open set kr do taaki deploy hote hi log participate krne lage
    uint256 private s_lastTimeStamp; //ye chekcUpKeep me kaam aayega , isko constructor me jaise hi deploy hora tabbhi block.timestamp set kr do
    uint256 private immutable i_interval; //ye bhi checkUpKeep me kaam aayega , isko constructor me jaise hi deploy hora tabbhi set kr do

    //Events
    event RaffleEnter(address indexed player);
    event RequestRaffleWinner(uint256 indexed requestId);
    event WinnerPicked(address indexed winner);

    constructor(
        address vrfCoordinatorV2,
        uint256 entranceFee,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit,
        uint256 interval // how long you wanna wait for the chainlink automation to pick a winner in set intervals
    ) VRFConsumerBaseV2(vrfCoordinatorV2) {
        i_entranceFee = entranceFee;

        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinatorV2);

        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;

        s_raffleState = RaffleState.OPEN;
        s_lastTimeStamp = block.timestamp;
        i_interval = interval;
    }

    function enterRaffle() public payable {
        // require(msg.value > i_entranceFee, "Not enough ETH to enter the raffle");    //but we are not going to do this way coz storing such strings in memory is expensive , so we will use custom errors
        if (msg.value < i_entranceFee) {
            revert Raffle__NotEnoughETHEntered();
        }

        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__NotOpen();
        }

        s_players.push(payable(msg.sender)); //had to use 'payable' coz we were pushing no pushing non-payable address into payable array , so we typecasted it

        emit RaffleEnter(msg.sender);
    }

    //chainlink functions are checkUpkeep and performUpkeep , these enable us to use the keeper network to automate the process of picking a winner from time to time so that we don't have to do anything manually

    /**
     * @dev This checkUpKeep() is the function that the Chainlink Keeper nodes call
     * they look for `upkeepNeeded` to return True.
     * the following should be true for this to return true:
     * 1. The time interval has passed between raffle runs.
     * 2. The lottery is open.
     * 3. The contract has ETH.
     * 4. Implicity, your subscription is funded with LINK.
     *
     * ye true return kre ga tabbhi performUpKeep chalega...
     * earlier we named performUpKeep as requestRandomWinner , but now we are gonna change it to performUpKeep coz we are gonna use the keeper network to automate the process of picking a winner from time to time so that we don't have to do anything manually
     */

    function checkUpkeep(  bytes memory /*checkData*/)
        public      //earlier it was external but we changed it to public , so that we can call it from the inside of the contract , external function can only be called from outside the contract
        view
        override
        returns (bool upkeepNeeded, bytes memory /*performData*/)
    {
        bool isOpen = (RaffleState.OPEN == s_raffleState); // this will be true if the raffle is open
        bool timePassed = ((block.timestamp - s_lastTimeStamp) > i_interval);
        bool hasPlayers = (s_players.length > 0);
        bool hasBalance = (address(this).balance > 0);
        upkeepNeeded = (isOpen && timePassed && hasPlayers && hasBalance);

        return (upkeepNeeded , "0x0");
    }

    function performUpkeep(bytes calldata /*performData*/) external override {

        (bool upkeepNeeded, ) = checkUpkeep("");
        if(!upkeepNeeded){
            revert Raffle__UpkeepNotNeeded();
        }



        //requesting a random winner
        //then doing something with it
        //so it's a 2 tansaction process

        s_raffleState = RaffleState.CALCULATING; //to change the state of the raffle to calculating taaki ab koi participate na kr paaye kyunki enterRaffle function me check kr rhe hain ki raffle open hai ya nhi
        uint256 requestId = i_vrfCoordinator.requestRandomWords( //this .requestRandomWords return a request id
            i_gasLane, // keyHash,
            i_subscriptionId, //  s_subscriptionId,
            REQUEST_CONFIRMATIONS, //requestConfirmations,
            i_callbackGasLimit, //callbackGasLimit,
            NUM_WORDS
        );
        emit RequestRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /*requestId*/,
        uint256[] memory randomWords
    ) internal override {
        //once we get a random number we want to pick a winnder from the players array (s_players)
        //here there is an array of randomWords , but we are only getting one big random word , so we will use randomWords[0]

        uint256 indexOfRandomWinner = randomWords[0] % s_players.length;
        address payable recentWinner = s_players[indexOfRandomWinner]; //to get the address of the winner

        s_recentWinner = recentWinner; //to store the address of the winner in the state variable
        s_raffleState = RaffleState.OPEN; //to change the state of the raffle to open again so that people can participate again kyunki abto winner mill hi chuka na
        s_players = new address payable[](0); //to reset the players array to 0 so that new people can participate again
        s_lastTimeStamp = block.timestamp;    //to reset the last time stamp to the current time so that the next raffle can start after the interval


        //ab iss recentWinner ko uske prize money dena hai , so we will transfer all the money that others have entered in the raffle to the winner
        (bool success, ) = recentWinner.call{value: address(this).balance}("");
        // require(success, "Transfer to winner failed")         // could have done like this too but we are not doing this coz storing such strings in memory is expensive , so we will use custom errors
        if (!success) {
            revert Raffle__TransferToWinnerFailed();
        }

        //now we have picked a winner , we don't have any track or history of previous winners , so we are gonna emit an event so that there is always an easily queriable history of event winners //watch at 14:27

        emit WinnerPicked(recentWinner);
    }

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayer(uint256 index) public view returns (address) {
        return s_players[index];
    }

    function getRecentWinner() public view returns (address) {
        return s_recentWinner;
    }

    // function checkUpkeep(
    //     bytes calldata checkData
    // ) external override returns (bool upkeepNeeded, bytes memory performData) {}

    // function performUpkeep(bytes calldata performData) external override {}
}