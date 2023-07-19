
import { ethers } from "./ether-5.2.esm.min.js"

import {abi ,contractAddress} from "./constants.js"

const connectButton = document.getElementById("connectButton")
const withdrawButton = document.getElementById("withdrawButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
connectButton.onclick = connect
withdrawButton.onclick = withdraw
fundButton.onclick = fund
balanceButton.onclick = getBalance


async function connect()
        {
            if(typeof window.ethereum !== 'undefined')
            {
                try
                {
                    const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
                }
                catch(err)
                {
                    console.error(err);
                }

                connectButton.innerHTML = "Connected";


            }
            else
            {
                connectButton.innerHTML = "Please install MetaMask";
            }
        }


async function fund()
{
    const ethAmount = document.getElementById("ethAmount").value;
    console.log(`Funding with: ${ethAmount}...`)

    if(typeof window.ethereum !== "undefined")
    {
        //provider / for collection to blockchain / here in this case metamask
        //signer / wallet / someone with gas
        //contract that we are gonna interact with  / ABI and address of the contract

        //the above three are required to send any transaction from a front-end

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, abi, signer);

        try
        {
        const transactionResponse = await contract.fund({value: ethers.utils.parseEther(ethAmount)});
        //now to show someout put on the screen to the user that amount has been funded , there are two ways to accomplish it
        //listen for the tx to be mined
        //or listen for the event to be emitted (haven't learned yet , so going for the tx to be mined)
        await listenforTransactionMine(transactionResponse , provider);
        
        }
        catch(err)
        {
            console.log(err);
        }


    }

}

//this is not a async function , watch at 13:20 to understand completely
//this function is called when the transaction is mined in the fund function so in the fund function we are awaiting for this function to be called
function listenforTransactionMine (transactionResponse , provider) 
{
    console.log(`Mining ${transactionResponse.hash}...`);
    //listen for this transaction to be finished 
    //once it is mined , we will get a receipt
    //ethers come with a way for us to listen to a transaction or events , provider.once(eventName , listner) // here it listens to the eventName and then listner is triggered

    //this is gonna return a promise , but why?? Watch at 13:25 to understand completely  (shortAnsewer : because we wanna wait listner to finish listening)

    return new Promise((resolve , reject) => {

        try{

            provider.once(transactionResponse.hash , (transactionReceipt) => {
                console.log(`Mined -- ${transactionReceipt.confirmations} confirmations`);
                resolve();
            });

        }
        catch(err)
        {
            reject(err);
        }
    });
}

async function withdraw()
{
    if(window.ethereum !== 'undefined')
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress , abi , signer);

        try {
            const transactionResponse = await contract.withDrawAll();
            await listenforTransactionMine(transactionResponse , provider);
            
        } catch (error) {
            console.log(error);
        }
    }
}


async function getBalance()
{
    if(typeof window.ethereum !== 'undefined')
    {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(contractAddress);
        console.log(ethers.utils.formatEther(balance));
    }
}