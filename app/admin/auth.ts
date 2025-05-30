"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

// Simple password-based authentication
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123" // Change this!

export async function authenticateAdmin(password: string) {
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    // Set authentication cookie that expires in 24 hours
    cookieStore.set("admin-auth", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
    })
    return { success: true }
  }
  return { success: false, message: "Invalid password" }
}

export async function checkAdminAuth() {
  const cookieStore = await cookies()
  const authCookie = cookieStore.get("admin-auth")
  return authCookie?.value === "authenticated"
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-auth")
  redirect("/admin/login")
}
