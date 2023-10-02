import React from 'react'

import { useMoralis } from 'react-moralis'

const ManualHeader = () => {

    const {enableWeb3, isWeb3Enabled, web3 , account} = useMoralis()

  return (
    <div>
        {account ? (<p>Connected to {account}</p>) : 
        <button onClick={async() => {await enableWeb3()}}>Connect</button>
  }
    </div>
  )
}

export default ManualHeader