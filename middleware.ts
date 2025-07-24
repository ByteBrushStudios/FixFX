import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware function to handle redirects
export function middleware(request: NextRequest) {
  // Get the pathname from the request
  const { pathname } = request.nextUrl

  // If the path is exactly /docs, redirect to /docs/overview
  if (pathname === '/docs') {
    return NextResponse.redirect(new URL('/docs/overview', request.url))
  }

  // Continue with the request for all other paths
  return NextResponse.next()
}

// Configure which paths the middleware will run on
export const config = {
  matcher: [
    '/docs',
    '/docs/',
  ]
}
