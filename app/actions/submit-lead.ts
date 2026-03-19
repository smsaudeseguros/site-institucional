"use server"

import { createAdminClient } from "@/lib/supabase/admin"
import { triggerWebhook } from "@/lib/webhook"

export async function submitLead(submissionData: any, metadata: any = null) {
  try {
    const supabaseAdmin = createAdminClient()

    const payload = {
        ...submissionData,
        metadata: metadata && Object.keys(metadata).length > 0 ? metadata : null
    }

    const { data: insertedLead, error } = await supabaseAdmin.from('leads').insert(payload).select().single()

    if (error) {
      // Log error to system_logs
      await supabaseAdmin.from('system_logs').insert({
          event_type: 'LEAD_SUBMISSION',
          status: 'ERROR',
          payload: payload,
          error_message: error.message || JSON.stringify(error)
      })
      throw error
    }

    // Log success to system_logs
    await supabaseAdmin.from('system_logs').insert({
        event_type: 'LEAD_SUBMISSION',
        status: 'SUCCESS',
        payload: payload,
        error_message: null
    })

    // Fire webhook asynchronously (do not await, let it run in the background)
    triggerWebhook(insertedLead).catch(console.error)

    return { success: true, lead: insertedLead }

  } catch (error: any) {
    console.error("Error submitting lead via server action:", error)
    return { success: false, error: error.message || "Failed to submit lead" }
  }
}
