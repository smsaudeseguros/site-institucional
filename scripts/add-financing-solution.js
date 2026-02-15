const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SECRET_SERVICE_ROLE;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SECRET_SERVICE_ROLE');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function main() {
  const title = 'Financiamento de Veículos';
  const description = 'Financie seu veículo em até 60x com taxas de juros competitivas e planos customizados.';
  const icon_name = 'Car';
  const sort_order = 5;

  console.log(`Checking for existing solution: "${title}"...`);

  const { data: existing, error: searchError } = await supabase
    .from('solutions')
    .select('id')
    .eq('title', title)
    .maybeSingle();

  if (searchError) {
    console.error('Error searching:', searchError);
    process.exit(1);
  }

  if (existing) {
    console.log(`Solution found (ID: ${existing.id}). Updating...`);
    const { error } = await supabase
      .from('solutions')
      .update({ description, icon_name, sort_order })
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating:', error);
      process.exit(1);
    }
    console.log('Update successful.');
  } else {
    console.log('Solution not found. Inserting...');
    const { error } = await supabase
      .from('solutions')
      .insert([{ title, description, icon_name, sort_order }]);

    if (error) {
      console.error('Error inserting:', error);
      process.exit(1);
    }
    console.log('Insert successful.');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
