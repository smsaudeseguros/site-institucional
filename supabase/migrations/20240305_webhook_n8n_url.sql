-- Add webhook URL for n8n to site_config
ALTER TABLE site_config ADD COLUMN IF NOT EXISTS webhook_n8n_url TEXT;
