import { createAdminClient } from "./supabase/admin"

/**
 * Triggers the n8n webhook asynchronously if configured in `site_config`.
 *
 * @param leadData The data of the newly created lead
 */
export async function triggerWebhook(leadData: any) {
    try {
        const supabaseAdmin = createAdminClient()

        // Fetch webhook URL from site_config
        const { data: config, error } = await supabaseAdmin
            .from('site_config')
            .select('webhook_n8n_url')
            .eq('id', 1)
            .single()

        if (error || !config || !config.webhook_n8n_url) {
            // Webhook not configured or error fetching it, fail silently
            return
        }

        const url = config.webhook_n8n_url

        // Execute async request and log the outcome
        try {
            const start = Date.now()
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
            })

            // Parse headers
            const responseHeaders: any = {}
            response.headers.forEach((value, key) => {
                responseHeaders[key] = value
            })

            // Parse body
            let responseBodyText = ""
            try {
                responseBodyText = await response.text()
            } catch (e) {
                responseBodyText = "Could not parse response body"
            }

            // Log success to DB
            await supabaseAdmin.from('webhook_logs').insert({
                url,
                request_body: leadData,
                response_status: response.status,
                response_headers: responseHeaders,
                response_body: responseBodyText
            })

        } catch (fetchErr: any) {
            console.error("Failed to send webhook to n8n:", fetchErr)

            // Log network failure to DB
            await supabaseAdmin.from('webhook_logs').insert({
                url,
                request_body: leadData,
                response_status: 0,
                response_headers: null,
                response_body: fetchErr.message || "Network error or timeout"
            })
        }

    } catch (err) {
        console.error("Unexpected error triggering webhook:", err)
    }
}
