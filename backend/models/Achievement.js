
const supabase = require('../config/supabase');

const Achievement = {
    async getByUser(uid) {
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('userUid', uid)
            .order('awardedAt', { ascending: false });

        if (error) {
            console.error('Supabase achievements getByUser error:', error);
            throw error;
        }
        return data;
    },

    async create(achievementData) {
        const { data, error } = await supabase
            .from('achievements')
            .insert(achievementData)
            .select()
            .single();

        if (error) {
            console.error('Supabase achievement create error:', error);
            throw error;
        }
        return data;
    }
};

module.exports = Achievement;
