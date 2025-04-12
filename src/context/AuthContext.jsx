"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '../lib/auth'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const isAuthenticated = !!user

  const refreshAuth = async () => {
    try {
      const refreshToken = getRefreshToken()
      if (!refreshToken) throw new Error('No refresh token')

      const res = await fetch('http://localhost:5000/api/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      })

      if (!res.ok) throw new Error('Refresh failed')

      const { access_token } = await res.json()
      localStorage.setItem('access_token', access_token)
      
      // Get user profile with new token
      const profileRes = await fetch('http://localhost:5000/api/profile', {
        headers: {
          'Authorization': `Bearer ${access_token}`
        }
      })

      if (!profileRes.ok) throw new Error('Profile fetch failed')

      const userData = await profileRes.json()
      setUser(userData)
      return true
    } catch (error) {
      clearAuthTokens()
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const accessToken = getAccessToken()
        if (!accessToken) {
          setLoading(false)
          return
        }

        // First try with access token
        const profileRes = await fetch('http://localhost:5000/api/profile', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (profileRes.ok) {
          const userData = await profileRes.json()
          setUser(userData)
          setLoading(false)
          return
        }

        // If access token fails, try refreshing
        const refreshSuccess = await refreshAuth()
        if (!refreshSuccess) {
          router.push('/login')
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        clearAuthTokens()
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [router])

  const login = (data) => {
    setAuthTokens({
      access_token: data.access_token,
      refresh_token: data.refresh_token
    })
    setUser(data.user)
  }

  const logout = () => {
    clearAuthTokens()
    setUser(null)
    router.push('/login')
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)