
import { useWeb3Contract , useMoralis } from "react-moralis";

import { contractAddresses , abi } from "../constants";
import { useEffect , useState} from "react";

import { useNotification } from "web3uikit";

import {ethers} from 'ethers';

export default function LotteryEntrance() {

    const dispatch = useNotification();

    const {chainId: chainIdHex , isWeb3Enabled} = useMoralis();
    // console.log(parseInt(chainIdHex));
    const chainId = parseInt(chainIdHex);
    // console.log(chainId);
    // console.log(contractAddresses); 

    const [entranceFee , setEntranceFee] = useState('0');
    // const [raffleAddress, setRaffleAddress] = useState(null);

    // if(chainId)
    // {
        const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0]: null;
        // const raffleAddress = !isNaN(chainId) && contractAddresses?.[chainId]?.[0] || null;
        console.log(raffleAddress);

    // }

    // useEffect(() => {
    //     if (!isNaN(chainId)) {
    //       // Check if contractAddresses contains an entry for the chainId
    //       if (contractAddresses && contractAddresses[chainId]) {
    //         setRaffleAddress(contractAddresses[chainId][0]);
    //       } else {
    //         setRaffleAddress(null); // No entry for the chainId
    //       }
    //       console.log(raffleAddress);
    //     }
    //   }, [chainId]);



    //running enterRaffle function

    const { runContractFunction: enterRaffle , isFetching, isLoading} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })
    //in the above code ,we need to get raffleEntranceFee to usi k liye ab neeche wala code likha hai

    //running other functions important for entering into the raffle

    const {runContractFunction: gettingEntranceFee} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const {runContractFunction: gettingPlayersNumber} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const {runContractFunction: gettingRecentWinner} = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })


            async function updateUI()
            {
                const entranceFeeFromCall = (await gettingEntranceFee()).toString();
                // setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, 'ether'));     //earlier it was showing 10^18 wei , now it will show in ether format
                setEntranceFee(entranceFeeFromCall);
                console.log(entranceFee);
                //now that we have got entranceFee , we can run the enterRaffle function
            }


    useEffect(() => {
        if(isWeb3Enabled)
        {
            // async function updateUI()
            // {
            //     const entranceFeeFromCall = (await gettingEntranceFee()).toString();
            //     // setEntranceFee(ethers.utils.formatUnits(entranceFeeFromCall, 'ether'));     //earlier it was showing 10^18 wei , now it will show in ether format
            //     setEntranceFee(entranceFeeFromCall);
            //     console.log(entranceFee);
            //     //now that we have got entranceFee , we can run the enterRaffle function
            // }
            updateUI();
        }

    }, [isWeb3Enabled])

    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Transaction Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const handleSuccess = async(tx) => {
        try {
            await tx.wait(1);
            updateUI();
            handleNewNotification(tx);
        } catch (error) {
            console.log(error);
        }
    }

    return(
        <div>
            <button>Enter Lottery</button>

            {
                raffleAddress ? (
                    <div>
                        <p>Entrance Fee: {ethers.utils.formatUnits(entranceFee , 'ether')}ETH</p>
                        <button 
                            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
                            onClick={async () => 
                            await enterRaffle({
                                onSuccess: handleSuccess,
                                onError: (error) => console.log(error),
                            })
                            }
                            disabled={isFetching || isLoading}
                            >
                                {isFetching || isLoading ? 
                                (<div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>) : ("Enter Raffle")}
                            </button>
                    </div>
                ) : (<h1>No Raffle Address Detected</h1>)
            }

        </div>
    )
}