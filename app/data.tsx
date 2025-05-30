"use server"

import { writeFile, readFile, mkdir } from "fs/promises"
import { join } from "path"

export interface ContactSubmission {
  id: string
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
  timestamp: string
  userAgent?: string
  ipAddress?: string
}

// File path for storing data
const DATA_DIR = join(process.cwd(), "data")
const DATA_FILE = join(DATA_DIR, "contact-submissions.json")

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await mkdir(DATA_DIR, { recursive: true })
  } catch (error) {
    // Directory might already exist, that's fine
  }
}

// Read existing data
async function readContactData(): Promise<ContactSubmission[]> {
  try {
    await ensureDataDir()
    const data = await readFile(DATA_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    // File doesn't exist yet, return empty array
    return []
  }
}

// Save new contact submission
export async function saveContactData(formData: {
  firstName: string
  lastName: string
  email: string
  subject: string
  message: string
}): Promise<void> {
  try {
    // Read existing data
    const existingData = await readContactData()

    // Create new submission
    const newSubmission: ContactSubmission = {
      id: `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...formData,
      timestamp: new Date().toISOString(),
      userAgent: "Portfolio Website",
    }

    // Add to existing data
    const updatedData = [newSubmission, ...existingData]

    // Ensure directory exists
    await ensureDataDir()

    // Write back to file
    await writeFile(DATA_FILE, JSON.stringify(updatedData, null, 2), "utf-8")

    console.log("✅ Contact data saved successfully:", {
      id: newSubmission.id,
      email: newSubmission.email,
      timestamp: newSubmission.timestamp,
    })
  } catch (error) {
    console.error("❌ Error saving contact data:", error)
    throw new Error("Failed to save contact data")
  }
}

// Get all contact submissions (for admin use)
export async function getAllContactSubmissions(): Promise<ContactSubmission[]> {
  return await readContactData()
}

// Get contact submissions with pagination
export async function getContactSubmissions(
  page = 1,
  limit = 10,
): Promise<{
  submissions: ContactSubmission[]
  total: number
  page: number
  totalPages: number
}> {
  const allSubmissions = await readContactData()
  const total = allSubmissions.length
  const totalPages = Math.ceil(total / limit)
  const startIndex = (page - 1) * limit
  const submissions = allSubmissions.slice(startIndex, startIndex + limit)

  return {
    submissions,
    total,
    page,
    totalPages,
  }
}

// Search contact submissions
export async function searchContactSubmissions(query: string): Promise<ContactSubmission[]> {
  const allSubmissions = await readContactData()
  const lowercaseQuery = query.toLowerCase()

  return allSubmissions.filter(
    (submission) =>
      submission.firstName.toLowerCase().includes(lowercaseQuery) ||
      submission.lastName.toLowerCase().includes(lowercaseQuery) ||
      submission.email.toLowerCase().includes(lowercaseQuery) ||
      submission.subject.toLowerCase().includes(lowercaseQuery) ||
      submission.message.toLowerCase().includes(lowercaseQuery),
  )
}

// Get submission by ID
export async function getContactSubmissionById(id: string): Promise<ContactSubmission | null> {
  const allSubmissions = await readContactData()
  return allSubmissions.find((submission) => submission.id === id) || null
}

// Delete submission by ID
export async function deleteContactSubmission(id: string): Promise<boolean> {
  try {
    const allSubmissions = await readContactData()
    const filteredSubmissions = allSubmissions.filter((submission) => submission.id !== id)

    if (filteredSubmissions.length === allSubmissions.length) {
      return false // No submission found with that ID
    }

    await writeFile(DATA_FILE, JSON.stringify(filteredSubmissions, null, 2), "utf-8")
    console.log("✅ Contact submission deleted:", id)
    return true
  } catch (error) {
    console.error("❌ Error deleting contact submission:", error)
    return false
  }
}

// Get statistics
export async function getContactStats(): Promise<{
  total: number
  thisMonth: number
  thisWeek: number
  today: number
}> {
  const allSubmissions = await readContactData()
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  return {
    total: allSubmissions.length,
    thisMonth: allSubmissions.filter((s) => new Date(s.timestamp) >= startOfMonth).length,
    thisWeek: allSubmissions.filter((s) => new Date(s.timestamp) >= startOfWeek).length,
    today: allSubmissions.filter((s) => new Date(s.timestamp) >= startOfDay).length,
  }
}

// Export data as CSV
export async function exportContactDataAsCSV(): Promise<string> {
  const allSubmissions = await readContactData()

  if (allSubmissions.length === 0) {
    return "No data to export"
  }

  // CSV headers
  const headers = ["ID", "First Name", "Last Name", "Email", "Subject", "Message", "Timestamp"]

  // CSV rows
  const rows = allSubmissions.map((submission) => [
    submission.id,
    submission.firstName,
    submission.lastName,
    submission.email,
    submission.subject,
    submission.message.replace(/\n/g, " "), // Replace newlines with spaces
    submission.timestamp,
  ])

  // Combine headers and rows
  const csvContent = [headers, ...rows].map((row) => row.map((field) => `"${field}"`).join(",")).join("\n")

  return csvContent
}
