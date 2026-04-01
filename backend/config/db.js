const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Use environment variables for security
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase Environment Variables! Check your .env file.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Test database connection
 * We select '*' from users with a limit of 0 just to check if the 
 * table exists and the API responds.
 */
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    if (error) {
      // If the error is 'PGRST116', it just means the table is empty, which is fine.
      if (error.code === 'PGRST116') {
        console.log('Supabase connected: Table "users" exists but is empty.');
        return;
      }
      throw error;
    }
    
    console.log('✅ Supabase connected successfully');
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message);
    console.log('Action needed: Ensure you ran your SQL script in the Supabase SQL Editor.');
  }
};

module.exports = { supabase, testConnection };