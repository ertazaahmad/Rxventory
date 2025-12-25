import React from 'react'
import Nav from '../components/nav.jsx'

const Login = () => {
  return (
      <div className="relative h-screen bg-[url('/src/assets/login1.svg')] bg-no-repeat bg-cover opacity-100">
        <Nav />
        <section className='flex justify-center flex mt-24'>
          <div className="flex flex-col w-80 items-center bg-blue-100 rounded-2xl p-6 shadow-xl
hover:shadow-2xl transition 
">
            <h1 className='text-4xl font-bold mt-2 '>Rxventory</h1>
            <h1 className='text-2xl font-bold mt-2 '>Login</h1>
            <button className='mt-16 flex w-64 p-3 rounded-lg font-bold items-center justify-center bg-white border hover:bg-gray-50 transition hover:shadow-xl '>
               <img
    src="/google.svg"
    alt="Google"
    className="w-6 h-6"
  />
              <span className='ml-8'>Continue With Google</span>
              </button>

 <h1 className='text-l font-bold mt-4 '>Secure | Fast | Simple</h1>
 <p className="text-xs text-gray-500 mt-4">
  New here? Just continue with Google
</p>
              
            
          </div>
          </section>


    </div>
  )
}

export default Login