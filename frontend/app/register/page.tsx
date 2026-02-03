import Link from 'next/link'
import React from 'react'

interface InputProps{
  contentType:string,
  label:string,

}

const Input: React.FC<InputProps> =({
  contentType,
  label
}) =>(

  <div className="mt-8 w-80">
          <div className='flex row items-center gap-0.5'>
            <p className="text-sm text-gray-600">{label}</p> <p className='text-red-400'>*</p>
          </div>

          <input
            type={contentType}
            placeholder={label}


            className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-600 transition duration-200 bg-transparent py-2"
          />
    </div>

)

const page = () => {


  return (
    <div className='bg-linear-to-b from-indigo-400 to-cyan-500 w-full min-h-screen flex flex-col items-center justify-center py-10'>


      {/* Register form*/}

      <div className=' rounded-2xl bg-white px-2 py-10 min-w-[600px]'>
        <div className='flex flex-col justify-center items-center gap-3'>

          <h1 className='text-2xl font'>Sign Up</h1>

          <Input
              contentType='text'
              label='First Name'
            >
          </Input>

          <Input
              contentType='text'
              label='Last Name'
            >
          </Input>

          <Input
              contentType='email'
              label='email'
            >
          </Input>

          <Input
              contentType='password'
              label='Password'
            >
          </Input>

          <Input
              contentType='password'
              label='Confirm password'
            >
          </Input>

          <button className='rounded-2xl text-white  bg-linear-to-r from-indigo-600 to-violet-800 shadow hover:from-indigo-700 hover:to-violet-700 hover:shadow-2xl hover:shadow-teal-300 px-7 py-2 mt-5'>
            <Link href="#">Register</Link>
          </button>


        </div>
      </div>


    </div>
  )
}

export default page
