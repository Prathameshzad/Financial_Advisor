"use client"
import RegisterForm from '@/components/RegisterForm'
import GuestRoute from '@/components/GuestRoute'

export default function RegisterPage() {
  return (
    <GuestRoute>
      <RegisterForm />
    </GuestRoute>
  )
}