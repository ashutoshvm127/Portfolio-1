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
    if (!resendApiKey || !resendApiKey.startsWith('re_')) {
      console.error("⚠️ Invalid Resend API key format")
      return {
        success: false,
        message: "Server configuration error. Please contact the administrator.",
      }
    }

    try {
      const { Resend } = await import("resend")
      const resend = new Resend(resendApiKey)

      console.log("📧 Attempting to send email via Resend...")

      const response = await resend.emails.send({
        from: "portfolio@amithaaji.live",
        to: ["amithaaji24@gmail.com"], // Update to match the verified email
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
        replyTo: validatedData.email, // Use reply_to instead of replyTo
      })

      console.log("📨 Raw Resend API response:", JSON.stringify(response, null, 2))

      // Correct response check for Resend API
      if (response?.error) {
        throw new Error(`Resend API error: ${response.error.message}`)
      }

      console.log("✅ Email sent successfully with ID:", response?.data?.id ?? 'unknown')

    } catch (emailError: any) {
      console.error("❌ Email sending failed:", {
        error: emailError.message,
        code: emailError?.code,
        name: emailError?.name,
        response: JSON.stringify(emailError?.response || {}),
      })
      
      return {
        success: false,
        message: "Failed to send email. Please try again or contact directly at amithaaji24@gmail.com",
      }
    }

    // Return success only if everything worked
    return {
      success: true,
      message: "Thank you! Your message has been sent successfully.",
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
