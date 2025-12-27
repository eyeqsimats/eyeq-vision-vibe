const supabase = require('../config/supabase');

const Contribution = {
  async getByProjectId(projectId) {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('projectid', projectId)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Supabase contribution getByProjectId error:', error);
      throw error;
    }
    return data;
  },

  async getByUserUid(userUid) {
    const { data, error } = await supabase
      .from('contributions')
      .select('*')
      .eq('useruid', userUid)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Supabase contribution getByUserUid error:', error);
      throw error;
    }
    return data;
  },

  async create(contributionData) {
    const { data, error } = await supabase
      .from('contributions')
      .insert(contributionData)
      .select()
      .single();

    if (error) {
      console.error('Supabase contribution create error:', error);
      throw error;
    }
    return data;
  }
};

module.exports = Contribution;
