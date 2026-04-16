import { Resend } from "resend"
import { ContactFormData } from "../validations/contact.schema"
import { getContactConfirmationHtml } from "../templates/contact-confirmation.template"

/**
 * EmailService Layer
 * Handles all outbound orbital transmissions via Resend.
 * Requirements: Dual-broadcast for Contact Us signals (Admin + User Confirmation)
 */
export class EmailService {
  private static resend = new Resend(process.env.RESEND_API_KEY)
  
  // The verified sender address for the platform
  private static FROM_ADDRESS = "cosynq <notifications@cosynq.ryne.dev>"
  
  // The primary command center inbox
  private static ADMIN_ADDRESS = "hello@cosynq.ryne.dev"

  /**
   * Dispatches a dual-transmission for a contact signal.
   */
  static async processContactSignal(data: ContactFormData) {
    if (!process.env.RESEND_API_KEY) {
      console.error("[EmailService] RESEND_API_KEY is not defined in environment.")
      throw new Error("Relay offline: Communication infrastructure not configured.")
    }

    // Execute parallel broadcasts to ensure rapid delivery
    const [adminResult, userResult] = await Promise.allSettled([
      this.sendAdminNotification(data),
      this.sendUserConfirmation(data)
    ])

    // Log status for monitoring
    if (adminResult.status === 'rejected') {
      console.error("[EmailService] Admin notification failed:", adminResult.reason)
    }
    if (userResult.status === 'rejected') {
      console.warn("[EmailService] User confirmation failed:", userResult.reason)
    }

    // We consider the whole operation successful if the admin was notified
    if (adminResult.status === 'rejected') {
      throw new Error("Signal failed to reach the command center.")
    }

    return {
      adminNotified: true,
      userConfirmed: userResult.status === 'fulfilled'
    }
  }

  /**
   * Internal: Beams the signal to the admin inbox
   */
  private static async sendAdminNotification(data: ContactFormData) {
    return this.resend.emails.send({
      from: this.FROM_ADDRESS,
      to: this.ADMIN_ADDRESS,
      subject: `[SIGNAL] ${data.subject}`,
      replyTo: data.email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #6d28d9;">Incoming Craft Signal</h2>
          <p><strong>From:</strong> ${data.name} (&lt;${data.email}&gt;)</p>
          <p><strong>Subject:</strong> ${data.subject}</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
          <div style="white-space: pre-wrap; background: #f9f9f9; padding: 15px; border-radius: 8px;">
            ${data.message}
          </div>
        </div>
      `,
    })
  }

  /**
   * Internal: Beams the "Celestial" confirmation back to the commander
   */
  private static async sendUserConfirmation(data: ContactFormData) {
    return this.resend.emails.send({
      from: this.FROM_ADDRESS,
      to: data.email,
      subject: "Transmission Synchronized - cosynq",
      html: getContactConfirmationHtml(data),
    })
  }
}
