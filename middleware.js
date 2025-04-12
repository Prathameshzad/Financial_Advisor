import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth' // You'll need to implement this

const guestRoutes = ['/login', '/register']
const protectedRoutes = ['/dashboard', '/profile']

export async function middleware(request) {
  const token = request.cookies.get('token')?.value
  const isAuthenticated = token && await verifyToken(token)
  const { pathname } = request.nextUrl

  // Redirect authenticated users away from guest routes
  if (isAuthenticated && guestRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Redirect unauthenticated users away from protected routes
  if (!isAuthenticated && protectedRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}