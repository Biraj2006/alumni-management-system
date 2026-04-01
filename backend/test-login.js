require('dotenv').config();
const { supabase } = require('./config/db');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

async function test() {
  const email = 'admin@college.edu'; // Using the admin email from schema.sql
  const plaintextPassword = 'admin123';
  
  console.log(`Testing login for ${email}...`);
  
  try {
    // 1. Check what Supabase returns
    const { data: userRaw, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
      
    if (error) {
      console.error('Supabase error:', error);
      return;
    }
    
    console.log('User found in DB. Password hash present:', !!userRaw.password);
    console.log('Raw user object keys:', Object.keys(userRaw));
    
    // 2. Check User model
    const userModel = await User.findByEmail(email);
    console.log('User model returned password:', !!userModel.password);
    
    // 3. Test password comparison
    if (userModel && userModel.password) {
      const isMatch = await bcrypt.compare(plaintextPassword, userModel.password);
      console.log('Password match:', isMatch);
    } else {
      console.log('Cannot compare: No password in user model');
    }
  } catch (err) {
    console.error('Test script error:', err);
  }
}

test();
