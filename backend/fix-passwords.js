require('dotenv').config();
const { supabase } = require('./config/db');
const bcrypt = require('bcryptjs');

async function fixOtherPasswords() {
    try {
        const { data: users, error } = await supabase.from('users').select('*').neq('email', 'admin@college.edu');
        if (error) throw error;

        const newHash = await bcrypt.hash('password123', 10);

        for (const u of users) {
            const { error: updateError } = await supabase
                .from('users')
                .update({ password: newHash })
                .eq('id', u.id);

            if (updateError) {
                console.error(`Failed to update ${u.email}:`, updateError);
            } else {
                console.log(`Successfully updated password for ${u.email} to "password123"`);
            }
        }
    } catch (err) {
        console.error('Error:', err.message);
    }
}

fixOtherPasswords();
