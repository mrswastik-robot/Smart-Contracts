// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

library PriceConverter
{
    function getPrice(AggregatorV3Interface priceFeed) internal view returns (uint)            //library me har function me internal dena hota
    {
        //  AggregatorV3Interface priceFeed = AggregatorV3Interface(
        //     0x694AA1769357215DE4FAC081bf1f309aDC325306
        // );

        //ye upar wala code aur address aggregator k andr jo that wo shi tha sirf sepolia k liye, abhi humne constructor me address pass kiya hain jis bhi chain ka chahiye fundMe k andar aur 
        //waha se yaha getConversion me bheja phir getPrice me ab yaha se priceFeed ko neeche use kr k uss chain k hisaab se price nikal liya

        (, int256 answer, , , ) = priceFeed.latestRoundData();
        // ETH/USD rate in 18 digit
        return uint256(answer * 10000000000);
    }

    function getConversionRate(uint ethAmount , AggregatorV3Interface priceFeed) internal view returns(uint)
    {
        uint ethPrice = getPrice(priceFeed);
        uint ethAmountInUSD = (ethPrice * ethAmount) / 1000000000000000000;

        return ethAmountInUSD;

    }
    
}

