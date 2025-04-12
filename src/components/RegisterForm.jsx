"use client"
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function RegisterForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Registration failed")
      }

      // Automatically log in after registration
      const loginRes = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const loginData = await loginRes.json()
      login(loginData.access_token, loginData.user)
      router.push('/dashboard')
    } catch (error) {
      setError(error.message)
    }
  }

  return (
<div className="grid place-items-center h-screen">
    <div className="shadow-lg p-2 border-t-4 border-purple-500 rounded-md">
    <h1>
    Register
    </h1>

    <form onSubmit={handleSubmit} action="" className='flex flex-col py-4 gap-3'>
        <input onChange={e => setName(e.target.value)} type="text" placeholder="Full Name" />
        <input onChange={e=> setEmail(e.target.value)} type="text" placeholder="Email" />
        <input onChange={e=> setPassword(e.target.value)} type="password" placeholder="Password" />
        <button type="submit" className='bg-purple-600 text-white font-bold cursor-pointer px-6 py-2'>Register</button>
      
        {error && (
            <div className="bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 w-fit">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-500 text-white text-sm py-1 px-3 rounded-md mt-2 w-fit">
              {success}
            </div>
          )}

        <Link href={'/'} className='text-sm mt-3 text-right'> 
        Alright have an account? <span className='underline'>Login</span>
        </Link>
    </form>
    </div>
</div>
  )
}
