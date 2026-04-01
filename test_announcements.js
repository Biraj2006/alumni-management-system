const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env manually
const envPath = path.join(__dirname, 'backend', '.env');
const env = fs.readFileSync(envPath, 'utf8').split('\n').reduce((acc, line) => {
    const [key, value] = line.split('=');
    if (key && value) acc[key.trim()] = value.trim();
    return acc;
}, {});

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY);

async function checkAnnouncements() {
  const { data, error } = await supabase
    .from('announcements')
    .select('*');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('--- Announcements Dump ---');
  console.log('Total:', data.length);
  data.forEach(a => {
    console.log(`Title: ${a.title}, Audience: "${a.target_audience}"`);
  });
  console.log('-------------------------');
}

checkAnnouncements();
