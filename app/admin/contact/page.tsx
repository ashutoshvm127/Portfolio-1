import { getContactSubmissions } from "@/lib/db"
import { ContactSubmissionsTable } from "@/components/admin/ContactSubmissionsTable"

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function AdminContactPage() {
  try {
    const submissions = await getContactSubmissions()
    console.log('Page received submissions:', submissions) // Debug log

    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
        {submissions && submissions.length > 0 ? (
          <ContactSubmissionsTable submissions={submissions} />
        ) : (
          <div>
            <p>No submissions found</p>
            <p className="text-sm text-gray-500">Debug info: {JSON.stringify(submissions)}</p>
          </div>
        )}
      </div>
    )
  } catch (error) {
    console.error('Error in admin page:', error)
    return (
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-6 text-red-600">Error Loading Submissions</h1>
        <p>There was an error loading the submissions. Please check the console for details.</p>
      </div>
    )
  }
}
