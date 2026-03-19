import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SECRET_SERVICE_ROLE

const supabase = createClient(supabaseUrl!, serviceRoleKey!)

async function run() {
    const { data, error } = await supabase.from('leads').insert({
        name: 'test manual 2',
        email: 'test@example.com',
        phone: '11111'
    }).select()
    console.log(data, error)
}

run()
