export interface ContactSubmission {
  id: number
  name?: string
  email?: string
  message?: string
  created_at: string
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
