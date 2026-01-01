const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Project = require('../models/Project');
const Feedback = require('../models/Feedback');
const Contribution = require('../models/Contribution');
const { protect, admin } = require('../middleware/authMiddleware');
const supabase = require('../config/supabase');

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Admin
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const users = await User.getAll();
        const projects = await Project.getAll();
        const feedbacks = await Feedback.getAll();

        console.log(`[ADMIN STATS] Users: ${users?.length}, Projects: ${projects?.length}, Feedbacks: ${feedbacks?.length}`);

        // Count projects by status
        const approvedProjects = projects.filter(p => p.status === 'approved').length;
        const pendingProjects = projects.filter(p => p.status === 'pending').length;
        const rejectedProjects = projects.filter(p => p.status === 'rejected').length;

        const stats = {
            totalMembers: users.length,
            totalProjects: projects.length,
            approvedProjects: approvedProjects,
            pendingProjects: pendingProjects,
            rejectedProjects: rejectedProjects,
            totalFeedback: feedbacks.length,
            dailyActiveUsers: users.filter((u) => {
                // Count users who logged in today
                const lastLogin = u.stats?.lastLoginDate;
                if (!lastLogin) return false;
                const today = new Date().toISOString().split('T')[0];
                return lastLogin.split('T')[0] === today;
            }).length,
        };

        console.log('[ADMIN STATS] Response:', stats);
        console.log('[ADMIN STATS] Project breakdown - Approved:', approvedProjects, 'Pending:', pendingProjects, 'Rejected:', rejectedProjects);
        res.json(stats);
    } catch (error) {
        console.error('[ADMIN STATS] Error fetching stats:', error.message);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.getAll();
        console.log(`[ADMIN] Fetched ${users?.length || 0} users from database`);
        console.log('[ADMIN] User data sample:', users.slice(0, 1));
        res.json(users);
    } catch (error) {
        console.error('[ADMIN] Error fetching users:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all projects (including pending and rejected)
// @route   GET /api/admin/projects
// @access  Admin
router.get('/projects', protect, admin, async (req, res) => {
    try {
        const projects = await Project.getAll();
        console.log(`[ADMIN] Fetched ${projects?.length || 0} raw projects from database`);
        
        // Enrich projects with author information
        const enrichedProjects = await Promise.all(
            projects.map(async (project) => {
                try {
                    if (project.authorUid || project.authoruid) {
                        const authorUid = project.authorUid || project.authoruid;
                        console.log(`[ADMIN] Fetching author for project ${project.id}: ${authorUid}`);
                        const author = await User.findById(authorUid);
                        const authorName = author?.name || (author?.email ? author.email.split('@')[0] : 'Unknown Author');
                        console.log(`[ADMIN] Author found for ${project.id}:`, authorName);
                        return {
                            ...project,
                            authorName: authorName,
                            authorEmail: author?.email || '',
                            authorPhoto: author?.photoURL || author?.photourl || ''
                        };
                    }
                    return {
                        ...project,
                        authorName: 'Unknown Author',
                        authorEmail: '',
                        authorPhoto: ''
                    };
                } catch (err) {
                    console.error(`[ADMIN] Error enriching project ${project.id}:`, err.message);
                    return {
                        ...project,
                        authorName: 'Unknown Author',
                        authorEmail: '',
                        authorPhoto: ''
                    };
                }
            })
        );
        
        console.log(`[ADMIN] Returning ${enrichedProjects.length} enriched projects`);
        const statusCounts = {
            pending: enrichedProjects.filter(p => p.status === 'pending').length,
            approved: enrichedProjects.filter(p => p.status === 'approved').length,
            rejected: enrichedProjects.filter(p => p.status === 'rejected').length
        };
        console.log('[ADMIN] Status breakdown:', statusCounts);
        console.log('[ADMIN] Sample project:', enrichedProjects[0]);
        res.json(enrichedProjects);
    } catch (error) {
        console.error('[ADMIN] Error fetching projects:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete contribution
// @route   DELETE /api/admin/contributions/:id
// @access  Admin
router.delete('/contributions/:id', protect, admin, async (req, res) => {
    try {
        await Contribution.delete(req.params.id);
        console.log(`[ADMIN] Deleted contribution ${req.params.id}`);
        res.json({ message: 'Contribution deleted' });
    } catch (error) {
        console.error('[ADMIN] Error deleting contribution:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all feedback
// @route   GET /api/admin/feedback
// @access  Admin
router.get('/feedback', protect, admin, async (req, res) => {
    try {
        const feedbacks = await Feedback.getAll();
        console.log(`[ADMIN] Fetched ${feedbacks?.length || 0} feedback items from database`);
        
        // Enrich feedback with user information if not already present
        const enrichedFeedbacks = await Promise.all(
            feedbacks.map(async (fb) => {
                try {
                    // If username/useremail are already in the feedback record, use them
                    if (fb.username || fb.useremail) {
                        return {
                            ...fb,
                            userName: fb.username || 'Unknown User',
                            userEmail: fb.useremail || ''
                        };
                    }
                    
                    // Otherwise, fetch from User model
                    if (fb.useruid) {
                        const user = await User.findById(fb.useruid);
                        return {
                            ...fb,
                            userName: user?.name || 'Unknown User',
                            userEmail: user?.email || ''
                        };
                    }
                    
                    return {
                        ...fb,
                        userName: 'Unknown User',
                        userEmail: ''
                    };
                } catch (err) {
                    console.error(`[ADMIN] Error enriching feedback ${fb.id}:`, err.message);
                    return {
                        ...fb,
                        userName: fb.username || 'Unknown User',
                        userEmail: fb.useremail || ''
                    };
                }
            })
        );
        
        console.log(`[ADMIN] Returning ${enrichedFeedbacks.length} enriched feedback items`);
        res.json(enrichedFeedbacks);
    } catch (error) {
        console.error('[ADMIN] Error fetching feedback:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete feedback
// @route   DELETE /api/admin/feedback/:id
// @access  Admin
router.delete('/feedback/:id', protect, admin, async (req, res) => {
    try {
        const feedback = await Feedback.findById(req.params.id);
        if (!feedback) {
            return res.status(404).json({ message: 'Feedback not found' });
        }
        await Feedback.delete(req.params.id);
        console.log(`[ADMIN] Deleted feedback ${req.params.id}`);
        res.json({ message: 'Feedback deleted' });
    } catch (error) {
        console.error('[ADMIN] Error deleting feedback:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a project's status
// @route   PUT /api/admin/projects/:id/status
// @access  Admin
router.put('/projects/:id/status', protect, admin, async (req, res) => {
    try {
        const { status } = req.body;
        const project = await Project.findById(req.params.id);

        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        const updatedData = {
            ...project,
            status: status // 'approved', 'rejected', or 'pending'
        };

        const updatedProject = await Project.update(req.params.id, updatedData);
        res.json(updatedProject);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update user's achievement count
// @route   PUT /api/admin/users/:uid/achievements
// @access  Admin
router.put('/users/:uid/achievements', protect, admin, async (req, res) => {
    try {
        const { achievementCount } = req.body;
        const uid = req.params.uid;

        console.log(`Updating achievement count for user ${uid} to ${achievementCount}`);

        // Validate input
        if (typeof achievementCount !== 'number' || achievementCount < 0) {
            return res.status(400).json({ message: 'Achievement count must be a non-negative number' });
        }

        // Update user's achievement count
        const updatedUser = await User.update(uid, { achievementcount: achievementCount });
        console.log('Achievement count updated successfully');
        res.json(updatedUser);
    } catch (error) {
        console.error('Error updating achievement count:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a user
// @route   PUT /api/admin/users/:uid
// @access  Admin
router.put('/users/:uid', protect, admin, async (req, res) => {
    try {
        const { name, bio, skills, currentStreak, longestStreak } = req.body;
        const uid = req.params.uid;

        console.log(`[ADMIN] Updating user ${uid}`);

        // Build update object
        const updateData = {};
        if (name) updateData.name = name;
        if (bio) updateData.bio = bio;
        if (skills) updateData.skills = skills;
        
        // Update stats if streak values are provided
        if (currentStreak !== undefined || longestStreak !== undefined) {
            const user = await User.findById(uid);
            const currentStats = user?.stats || {};
            
            if (currentStreak !== undefined) currentStats.currentStreak = parseInt(currentStreak);
            if (longestStreak !== undefined) currentStats.longestStreak = parseInt(longestStreak);
            
            updateData.stats = currentStats;
        }

        const updatedUser = await User.update(uid, updateData);
        console.log(`[ADMIN] User ${uid} updated successfully`);
        res.json(updatedUser);
    } catch (error) {
        console.error('[ADMIN] Error updating user:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update a project (admin can edit all projects)
// @route   PUT /api/admin/projects/:id
// @access  Admin
router.put('/projects/:id', protect, admin, async (req, res) => {
    try {
        const projectId = req.params.id;
        const { title, description, repoLink, demoLink, linkedInPostLink } = req.body;

        console.log(`[ADMIN] Updating project ${projectId}`);

        // Build update object - map camelCase to lowercase for database
        const updates = {};
        if (title) updates.title = title;
        if (description) updates.description = description;
        if (repoLink) updates.repolink = repoLink;
        if (demoLink) updates.demolink = demoLink;
        if (linkedInPostLink) updates.linkedinpostlink = linkedInPostLink;

        const updatedProject = await Project.update(projectId, updates);
        console.log(`[ADMIN] Project ${projectId} updated successfully`);
        res.json(updatedProject);
    } catch (error) {
        console.error('[ADMIN] Error updating project:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get detailed member profile with statistics
// @route   GET /api/admin/members/:uid
// @access  Admin
router.get('/members/:uid', protect, admin, async (req, res) => {
    try {
        const uid = req.params.uid;
        const user = await User.findById(uid);
        
        if (!user) {
            return res.status(404).json({ message: 'Member not found' });
        }

        // Get user's projects
        const userProjects = await Project.findByAuthor(uid);
        
        // Get user's contributions
        const contributions = await Contribution.getByUserUid(uid);
        
        // Get user's feedback
        const userFeedback = await Feedback.getByUserUid(uid);

        const memberData = {
            ...user,
            projectCount: userProjects.length,
            contributionCount: contributions.length,
            feedbackCount: userFeedback.length,
            projects: userProjects,
            contributions: contributions,
            feedback: userFeedback
        };

        console.log(`[ADMIN] Fetched detailed profile for member ${uid}`);
        res.json(memberData);
    } catch (error) {
        console.error('[ADMIN] Error fetching member profile:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all contributions (admin view)
// @route   GET /api/admin/contributions
// @access  Admin
router.get('/contributions', protect, admin, async (req, res) => {
    try {
        const { data: contributions, error } = await supabase
            .from('contributions')
            .select('*')
            .order('createdat', { ascending: false });

        if (error) {
            throw error;
        }

        // Enrich with user information
        const enrichedContributions = await Promise.all(
            (contributions || []).map(async (contrib) => {
                try {
                    const user = await User.findById(contrib.useruid);
                    const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Unknown User');
                    return {
                        ...contrib,
                        userName: userName,
                        userEmail: user?.email || ''
                    };
                } catch (err) {
                    console.error(`[ADMIN] Error enriching contribution ${contrib.id}:`, err.message);
                    return {
                        ...contrib,
                        userName: 'Unknown User',
                        userEmail: ''
                    };
                }
            })
        );

        console.log(`[ADMIN] Returning ${enrichedContributions.length} contributions`);
        res.json(enrichedContributions);
    } catch (error) {
        console.error('[ADMIN] Error fetching contributions:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Update project with approval comment
// @route   PUT /api/admin/projects/:id/approve
// @access  Admin
router.put('/projects/:id/approve', protect, admin, async (req, res) => {
    try {
        const { status, comment } = req.body;
        const projectId = req.params.id;

        if (!['approved', 'rejected', 'pending'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const project = await Project.findById(projectId);
        if (!project) {
            return res.status(404).json({ message: 'Project not found' });
        }

        console.log(`[ADMIN] Approving project ${projectId} with status: ${status}, current status: ${project.status}`);

        // Only update status - the other columns don't exist in the schema
        const updates = {
            status: status
        };

        const updatedProject = await Project.update(projectId, updates);
        
        // Update user stats to reflect approved/rejected projects count
        if (project.authorUid) {
            try {
                const user = await User.findById(project.authorUid);
                if (user) {
                    const userProjects = await Project.findByAuthor(project.authorUid);
                    const approvedCount = userProjects.filter(p => p.status === 'approved').length;
                    const rejectedCount = userProjects.filter(p => p.status === 'rejected').length;
                    const pendingCount = userProjects.filter(p => p.status === 'pending').length;
                    
                    const updatedStats = {
                        ...(user.stats || {}),
                        approvedProjects: approvedCount,
                        rejectedProjects: rejectedCount,
                        pendingProjects: pendingCount,
                        totalProjects: userProjects.length
                    };
                    
                    await User.update(project.authorUid, { stats: updatedStats });
                    console.log(`[ADMIN] Updated user ${project.authorUid} stats: ${approvedCount} approved, ${rejectedCount} rejected, ${pendingCount} pending`);
                }
            } catch (userError) {
                console.error('[ADMIN] Error updating user stats:', userError);
                // Don't fail the request if user stats update fails
            }
        }
        
        console.log(`[ADMIN] Project ${projectId} approved with status: ${status}`);
        res.json(updatedProject);
    } catch (error) {
        console.error('[ADMIN] Error approving project:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get all member activity (projects, contributions, feedback)
// @route   GET /api/admin/activity
// @access  Admin
router.get('/activity', protect, admin, async (req, res) => {
    try {
        const { data: projects } = await supabase
            .from('projects')
            .select('*')
            .order('createdat', { ascending: false });

        const { data: contributions } = await supabase
            .from('contributions')
            .select('*')
            .order('createdat', { ascending: false });

        const { data: feedbacks } = await supabase
            .from('feedback')
            .select('*')
            .order('createdat', { ascending: false });

        // Combine and sort all activities by date
        const activities = [
            ...(projects || []).map(p => ({ ...p, type: 'project', timestamp: p.createdat })),
            ...(contributions || []).map(c => ({ ...c, type: 'contribution', timestamp: c.createdat })),
            ...(feedbacks || []).map(f => ({ ...f, type: 'feedback', timestamp: f.createdat }))
        ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        // Enrich with user data
        const enrichedActivities = await Promise.all(
            activities.map(async (activity) => {
                try {
                    const uid = activity.authoruid || activity.useruid;
                    const user = await User.findById(uid);
                    const userName = user?.name || (user?.email ? user.email.split('@')[0] : 'Unknown');
                    return {
                        ...activity,
                        userName: userName,
                        userEmail: user?.email || ''
                    };
                } catch (err) {
                    return {
                        ...activity,
                        userName: 'Unknown',
                        userEmail: ''
                    };
                }
            })
        );

        console.log(`[ADMIN] Returning ${enrichedActivities.length} recent activities`);
        res.json(enrichedActivities);
    } catch (error) {
        console.error('[ADMIN] Error fetching activities:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete user (admin action)
// @route   DELETE /api/admin/users/:uid
// @access  Admin
router.delete('/users/:uid', protect, admin, async (req, res) => {
    try {
        const uid = req.params.uid;
        
        console.log(`[ADMIN] Deleting user ${uid}`);

        // Delete user's projects
        const { data: userProjects } = await supabase
            .from('projects')
            .select('id')
            .eq('authoruid', uid);

        if (userProjects && userProjects.length > 0) {
            await Promise.all(
                userProjects.map(p => Project.delete(p.id))
            );
            console.log(`[ADMIN] Deleted ${userProjects.length} projects for user ${uid}`);
        }

        // Delete user from Supabase
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('uid', uid);

        if (error) {
            throw error;
        }

        console.log(`[ADMIN] User ${uid} deleted successfully`);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('[ADMIN] Error deleting user:', error);
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get member summary (quick overview)
// @route   GET /api/admin/members
// @access  Admin
router.get('/members', protect, admin, async (req, res) => {
    try {
        const users = await User.getAll();

        // Enrich each user with activity counts
        const enrichedUsers = await Promise.all(
            users.map(async (user) => {
                try {
                    const projects = await Project.findByAuthor(user.uid);
                    const contributions = await Contribution.getByUserUid(user.uid);
                    const feedback = await Feedback.getByUserUid(user.uid);

                    return {
                        ...user,
                        projectCount: projects.length,
                        contributionCount: contributions.length,
                        feedbackCount: feedback.length,
                        totalActivity: projects.length + contributions.length + feedback.length
                    };
                } catch (err) {
                    return {
                        ...user,
                        projectCount: 0,
                        contributionCount: 0,
                        feedbackCount: 0,
                        totalActivity: 0
                    };
                }
            })
        );

        console.log(`[ADMIN] Returning ${enrichedUsers.length} members with activity counts`);
        res.json(enrichedUsers);
    } catch (error) {
        console.error('[ADMIN] Error fetching members:', error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
