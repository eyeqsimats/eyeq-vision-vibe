
const supabase = require('../config/supabase');

const User = {
  // Convert database fields (lowercase) to camelCase for frontend
  formatUserData(dbUser) {
    if (!dbUser) return null;

    return {
      ...dbUser,
      photoURL: dbUser.photourl,
      registerNumber: dbUser.registernumber,
      mobileNumber: dbUser.mobilenumber,
      achievementCount: dbUser.achievementcount,
      socialLinks: typeof dbUser.sociallinks === 'string' ? JSON.parse(dbUser.sociallinks || '{}') : (dbUser.sociallinks || {}),
      stats: typeof dbUser.stats === 'string' ? JSON.parse(dbUser.stats || '{}') : (dbUser.stats || {})
    };
  },

  async findById(id) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('uid', id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Supabase findById error:', error);
      throw error;
    }
    console.log('User.findById supabase response:', { id, found: !!data, error: error ? error.message : null });
    return this.formatUserData(data);
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase findByEmail error:', error);
      throw error;
    }
    return this.formatUserData(data);
  },

  async create(userData) {
    const { data, error } = await supabase
      .from('users')
      .upsert(userData)
      .select()
      .single();

    if (error) {
      console.error('Supabase create/upsert error:', error);
      throw error;
    }
    console.log('User.create supabase response:', { uid: userData.uid, created: !!data });
    return data;
  },

  async updateStreak(uid) {
    // Get current user
    const user = await this.findById(uid);
    if (!user) return null;

    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const lastLogin = user.stats?.lastLoginDate ? new Date(user.stats.lastLoginDate).toISOString().split('T')[0] : null;
    
    let currentStreak = user.stats?.currentStreak || 0;
    let longestStreak = user.stats?.longestStreak || 0;
    let currentStreakStartDate = user.stats?.currentStreakStartDate;

    if (lastLogin !== today) {
      // Check if it's a consecutive day
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (lastLogin === yesterdayStr) {
        // Consecutive day: increment streak
        currentStreak += 1;
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
          user.stats.longestStreakStartDate = currentStreakStartDate || today;
          user.stats.longestStreakEndDate = today;
        }
      } else {
        // Not consecutive: reset streak to 1
        currentStreak = 1;
        currentStreakStartDate = today;
      }
    }

    // Update user stats with new streak and last login date
    const updatedStats = {
      ...user.stats,
      currentStreak,
      longestStreak,
      currentStreakStartDate: currentStreakStartDate || today,
      lastLoginDate: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('users')
      .update({ stats: updatedStats })
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      console.error('Supabase updateStreak error:', error);
      throw error;
    }
    console.log('Streak updated for user:', uid, { currentStreak, longestStreak });
    return this.formatUserData(data);
  },

  async update(uid, updates) {
    console.log('User.update called for uid:', uid, 'with updates:', updates);
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('uid', uid)
      .select()
      .single();

    if (error) {
      console.error('Supabase update error:', error);
      throw error;
    }
    console.log('User updated successfully');
    return this.formatUserData(data);
  },

  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      console.error('Supabase getAll error:', error);
      throw error;
    }
    // Format all users' data to camelCase for frontend
    return (data || []).map(user => this.formatUserData(user));
  }
};

module.exports = User;
