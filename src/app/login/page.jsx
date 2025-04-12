"use client"
import LoginForm from '@/components/LoginForm'
import GuestRoute from '@/components/GuestRoute'

export default function LoginPage() {
  return (
    <GuestRoute>
      <LoginForm />
    </GuestRoute>
  )
}