import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_SERVICE_ROLE as string
);

async function insertLog() {
  const { data, error } = await supabaseAdmin.from('system_logs').insert([
    {
      event_type: 'TEST_SUBMISSION',
      status: 'success',
      error_message: 'Pre-commit test check for modal functionality.',
      payload: { foo: 'bar', timestamp: new Date().toISOString() }
    }
  ]);
  if (error) {
    console.error("Error inserting:", error);
  } else {
    console.log("Inserted log.");
  }
}
insertLog();
