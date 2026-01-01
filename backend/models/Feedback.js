
const supabase = require('../config/supabase');

const Feedback = {
  async getAll() {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Supabase feedback getAll error:', error);
      throw error;
    }
    return data || [];
  },

  async getByUserUid(userUid) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('useruid', userUid)
      .order('createdat', { ascending: false });

    if (error) {
      console.error('Supabase feedback getByUserUid error:', error);
      throw error;
    }
    return data || [];
  },

  async create(feedbackData) {
    const { data, error } = await supabase
      .from('feedback')
      .insert(feedbackData)
      .select()
      .single();

    if (error) {
      console.error('Supabase feedback create error:', error);
      throw error;
    }
    return data;
  },

  async update(id, updates) {
    const { data, error } = await supabase
      .from('feedback')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Supabase feedback update error:', error);
      throw error;
    }
    return data;
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('feedback')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase feedback findById error:', error);
      throw error;
    }
    return data;
  },

  async delete(id) {
    const { error } = await supabase
      .from('feedback')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Supabase feedback delete error:', error);
      throw error;
    }
    return true;
  }
};

module.exports = Feedback;
