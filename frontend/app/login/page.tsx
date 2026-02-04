import Navbar from '@/components/Navbar'
import Link from 'next/link'
import React from 'react'


interface InputProps {
  contentType:string,
  label:string
}

const Input : React.FC<InputProps> = ({
  contentType,
  label
}) =>(

  <div className='mt-8 w-80'>
    <div className='flex flex-row gap-0.5 items-center'>
      <p className='text-sm text-gray-600'>{label}</p> <p className=' text-red-400'>*</p>
    </div>

    <input
      type={contentType}
      placeholder={label}
      className='w-full border-b border-gray-300 focus:outline-none focus:border-b-indigo-600 transition duration-300 py-2'
    />
  </div>
)


const page = () => {
  return (
    <main>
      <Navbar></Navbar>
      <div className='bg-linear-to-b from-indigo-400 to-cyan-500 w-full min-h-screen flex flex-col items-center  py-10'>


      {/* Login form*/}

      <div className=' bg-white  py-10 min-w-[600px] shadow-2xl shadow-red-300 '>
        <div className='flex flex-col justify-center items-center gap-3'>

          <h1 className='text-2xl font'>Login</h1>

          <Input
              contentType='email'
              label='Email'
            >
          </Input>

          <Input
              contentType='password'
              label='Password'
            >
          </Input>


          <br />
          <button className='rounded-2xl text-white  bg-linear-to-r from-indigo-600 to-violet-800 shadow hover:from-indigo-700 hover:to-violet-700 hover:shadow-2xl hover:shadow-teal-300 px-7 py-2 mt-5'>
            <Link href="#">Login</Link>
          </button>


        </div>
      </div>


    </div>
    </main>

  )
}

export default page
