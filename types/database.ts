export interface ContactSubmission {
  id: number
  created_at: string
  first_name: string
  last_name: string
  email: string
  subject: string
  message: string
}

export type ContactSubmissionInsert = Omit<ContactSubmission, 'id' | 'created_at'>

export type Database = {
  public: {
    Tables: {
      contact_submissions: {
        Row: ContactSubmission
        Insert: ContactSubmissionInsert
        Update: ContactSubmissionInsert
      }
    }
  }
}

export type DbResult<T> = {
  data: T | null
  error: Error | null
}
