import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.SUPABASE_SECRET_SERVICE_ROLE as string
);

async function forceUpdatePassword() {
  const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers();
  const user = users.find(u => u.email === 'ygorchaves7@gmail.com');

  if (user) {
    const { data, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: { force_password_change: false }
      }
    );
    console.log("force_password_change removed:", updateError ? updateError.message : "Success");
  }
}
forceUpdatePassword();
