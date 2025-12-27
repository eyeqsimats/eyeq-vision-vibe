
const supabase = require('../config/supabase');

const Announcement = {
    async getLatest() {
        const { data, error } = await supabase
            .from('announcements')
            .select('*')
            .order('createdat', { ascending: false })
            .limit(1)
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase announcement getLatest error:', error);
            throw error;
        }
        return data;
    },

    async create(announcementData) {
        const { data, error } = await supabase
            .from('announcements')
            .insert(announcementData)
            .select()
            .single();

        if (error) {
            console.error('Supabase announcement create error:', error);
            throw error;
        }
        return data;
    }
};

module.exports = Announcement;
