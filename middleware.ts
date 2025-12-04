import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const pathname = request.nextUrl.pathname

  // Protected routes mapping
  const protectedRoutes = {
    '/admin': ['admin'],
    '/gerencia': ['gerencia'],
    '/asesor': ['asesor'],
  }

  // Check if the route is protected
  const isProtectedRoute = Object.keys(protectedRoutes).some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/gerencia/:path*', '/asesor/:path*'],
}
