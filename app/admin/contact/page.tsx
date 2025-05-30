import { getContactSubmissions } from "@/lib/db"
import { ContactSubmissionsTable } from "@/components/admin/ContactSubmissionsTable"

export const dynamic = 'force-dynamic'

export default async function AdminContactPage() {
  const submissions = await getContactSubmissions()

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Contact Submissions</h1>
      <ContactSubmissionsTable submissions={submissions} />
    </div>
  )
}
