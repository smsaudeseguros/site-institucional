import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

async function testLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'ygorchaves7@gmail.com',
    password: 'mudar123456',
  });
  console.log("ygorchaves7@gmail.com:", error ? error.message : "Success");
}
testLogin();
