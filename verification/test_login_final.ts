import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_SERVICE_ROLE as string
);

async function checkUser() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  const user = users.find(u => u.email === 'ygorchaves7@gmail.com');
  console.log(user);
}
checkUser();
