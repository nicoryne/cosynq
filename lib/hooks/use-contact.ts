"use client"

import { useMutation } from "@tanstack/react-query"
import { sendContactEmailAction } from "../actions/contact.actions"
import { ContactFormData } from "../validations/contact.schema"
import { toast } from "sonner"

/**
 * useContactMutation Hook
 * Manages the state of the "Signal Dispatch" operation.
 * Integrates with TanStack Query and Sonner for orbital feedback.
 */
export function useContactMutation() {
  return useMutation({
    mutationFn: async (data: ContactFormData) => {
      const result = await sendContactEmailAction(data)
      
      if (!result.success) {
        throw new Error(result.error || result.message)
      }
      
      return result
    },
    onSuccess: (result) => {
      // Logic for the parent component to handle visual state transition
      console.log("[useContactMutation] Signal synchronized:", result.message)
    },
    onError: (error: Error) => {
      console.error("[useContactMutation] Relay failed:", error.message)
      toast.error("Transmission Error", {
        description: error.message || "Could not establish orbital relay.",
      })
    },
  })
}
