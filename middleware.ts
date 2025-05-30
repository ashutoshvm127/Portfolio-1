import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization')
    const expectedAuth = `Basic ${Buffer.from(`admin:${process.env.ADMIN_PASSWORD}`).toString('base64')}`

    if (authHeader !== expectedAuth) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      })
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
