-- Add new columns to solutions
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS action_type TEXT DEFAULT 'form';
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS action_link TEXT;
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS button_text_card TEXT DEFAULT 'Cotar agora';
ALTER TABLE solutions ADD COLUMN IF NOT EXISTS button_text_form TEXT DEFAULT 'Quero receber minha cotação personalizada';

-- Add new columns to leads
ALTER TABLE leads ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Update existing solutions with default links
UPDATE solutions SET action_type = 'link', action_link = 'https://smsaudesegurosltda.aggilizador.com.br/life' WHERE title = 'Seguro de Vida';
UPDATE solutions SET action_type = 'link', action_link = 'https://smsaudesegurosltda.aggilizador.com.br/residence' WHERE title = 'Seguro Residencial';
UPDATE solutions SET action_type = 'link', action_link = 'https://smsaudesegurosltda.aggilizador.com.br/auto' WHERE title = 'Seguro Auto';

-- Plano de Saude remains as form
UPDATE solutions SET action_type = 'form' WHERE title = 'Planos de Saúde';
