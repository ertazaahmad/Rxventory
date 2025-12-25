import React from 'react'
import Nav from '../components/navbar/nav'

const Login = () => {
  return (
      <div className="relative h-screen bg-[url('/src/assets/login1.svg')] bg-no-repeat bg-cover opacity-100">
        <Nav />
        <section className='h-110 justify-center flex mt-30'>
          <div className="h-110 w-80 bg-blue-100 rounded-2xl ">
            <h1 className='flex text-3xl font-bold w-full justify-center mt-2 '>Login</h1>
            <input type="text" placeholder="Username" className='p-3 bg-gray-350 mt-10 ml-5 rounded-2xl'/>
          </div>
          </section>


    </div>
  )
}

export default Login