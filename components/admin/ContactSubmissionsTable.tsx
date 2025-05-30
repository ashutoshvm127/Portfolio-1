'use client'

import { ContactSubmission } from "@/types/database"
import { format } from "date-fns"
import { deleteContactSubmission } from "@/lib/db"

export function ContactSubmissionsTable({ submissions }: { submissions: ContactSubmission[] }) {
  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      await deleteContactSubmission(id)
      window.location.reload()
    }
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {submissions.map((submission) => (
            <tr key={submission.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                {format(new Date(submission.created_at), 'PPp')}
              </td>
              <td className="px-6 py-4">
                {submission.first_name} {submission.last_name}
              </td>
              <td className="px-6 py-4">{submission.email}</td>
              <td className="px-6 py-4">{submission.subject}</td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(submission.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
