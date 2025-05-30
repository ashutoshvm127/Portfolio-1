import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "./auth"

export async function adminMiddleware(request: NextRequest) {
  // Check if user is trying to access admin routes (except login)
  if (request.nextUrl.pathname.startsWith("/admin") && !request.nextUrl.pathname.startsWith("/admin/login")) {
    const isAuthenticated = await checkAdminAuth()

    if (!isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  return NextResponse.next()
}
