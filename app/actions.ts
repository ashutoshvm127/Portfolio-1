"use server"
import { z } from "zod"
import { supabase } from "@/utils/supabase"
import type { ContactSubmissionInsert } from "@/types/database"

const contactFormSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50, "First name must be less than 50 characters"),
  lastName: z.string().min(1, "Last name is required").max(50, "Last name must be less than 50 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Subject is required").max(100, "Subject must be less than 100 characters"),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
})

export async function submitContactForm(formData: FormData) {
  try {
    // Extract and validate form data
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    const validatedData = contactFormSchema.parse(rawData)

    // Store in Supabase
    const { error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        first_name: validatedData.firstName,
        last_name: validatedData.lastName,
        email: validatedData.email,
        subject: validatedData.subject,
        message: validatedData.message
      } as ContactSubmissionInsert)

    if (dbError) {
      console.error('Supabase error:', dbError)
      throw new Error(`Failed to store contact submission: ${dbError.message}`)
    }

    // Check Resend API key
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      throw new Error("Invalid Resend API key configuration")
    }

    // Send email
    const { Resend } = await import("resend")
    const resend = new Resend(resendApiKey)

    const response = await resend.emails.send({
      from: process.env.NEXT_PUBLIC_RESEND_FROM_EMAIL || "portfolio@amithaaji.live",
      to: ["amithaaji24@gmail.com"],
      subject: `New Contact Form Message: ${validatedData.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="margin: 20px 0;">
            <p><strong>From:</strong> ${validatedData.firstName} ${validatedData.lastName} (${validatedData.email})</p>
            <p><strong>Subject:</strong> ${validatedData.subject}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <div style="margin: 20px 0; background: #f5f5f5; padding: 20px; border-radius: 5px;">
            <p><strong>Message:</strong></p>
            <div style="white-space: pre-wrap;">${validatedData.message}</div>
          </div>
        </div>
      `,
      replyTo: validatedData.email,
    })

    if (response?.error) {
      throw new Error(`Failed to send email: ${response.error.message}`)
    }

    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
    }

  } catch (error) {
    console.error("Contact form error:", error)
    
    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: "Please check your form data",
        errors: error.errors.reduce(
          (acc, err) => {
            acc[err.path[0]] = err.message
            return acc
          },
          {} as Record<string, string>,
        ),
      }
    }

    return {
      success: false,
      message: "Sorry, there was an error processing your submission. Please try again or contact me directly at amithaaji24@gmail.com",
    }
  }
}
