const { supabase } = require('../config/db');
const bcrypt = require('bcryptjs');

class User {
  static async create(userData) {
    const { name, email, password, role } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const isApproved = role === 'student' ? true : false;
    
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword, role, is_approved: isApproved }])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, is_approved, created_at')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async findAll(role = null) {
    let query = supabase
      .from('users')
      .select('id, name, email, role, is_approved, created_at')
      .order('created_at', { ascending: false });
    
    if (role) {
      query = query.eq('role', role);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  static async findPendingApprovals() {
    const { data, error } = await supabase
      .from('users')
      .select('id, name, email, role, created_at')
      .eq('is_approved', false)
      .eq('role', 'alumni');
    
    if (error) throw error;
    return data;
  }

  static async approve(id) {
    const { error } = await supabase
      .from('users')
      .update({ is_approved: true })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async update(id, userData) {
    const { name, email } = userData;
    const { error } = await supabase
      .from('users')
      .update({ name, email })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  static async getStats() {
    const { data: allUsers } = await supabase.from('users').select('role, is_approved');
    
    return {
      total: allUsers?.length || 0,
      alumni: allUsers?.filter(u => u.role === 'alumni').length || 0,
      students: allUsers?.filter(u => u.role === 'student').length || 0,
      pending: allUsers?.filter(u => !u.is_approved).length || 0
    };
  }
}

module.exports = User;
