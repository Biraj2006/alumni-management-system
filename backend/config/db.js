const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  'https://utlgzislzguarpskgszc.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV0bGd6aXNsemd1YXJwc2tnc3pjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4ODU1MDAsImV4cCI6MjA3ODQ2MTUwMH0.Y_78lfePcNwwAO80dGdNIrOs3XHzOqD9PjIDwVr-kIM'
);

// Test database connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('users').select('count').limit(1);
    if (error) throw error;
    console.log('Supabase connected successfully');
  } catch (error) {
    console.error('Supabase connection failed:', error.message);
    console.log('Make sure you have created the tables using supabase-schema.sql');
  }
};

module.exports = { supabase, testConnection };
