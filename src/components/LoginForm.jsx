"use client";
import Link from 'next/link';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const { login } = useAuth()
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Login failed")
      }

      login(data)
      router.push('/dashboard')
    } catch (err) {
      setError(err.message)
    }
  }
  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-2 border-t-4 border-purple-500 rounded-md">
        <h1>
          Enter the details to login
        </h1>

        <form onSubmit={handleLogin} className='flex flex-col py-4 gap-3'>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button type="submit" className='bg-purple-600 text-white font-bold cursor-pointer px-6 py-2'>
            Login
          </button>

          {error && (
            <div className='bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 w-fit'>{error}</div>
          )}
          {success && (
            <div className='bg-green-500 text-white text-sm py-1 px-3 rounded-md mt-2 w-fit'>{success}</div>
          )}

          <Link href={'/register'} className='text-sm mt-3 text-right'>
            Don't have an account? <span className='underline'>Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

export default LoginForm;
