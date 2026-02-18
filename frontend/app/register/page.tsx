"use client"
import Navbar from '@/components/Navbar'
import Link from 'next/link'
import React, {useState} from 'react'
import { useRouter } from 'next/navigation'

interface InputProps{
  contentType:string,
  label:string,
  name:string,
  value:string,
  onChange : (e :React.ChangeEvent<HTMLInputElement>) =>void

}

const Input: React.FC<InputProps> =({
  contentType,
  label,
  name,
  value,
  onChange
}) =>(

  <div className="mt-8 w-80">
          <div className='flex row items-center gap-0.5'>
            <p className="text-sm text-gray-600">{label}</p> <p className='text-red-400'>*</p>
          </div>

          <input
            type={contentType}
            placeholder={label}
            name={name}
            value={value}
            onChange={onChange}


            className="w-full border-b border-gray-300 focus:outline-none focus:border-indigo-600 transition duration-200 bg-transparent py-2"
          />
    </div>

)

const page = () => {

  const router = useRouter();
  const [loading,setLoading] = useState(false);
  const [firstName,setFirstName] = useState("");
  const [lastName,setLastName] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [confirmPassword,setConfirmPassword] = useState("");
  const [error, setError] = useState<string|null>(null)


  async function handleSubmit(e:React.FormEvent){

    e.preventDefault()
    setError(null);
    setLoading(true);

    if(firstName === ""){
      setError("please fill out all fields before submitting")
      setLoading(false)
      return;
    }
    if(lastName === ""){
      setError("please fill out all fields before submitting")
      setLoading(false)
      return;
    }
    if(email === ""){
      setError("please fill out all fields before submitting")
      setLoading(false)
      return;
    }
    if(password === ""){
      setError("please fill out all fields before submitting")
      setLoading(false)
      return;
    }
    if(confirmPassword === ""){
      setError("please fill out all fields before submitting")
      setLoading(false)
      return;
    }

    if(password !== confirmPassword){

      setError("Passwords do not match")
      setLoading(false)
      return;

    }
    if(password.length < 8 ){
      setError("Passwords must be at least 8 characters")
      setLoading(false);
      return;
    }

    try{

      const res = await fetch("http://localhost:8080/api/auth/register",{
        method:"POST",
        headers:{"Content-Type": "application/json"},
        body:JSON.stringify({firstName,lastName,email,password})
      })

      if(!res.ok){
        const err = await res.json().catch(()=>null);
        throw new Error(err?.message ||"Registration failed please try again later")
      }

      router.push("/login");

    }catch (err: any) {
      setError(err.message || 'Unexpected error')

    } finally {
      setLoading(false)
    }

  }


  return (
    <main>
      <Navbar></Navbar>
      <div className='bg-linear-to-b from-indigo-400 to-cyan-500 w-full min-h-screen flex flex-col items-center  py-10'>


      {/* Register form*/}

      <div className=' bg-white  py-10 min-w-[600px] shadow-2xl shadow-red-300 '>
        <form className='flex flex-col justify-center items-center gap-3'
              onSubmit={handleSubmit}>

          <h1 className='text-2xl font'>Sign Up</h1>

          <Input
              contentType='text'
              label='First Name'
              name='firstName'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            >
          </Input>

          <Input
              contentType='text'
              label='Last Name'
              name='lastName'
              value={lastName}
              onChange={e => setLastName(e.target.value)}
            >
          </Input>

          <Input
              contentType='email'
              label='Email'
              name='email'
              value={email}
              onChange={e => setEmail(e.target.value)}
            >
          </Input>

          <Input
              contentType='password'
              label='Password'
              name='password'
              value={password}
              onChange={e => setPassword(e.target.value)}
            >
          </Input>

          <Input
              contentType='password'
              label='Confirm password'
              name='confirmPassword'
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            >
          </Input>


          {error && <p className='text-red-500 mt-2'>{error}</p>}

          <button className='hover:cursor-pointer rounded-2xl text-white  bg-linear-to-r from-indigo-600 to-violet-800 shadow
                           hover:from-indigo-700 hover:to-violet-700 hover:shadow-2xl
                           hover:shadow-teal-300 px-7 py-2 mt-5'
                  type='submit'
                  disabled={loading}

                  >

            {loading ? 'Loading' :'Register'}

          </button>


        </form>
      </div>


    </div>
    </main>

  )
}

export default page
