
const supabase = require('../config/supabase');

const Achievement = {
    // Use lowercase column names to match Supabase schema and normalize output for the UI
    async getByUser(uid) {
        const { data, error } = await supabase
            .from('achievements')
            .select('*')
            .eq('useruid', uid)
            .order('awardedat', { ascending: false });

        if (error) {
            console.error('Supabase achievements getByUser error:', error);
            throw error;
        }

        return (data || []).map((row) => ({
            ...row,
            userUid: row.useruid,
            awardedAt: row.awardedat,
        }));
    },

    async create(achievementData) {
        const payload = {
            useruid: achievementData.userUid || achievementData.useruid,
            title: achievementData.title,
            description: achievementData.description,
            awardedat: achievementData.awardedAt || achievementData.awardedat || new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('achievements')
            .insert(payload)
            .select()
            .single();

        if (error) {
            console.error('Supabase achievement create error:', error);
            throw error;
        }

        return {
            ...data,
            userUid: data.useruid,
            awardedAt: data.awardedat,
        };
    }
};

module.exports = Achievement;
