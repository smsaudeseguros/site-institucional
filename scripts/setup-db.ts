import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Load .env.local manually
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, ...values] = line.split('=');
        if (key && values.length > 0) {
            process.env[key.trim()] = values.join('=').trim();
        }
    });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function main() {
  console.log('Starting DB Setup...');

  // 1. Create Bucket
  const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'app-smsaudeeseguros-institucional';
  try {
      const { data: buckets, error: bucketListError } = await supabase.storage.listBuckets();

      if (bucketListError) {
          console.error('Error listing buckets:', bucketListError);
      } else {
          const bucketExists = buckets.find(b => b.name === bucketName);
          if (!bucketExists) {
            console.log(`Creating bucket: ${bucketName}`);
            const { error: createError } = await supabase.storage.createBucket(bucketName, {
                public: true,
                fileSizeLimit: 5242880, // 5MB
                allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif']
            });
            if (createError) console.error('Error creating bucket:', createError);
            else console.log('Bucket created successfully.');
          } else {
              console.log(`Bucket ${bucketName} already exists.`);
          }
      }
  } catch (e) {
      console.error("Storage check failed (storage might not be enabled?):", e);
  }

  // 2. Create Admin User
  const email = 'ygorchaves7@gmail.com';
  const password = 'mudar123';

  // Check if user exists
  // Admin API `listUsers`
  const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
      console.error('Error listing users:', listError);
  } else {
      let user = users.find(u => u.email === email);

      if (!user) {
          console.log(`Creating user: ${email}`);
          const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
              email,
              password,
              email_confirm: true
          });
          if (createError) {
              console.error('Error creating user:', createError);
          } else {
              console.log('User created successfully.');
              user = newUser.user;
          }
      } else {
          console.log(`User ${email} already exists.`);
      }

      // 3. Ensure Profile (Role: Admin)
      // Note: This step depends on the 'profiles' table existing.
      // Since I can't guarantee the user ran the SQL yet, this might fail if they haven't.
      // But I'll leave it here as a helper.
      if (user) {
          console.log(`Ensuring profile for ${user.id}...`);
          try {
              // Check profile
              const { data: profile, error: profileError } = await supabase.from('profiles').select('*').eq('id', user.id).single();

              // If table doesn't exist, this will error.
              if (profileError && profileError.code === 'PGRST116') { // Not found row, but table exists
                  const { error: insertError } = await supabase.from('profiles').insert({
                      id: user.id,
                      email: email,
                      role: 'admin'
                  });
                  if (insertError) console.error('Error creating profile:', insertError);
                  else console.log('Profile created as Admin.');
              } else if (!profile && profileError) {
                   console.error("Error checking profile (Table might not exist yet? Run SQL Schema first):", profileError.message);
              } else if (profile && profile.role !== 'admin') {
                   const { error: updateError } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', user.id);
                   if (updateError) console.error('Error updating profile to admin:', updateError);
                   else console.log('Profile updated to Admin.');
              } else {
                  console.log('Profile already correct.');
              }
          } catch (e) {
              console.log("Profile check failed. Make sure table 'profiles' exists.");
          }
      }
  }
}

main();
