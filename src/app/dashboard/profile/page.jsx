// import UserInfo from "@/components/UserInfo";

// export default function Profile() {
//   return (
//     <div>
//       <UserInfo/>
//     </div>
//   )
// }


"use client"
import { useAuth } from '@/context/AuthContext'

export default function UserInfo() {
  const { user, logout } = useAuth()

  if (!user) return null

  return (
    <div className='grid place-items-center h-screen'>
      <div className='shadow-lg p-8 bg-zinc-300/10 flex flex-col gap-2 my-6'>
        <div>Name: <span className='font-bold'>{user.name}</span></div>
        <div>Email: <span className='font-bold'>{user.email}</span></div>
        <button 
          onClick={logout}
          className='bg-red-500 text-white font-bold px-6 py-2 mt-3 cursor-pointer'
        >
          Logout
        </button>
      </div>
    </div>
  )
}