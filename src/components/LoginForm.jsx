import Link from 'next/link'
import React from 'react'

function LoginForm() {
  return (
<div className="grid place-items-center h-screen">
    <div className="shadow-lg p-2 border-t-4 border-purple-500 rounded-md">
    <h1>
    Enter the details to login
    </h1>
    

    <form action="" className='flex flex-col py-4 gap-3'>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit" className='bg-purple-600 text-white font-bold cursor-pointer px-6 py-2'>Login</button>

        <div className='bg-red-500 text-white text-sm py-1 px-3 rounded-md mt-2 w-fit'>Error Message</div>

        <Link href={'/register'} className='text-sm mt-3 text-right'> 
        Don't have an account? <span className='underline'>Register</span>
        </Link>
    </form>
    </div>
</div>
  )
}

export default LoginForm
