"use server"

import { contactSchema, ContactFormData } from "../validations/contact.schema"
import { EmailService } from "../services/email.service"

/**
 * Contact Server Action
 * Acts as the "Controller" between the UI and the EmailService.
 * Handles validation and secure relay of community signals.
 */
export async function sendContactEmailAction(formData: ContactFormData) {
  try {
    // 1. Validate the signal frequency
    const validatedData = contactSchema.parse(formData)
    
    // 2. Transmit to the relay service
    const result = await EmailService.processContactSignal(validatedData)
    
    // 3. Return successful sync signal
    return {
      success: true,
      data: result,
      message: "Signal synchronized successfully. Orbit established."
    }
  } catch (error: any) {
    console.error("[sendContactEmailAction] Critical transmission failure:", error)
    
    // Return structured error signal
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unidentified orbital interference detected.",
      message: "Transmission failed to reach the command center."
    }
  }
}
