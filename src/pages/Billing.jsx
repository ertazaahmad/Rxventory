import React from 'react'
import Nav from '../components/nav'
import Btnsearch from '../components/Btnsearch.JSX'

const Billing = () => {
  return (
    <div>
        <Nav />
          <div className=" min-h-[calc(100vh-6rem)] m-4 p-4  bg-gray-200 rounded-xl  text-sm font-medium">
<Btnsearch />
          </div>
    </div>
  )
}

export default Billing