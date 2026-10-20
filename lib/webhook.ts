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
            console.warn("Webhook n8n URL not configured or failed to fetch config:", error)
            return
        }

        const url = config.webhook_n8n_url

        // Execute request with timeout and log the outcome
        try {
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 8000)

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(leadData),
                signal: controller.signal
            })
            clearTimeout(timeoutId)

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

            // Log success/response to DB
            await supabaseAdmin.from('webhook_logs').insert({
                url,
                request_body: leadData,
                response_status: response.status,
                response_headers: responseHeaders,
                response_body: responseBodyText
            })

        } catch (fetchErr: any) {
            console.error("Failed to send webhook to n8n:", fetchErr)

            const errorMessage = fetchErr.name === 'AbortError' 
                ? "Request timeout after 8000ms" 
                : (fetchErr.message || "Network error or timeout")

            // Log network failure to DB
            await supabaseAdmin.from('webhook_logs').insert({
                url,
                request_body: leadData,
                response_status: 0,
                response_headers: null,
                response_body: errorMessage
            })
        }

    } catch (err) {
        console.error("Unexpected error triggering webhook:", err)
    }
}
