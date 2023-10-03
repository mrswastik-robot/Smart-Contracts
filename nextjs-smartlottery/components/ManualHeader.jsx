import React, { useEffect } from 'react'

import { useMoralis } from 'react-moralis'

const ManualHeader = () => {

    const {enableWeb3, isWeb3Enabled, web3 , account , Moralis , deactivateWeb3 , isWeb3EnableLoading} = useMoralis();

    useEffect(() => {

        if (isWeb3Enabled) return;

        //on refreshing the page, disconnection from the metamask happens
        if(window.localStorage.getItem('connected') === 'injected'){
            enableWeb3()
        }

        //lekin iske baad bhi ek dikkat, jab metamask se account manually jaa kr disconnect kr rhe aur refresh kr rhe to metamask pop-up hoo jaa raha , ise handle krne k liye neeche ek naya useEffect likhna padega

    },[isWeb3Enabled]
    );

    useEffect(() => {

        Moralis.onAccountChanged((account) => {
            console.log(`Account changed to ${account}`)
            if(account === null){
                window.localStorage.removeItem('connected');
                deactivateWeb3();                                               //sets isWeb3Enabled to false
                console.log("Null Account found.")
            }
        })
    })


  return (
    <div>
        {account ? (<p>Connected to {account}</p>) : 
        <button onClick={async() => {
            await enableWeb3()
            window.localStorage.setItem('connected', 'injected')
            }}
            disabled={isWeb3EnableLoading}
            >
            Connect
        </button>
  }
    </div>
  )
}

export default ManualHeader