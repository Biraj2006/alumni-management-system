const { supabase } = require('../config/db');

class MentorshipRequest {
  static async create(requestData) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .insert([requestData])
      .select('id')
      .single();
    
    if (error) throw error;
    return data.id;
  }

  static async findByStudentId(studentId) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select('*, alumni:alumni_id(name, email), alumni_profiles!inner(company, designation)')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(r => ({
      ...r,
      alumni_name: r.alumni?.name,
      alumni_email: r.alumni?.email,
      company: r.alumni_profiles?.company,
      designation: r.alumni_profiles?.designation
    }));
  }

  static async findByAlumniId(alumniId) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select('*, student:student_id(name, email)')
      .eq('alumni_id', alumniId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data.map(r => ({
      ...r,
      student_name: r.student?.name,
      student_email: r.student?.email
    }));
  }

  static async findById(id) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }

  static async updateStatus(id, status) {
    const { error } = await supabase
      .from('mentorship_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async delete(id) {
    const { error } = await supabase
      .from('mentorship_requests')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }

  static async getStats() {
    const { data } = await supabase.from('mentorship_requests').select('status');
    return {
      total: data?.length || 0,
      pending: data?.filter(r => r.status === 'pending').length || 0,
      accepted: data?.filter(r => r.status === 'accepted').length || 0,
      rejected: data?.filter(r => r.status === 'rejected').length || 0
    };
  }

  static async checkExisting(studentId, alumniId) {
    const { data, error } = await supabase
      .from('mentorship_requests')
      .select('id')
      .eq('student_id', studentId)
      .eq('alumni_id', alumniId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }
}

module.exports = MentorshipRequest;
