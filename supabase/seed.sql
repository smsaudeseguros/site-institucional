-- Seed Site Config
INSERT INTO site_config (id, logo_url, footer_text, seo_title, seo_description, contact_email, contact_phone, contact_address)
VALUES (
  1,
  '/logo.png',
  'Consultoria especializada em proteger o que mais importa para você. Solidez, confiança e atendimento humanizado.',
  'SM Saúde e Seguros | Proteção para você e sua família',
  'Consultoria especializada em planos de saúde e seguros. Proteja o que mais importa com a SM Saúde e Seguros.',
  'contato@smsaudeseguros.com.br',
  '(15) 99999-9999',
  'Sorocaba, SP (Atendimento Nacional)'
) ON CONFLICT (id) DO NOTHING;

-- Seed Hero Section
INSERT INTO hero_section (id, title, subtitle, cta_primary_text, cta_primary_link, cta_secondary_text, cta_secondary_link, hero_image_url, quote_text)
VALUES (
  1,
  'O futuro da sua família não pode depender da sorte.',
  'Você cuida de tudo e de todos. Mas quem cuida de você? Garanta planos de saúde e seguros com a solidez que sua família merece. Durma tranquilo sabendo que fez a escolha certa.',
  'Fazer Cotação Personalizada',
  '#contact',
  'Conhecer a SM Saúde',
  '#about',
  'https://images.unsplash.com/photo-1516733968668-dbdce39c4651?q=80&w=800&auto=format&fit=crop',
  'Se algo acontecer, eu preciso ter feito tudo o que estava ao meu alcance.'
) ON CONFLICT (id) DO NOTHING;

-- Seed About Section
INSERT INTO about_section (id, title, description_1, description_2)
VALUES (
  1,
  'Sobre a SM Saúde e Seguros',
  'Fundada por Matheus e Silvio, a SM Saúde e Seguros nasceu de uma necessidade clara: oferecer um atendimento que vai além da venda. Nós entendemos que contratar um seguro é um ato de responsabilidade e amor.',
  'Com mais de uma década de atuação, nos especializamos em atender clientes que buscam não apenas um preço, mas a certeza de que estarão amparados quando mais precisarem. Nossa missão é simplificar o complexo e garantir sua tranquilidade.'
) ON CONFLICT (id) DO NOTHING;

-- Seed About Spotlights
INSERT INTO about_spotlights (text, sort_order) VALUES
('Mais de 10 anos de experiência no mercado segurador', 1),
('Parceria com as maiores seguradoras nacionais e internacionais', 2),
('Atendimento consultivo e personalizado (Humanizado)', 3),
('Foco total na proteção patrimonial e familiar', 4),
('Agilidade na resolução de sinistros', 5),
('Transparência total nas apólices', 6);

-- Seed Solutions
INSERT INTO solutions (title, description, icon_name, sort_order) VALUES
('Planos de Saúde', 'Acesso aos melhores hospitais e médicos. Proteção completa para você e sua família não dependerem do sistema público.', 'HeartPulse', 1),
('Seguro de Vida', 'Garanta o futuro financeiro de quem você ama. Indenizações para imprevistos e sucessão patrimonial.', 'Umbrella', 2),
('Seguro Residencial', 'Proteja seu patrimônio contra incêndios, roubos e danos elétricos. Assistência 24h para emergências.', 'Home', 3),
('Seguro Auto', 'Dirija com tranquilidade. Cobertura contra colisões, roubos e terceiros, com assistência guincho rápida.', 'Car', 4);

-- Seed Testimonials
INSERT INTO testimonials (name, role, content, sort_order) VALUES
('Ricardo Mendes', 'Empresário', 'Eu sempre tive receio de seguros, achava complicado. A SM Saúde me explicou tudo com tanta clareza que me senti seguro para fechar o plano de saúde da minha família e o seguro da empresa.', 1),
('Fernanda Costa', 'Advogada', 'O atendimento do Matheus foi excepcional. Quando precisei usar o seguro do carro, eles resolveram tudo. Não precisei me estressar com nada. Recomendo de olhos fechados.', 2),
('Jorge Alvarez', 'Aposentado', 'Fiz meu seguro de vida pensando na minha esposa. A tranquilidade de saber que ela estará amparada não tem preço. Agradeço ao Silvio pela paciência e consultoria.', 3);

-- Seed FAQs
INSERT INTO faqs (question, answer, sort_order) VALUES
('Como funciona a contratação de um plano de saúde?', 'O processo é simples e consultivo. Primeiro, entendemos suas necessidades (rede preferencial, abrangência, orçamento). Depois, apresentamos as melhores opções do mercado. Após a escolha, cuidamos de toda a burocracia até a implantação.', 1),
('O seguro de vida cobre apenas falecimento?', 'Não! Os seguros modernos oferecem coberturas em vida, como indenização por doenças graves, invalidez e diárias de internação, protegendo você também no presente.', 2),
('Vocês atendem apenas em Sorocaba?', 'Nossa sede é em Sorocaba e temos forte atuação na capital e Vale do Paraíba, mas graças ao atendimento digital, conseguimos atender clientes em todo o território nacional.', 3),
('Quanto custa uma cotação?', 'A cotação e a consultoria inicial são 100% gratuitas. Nosso objetivo é apresentar a melhor solução para você sem compromisso.', 4);
