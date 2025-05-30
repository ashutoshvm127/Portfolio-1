import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';

interface ContactSubmission {
  id: number;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactSubmissionsTable() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  async function fetchSubmissions() {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSubmissions(data || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading submissions...</div>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2">Date</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Phone</th>
            <th className="px-4 py-2">Message</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission) => (
            <tr key={submission.id} className="border-b">
              <td className="px-4 py-2">
                {new Date(submission.created_at).toLocaleDateString()}
              </td>
              <td className="px-4 py-2">{submission.name}</td>
              <td className="px-4 py-2">{submission.email}</td>
              <td className="px-4 py-2">{submission.phone}</td>
              <td className="px-4 py-2">{submission.message}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
