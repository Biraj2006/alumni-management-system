const { supabase } = require('../config/db');

class AlumniProfile {
  static async findByUserId(userId) {
    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('*, users(name, email)')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data ? { ...data, name: data.users?.name, email: data.users?.email } : null;
  }

  static async findAll() {
    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('*, users!inner(name, email, is_approved)')
      .eq('users.is_approved', true);
    
    if (error) throw error;
    return data.map(p => ({ ...p, name: p.users?.name, email: p.users?.email }));
  }

  static async findMentors() {
    const { data, error } = await supabase
      .from('alumni_profiles')
      .select('*, users!inner(name, email, is_approved)')
      .eq('is_mentor', true)
      .eq('users.is_approved', true);
    
    if (error) throw error;
    return data.map(p => ({ ...p, name: p.users?.name, email: p.users?.email }));
  }

  static async createOrUpdate(userId, profileData) {
    const existing = await this.findByUserId(userId);
    
    if (existing) {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('alumni_profiles')
        .insert([{ user_id: userId, ...profileData }]);
      if (error) throw error;
    }
    return true;
  }

  static async toggleMentor(userId) {
    const profile = await this.findByUserId(userId);
    const newStatus = !profile?.is_mentor;
    
    if (profile) {
      const { error } = await supabase
        .from('alumni_profiles')
        .update({ is_mentor: newStatus })
        .eq('user_id', userId);
      if (error) throw error;
    } else {
      const { error } = await supabase
        .from('alumni_profiles')
        .insert([{ user_id: userId, is_mentor: newStatus }]);
      if (error) throw error;
    }
    return newStatus;
  }
}

module.exports = AlumniProfile;
