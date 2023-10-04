import React from 'react'

import { ConnectButton } from 'web3uikit'


const Header = () => {
  return (
    <div className=''>
        <div className=' flex items-center max-w-7xl mx-auto justify-between mt-5'>
            <h1 className=' text-3xl font-bold '>Smart Lottery</h1>
            <ConnectButton/>
        </div>
        <hr class="max-w-9xl h-1 mx-auto bg-gray-100 border-0 rounded md:my-7 dark:bg-gray-700"></hr>

    </div>
  )
}

export default Header