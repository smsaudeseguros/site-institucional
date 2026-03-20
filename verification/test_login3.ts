import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_SERVICE_ROLE as string
);

async function updatePassword() {
  const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
    (await supabaseAdmin.auth.admin.listUsers()).data.users.find(u => u.email === 'ygorchaves7@gmail.com')!.id,
    { password: 'mudar123456' }
  );
  if (error) {
    console.error("Error updating password:", error.message);
  } else {
    console.log("Password updated successfully");
  }
}
updatePassword();
