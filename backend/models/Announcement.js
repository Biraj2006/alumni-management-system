const { supabase } = require('../config/db');

class Announcement {
  static async create(announcementData) {
    const { data, error } = await supabase
      .from('announcements')
      .insert([announcementData])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async findAll(userRole = null) {
    let query = supabase
      .from('announcements')
      .select('*, users(name)')
      .order('created_at', { ascending: false });
    
    if (userRole === 'alumni') {
      query = query.in('target_audience', ['all', 'alumni']);
    } else if (userRole === 'student') {
      query = query.in('target_audience', ['all', 'students']);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(a => ({ ...a, author_name: a.users?.name }));
  }

  static async findRecent(limit = 5, userRole = null) {
    let query = supabase
      .from('announcements')
      .select('*, users(name)')
      .order('created_at', { ascending: false })
      .limit(limit);
    
    if (userRole === 'alumni') {
      query = query.in('target_audience', ['all', 'alumni']);
    } else if (userRole === 'student') {
      query = query.in('target_audience', ['all', 'students']);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(a => ({ ...a, author_name: a.users?.name }));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('announcements')
      .select('*, users(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { ...data, author_name: data.users?.name };
  }

  static async update(id, announcementData) {
    const { error } = await supabase
      .from('announcements')
      .update({ ...announcementData, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
}

module.exports = Announcement;
