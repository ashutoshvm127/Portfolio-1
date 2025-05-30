"use server"

import { z } from "zod"
import { saveContactData } from "./data"

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
    // Extract form data
    const rawData = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      subject: formData.get("subject") as string,
      message: formData.get("message") as string,
    }

    // Validate the data
    const validatedData = contactFormSchema.parse(rawData)

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Save data to file
    await saveContactData(validatedData)

    // Log the submission (in production, you'd save this to a database)
    console.log("📧 New contact form submission:", {
      ...validatedData,
      timestamp: new Date().toISOString(),
      userAgent: "Portfolio Website",
    })

    // Try to send email if Resend API key is available
    const resendApiKey = process.env.RESEND_API_KEY
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)

        await resend.emails.send({
          from: "noreply@yourdomain.com", // Use your actual verified domain
          to: "amithaaji24@gmail.com", // ✅ Your email for notifications
          subject: `Portfolio Contact: ${validatedData.subject}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px;">
                New Contact Form Submission
              </h2>
              <div style="margin: 20px 0;">
                <p><strong>Name:</strong> ${validatedData.firstName} ${validatedData.lastName}</p>
                <p><strong>Email:</strong> ${validatedData.email}</p>
                <p><strong>Subject:</strong> ${validatedData.subject}</p>
              </div>
              <div style="margin: 20px 0;">
                <p><strong>Message:</strong></p>
                <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin-top: 10px;">
                  ${validatedData.message.replace(/\n/g, "<br>")}
                </div>
              </div>
              <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
              <p style="color: #666; font-size: 12px;">
                This message was sent from your portfolio contact form.
              </p>
            </div>
          `,
          replyTo: validatedData.email,
        })
        console.log("✅ Email sent successfully via Resend")
      } catch (emailError) {
        console.error("❌ Failed to send email via Resend:", emailError)
        // Continue with success even if email fails
      }
    } else {
      console.log("⚠️ Resend API key not found - email not sent (this is normal in development)")
    }

    return {
      success: true,
      message: "Thank you for your message! I'll get back to you within 24 hours.",
    }
  } catch (error) {
    console.error("Contact form submission error:", error)

    if (error instanceof z.ZodError) {
      // Return validation errors
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

    // Return generic error for other types of errors
    return {
      success: false,
      message: "Sorry, there was an error sending your message. Please try again or contact me directly.",
    }
  }
}
