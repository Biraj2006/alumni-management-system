const { supabase } = require('../config/db');

class JobPosting {
  static async create(jobData) {
    const { data, error } = await supabase
      .from('job_postings')
      .insert([jobData])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async findAll(activeOnly = true) {
    let query = supabase
      .from('job_postings')
      .select('*, users(name)')
      .order('created_at', { ascending: false });
    
    if (activeOnly) {
      query = query.eq('is_active', true);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(j => ({ ...j, alumni_name: j.users?.name }));
  }

  static async findByAlumniId(alumniId) {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*')
      .eq('alumni_id', alumniId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('job_postings')
      .select('*, users(name)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return { ...data, alumni_name: data.users?.name };
  }

  static async update(id, jobData) {
    const { error } = await supabase
      .from('job_postings')
      .update({ ...jobData, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('job_postings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async toggleActive(id) {
    const job = await this.findById(id);
    const { error } = await supabase
      .from('job_postings')
      .update({ is_active: !job.is_active })
      .eq('id', id);
    
    if (error) throw error;
    return !job.is_active;
  }

  static async getStats() {
    const { data } = await supabase.from('job_postings').select('is_active');
    return {
      total: data?.length || 0,
      active: data?.filter(j => j.is_active).length || 0,
      inactive: data?.filter(j => !j.is_active).length || 0
    };
  }
}

module.exports = JobPosting;
