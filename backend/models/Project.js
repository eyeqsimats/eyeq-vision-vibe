
const supabase = require('../config/supabase');

const Project = {
    // Convert database fields (lowercase) to camelCase for frontend
    formatProjectData(dbProject) {
        if (!dbProject) return null;

        return {
            ...dbProject,
            repoLink: dbProject.repolink,
            demoLink: dbProject.demolink,
            linkedInPostLink: dbProject.linkedinpostlink,
            authorUid: dbProject.authoruid,
            createdAt: dbProject.createdat,
            updatedAt: dbProject.updatedat,
            status: dbProject.status // Ensure status is included
        };
    },

    async getAll() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .order('createdat', { ascending: false });

        if (error) {
            console.error('Supabase projects getAll error:', error);
            throw error;
        }
        return (data || []).map(project => this.formatProjectData(project));
    },

    async getApproved() {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('status', 'approved')
            .order('createdat', { ascending: false });

        if (error) {
            console.error('Supabase projects getApproved error:', error);
            throw error;
        }
        return (data || []).map(project => this.formatProjectData(project));
    },

    async findByAuthor(uid) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('authoruid', uid)
            .order('createdat', { ascending: false });

        if (error) {
            console.error('Supabase projects findByAuthor error:', error);
            throw error;
        }
        console.log(`Found ${data?.length || 0} projects for user ${uid}`);
        return (data || []).map(project => this.formatProjectData(project));
    },

    async findById(id) {
        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id) // Assuming Supabase uses 'id' as primary key
            .single();

        if (error && error.code !== 'PGRST116') {
            console.error('Supabase project findById error:', error);
            throw error;
        }
        return this.formatProjectData(data);
    },

    async create(projectData) {
        // Map camelCase to lowercase for existing Supabase schema
        const dbData = {
            title: projectData.title,
            description: projectData.description,
            authoruid: projectData.authorUid,
            status: projectData.status || 'pending',
            repolink: projectData.repoLink || '',
            demolink: projectData.demoLink || '',
            linkedinpostlink: projectData.linkedInPostLink || ''
        };
        
        const { data, error } = await supabase
            .from('projects')
            .insert(dbData)
            .select()
            .single();

        if (error) {
            console.error('Supabase project create error:', error);
            throw error;
        }
        return this.formatProjectData(data);
    },

    async update(id, updates) {
        const { data, error } = await supabase
            .from('projects')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Supabase project update error:', error);
            throw error;
        }
        return this.formatProjectData(data);
    },

    async delete(id) {
        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Supabase project delete error:', error);
            throw error;
        }
        return true;
    }
};

module.exports = Project;
