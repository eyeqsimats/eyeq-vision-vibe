import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import api from '@/api/axios';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, CheckCircle, XCircle, LayoutDashboard, Users, MessageSquare, Edit, Signal, Megaphone, Activity, Trophy, Medal, Star, Send, Search, Code, ExternalLink, Linkedin } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ClickSpark from '@/components/ClickSpark';

const AdminDashboard = () => {
    const { user, logout } = useAuth();
    const { toast } = useToast();
    const navigate = useNavigate();
    const [stats, setStats] = useState<any>(null);
    const [users, setUsers] = useState([]);
    const [projects, setProjects] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [contributions, setContributions] = useState([]);
    const [activities, setActivities] = useState([]);
    const [memberDetails, setMemberDetails] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('overview');
    const [activeUsers, setActiveUsers] = useState([]);

    // Reply State
    const [replyingFeedback, setReplyingFeedback] = useState<any>(null);
    const [replyText, setReplyText] = useState('');

    // Achievement State
    const [awardingUser, setAwardingUser] = useState<any>(null);
    const [awardData, setAwardData] = useState({ title: '', description: '', type: 'badge', icon: 'trophy' });

    // Edit States
    const [editingUser, setEditingUser] = useState<any>(null);
    const [editingProject, setEditingProject] = useState<any>(null);
    const [announcementMsg, setAnnouncementMsg] = useState('');

    // Filter States
    const [filterStatus, setFilterStatus] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        if (user) {
            checkAdmin();
        }
    }, [user]);

    // Refresh data when window regains focus for instant updates
    useEffect(() => {
        const handleFocus = () => {
            if (profile?.role === 'admin') {
                console.log('[FOCUS] Refreshing data on window focus');
                fetchStats();
                fetchUsers();
                fetchProjects();
                fetchFeedback();
            }
        };
        
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [profile?.role]);

    // Auto-refresh data every 3 seconds for live updates
    useEffect(() => {
        if (profile?.role === 'admin') {
            const interval = setInterval(() => {
                fetchStats();
                fetchUsers();
                fetchProjects();
                fetchFeedback();
                fetchContributions();
                fetchActivities();
                console.log('[AUTO-REFRESH] Data refreshed at', new Date().toLocaleTimeString());
            }, 3000); // Refresh every 3 seconds for live updates
            
            return () => clearInterval(interval);
        }
    }, [profile?.role]);

    const checkAdmin = async () => {
        try {
            console.log('[ADMIN] Checking admin status for user:', user?.uid);
            const { data } = await api.get(`/users/profile/${user?.uid}`);
            console.log('[ADMIN] Profile data:', data);
            setProfile(data);
            if (data.role === 'admin') {
                // Load all data immediately
                console.log('[ADMIN] Role verified as ADMIN, loading all data...');
                await Promise.all([
                    fetchStats(),
                    fetchUsers(),
                    fetchProjects(),
                    fetchFeedback(),
                    fetchContributions(),
                    fetchActivities()
                ]);
                console.log('[ADMIN] Initial data load complete');
            } else {
                console.error('[ADMIN] User role is:', data.role, '- NOT ADMIN');
            }
        } catch (error) {
            console.error('[ADMIN] Failed to check admin:', error);
        }
    };

    const fetchStats = async () => { 
        try { 
            console.log('[FETCH] Fetching stats...');
            const { data } = await api.get('/admin/stats'); 
            console.log('[FETCH] Stats received:', data); 
            setStats(data); 
        } catch (e) { 
            console.error('[FETCH ERROR] Stats:', e.response?.data || e.message); 
        } 
    };
    const fetchUsers = async () => { 
        try { 
            console.log('[FETCH] Fetching users with activity counts...');
            const { data } = await api.get('/admin/members'); 
            console.log('[FETCH] Users received:', data?.length, 'items with activity counts'); 
            console.log('[FETCH] Sample user data:', data?.[0]);
            setUsers(data || []); 
        } catch (e) { 
            console.error('[FETCH ERROR] Users:', e.response?.data || e.message); 
        } 
    };
    const fetchProjects = async () => { 
        try { 
            console.log('[FETCH] Fetching projects...');
            const res = await api.get('/admin/projects'); 
            console.log('[FETCH] Projects received:', res.data?.length, 'items');
            const statusCounts = {
                pending: res.data?.filter((p: any) => p.status === 'pending').length || 0,
                approved: res.data?.filter((p: any) => p.status === 'approved').length || 0,
                rejected: res.data?.filter((p: any) => p.status === 'rejected').length || 0
            };
            console.log('[FETCH] Status breakdown:', statusCounts);
            console.log('[FETCH] Sample project data:', res.data?.[0]);
            console.log('[FETCH] All project statuses:', res.data?.map((p: any) => ({ id: p.id, status: p.status, title: p.title })));
            setProjects(res.data || []); 
        } catch (e) { 
            console.error('[FETCH ERROR] Projects:', e.response?.data || e.message); 
        } 
    };
    const fetchFeedback = async () => { 
        try { 
            console.log('[FETCH] Fetching feedback...');
            const { data } = await api.get('/admin/feedback'); 
            console.log('[FETCH] Feedback received:', data?.length, 'items');
            console.log('[FETCH] Queries found:', data?.filter((f: any) => f.type === 'query').length);
            console.log('[FETCH] General feedback found:', data?.filter((f: any) => f.type && f.type !== 'query').length);
            setFeedbacks(data || []); 
        } catch (e) { 
            console.error('[FETCH ERROR] Feedback:', e.response?.data || e.message); 
        } 
    };

    const fetchContributions = async () => {
        try {
            console.log('[FETCH] Fetching contributions...');
            const { data } = await api.get('/admin/contributions');
            console.log('[FETCH] Contributions received:', data?.length, 'items');
            setContributions(data || []);
        } catch (e) {
            console.error('[FETCH ERROR] Contributions:', e.response?.data || e.message);
        }
    };

    const fetchActivities = async () => {
        try {
            console.log('[FETCH] Fetching activities...');
            const { data } = await api.get('/admin/activity');
            console.log('[FETCH] Activities received:', data?.length, 'items');
            setActivities(data || []);
        } catch (e) {
            console.error('[FETCH ERROR] Activities:', e.response?.data || e.message);
        }
    };

    const fetchMemberDetails = async (uid: string) => {
        try {
            console.log('[FETCH] Fetching member details for:', uid);
            const { data } = await api.get(`/admin/members/${uid}`);
            console.log('[FETCH] Member details received:', data);
            setMemberDetails(data);
        } catch (e) {
            console.error('[FETCH ERROR] Member details:', e.response?.data || e.message);
        }
    };

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleApproveProject = async (id: string, status: string, comment: string = '') => {
        try {
            await api.put(`/admin/projects/${id}/approve`, { status, comment });
            toast({ title: `Project ${status}`, description: comment ? 'Comment added' : '' });
            fetchProjects();
        } catch (e) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleProjectStatus = async (id: string, status: string) => {
        try {
            console.log(`[ADMIN] Approving project ${id} with status: ${status}`);
            await handleApproveProject(id, status);
            
            // Small delay to ensure database is updated
            await new Promise(resolve => setTimeout(resolve, 500));
            
            // Refresh all data to update counts, badges, and stats
            console.log('[ADMIN] Refreshing all data after approval...');
            await Promise.all([
                fetchProjects(),  // Updates project badges
                fetchStats(),     // Updates total counts
                fetchUsers()      // Updates user project counts
            ]);
            
            toast({ 
                title: `Project ${status === 'approved' ? 'Approved ✓' : 'Rejected ✗'}`, 
                description: `Status and counts updated successfully.`,
                duration: 3000
            });
        } catch (error) {
            console.error('[ADMIN] Error updating project status:', error);
            toast({ 
                title: "Error", 
                description: "Failed to update project status", 
                variant: "destructive" 
            });
        }
    };

    const handleDeleteUser = async (uid: string) => {
        if (!confirm("Are you sure? This will delete the user and all their projects. This action cannot be undone.")) return;
        try {
            await api.delete(`/admin/users/${uid}`);
            toast({ title: "User Deleted" });
            fetchUsers();
        } catch (e) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleUpdateUser = async () => {
        if (!editingUser) return;
        try {
            // Update general user info
            await api.put(`/admin/users/${editingUser.uid || editingUser.id}`, {
                name: editingUser.name,
                bio: editingUser.bio,
                skills: editingUser.skills,
                currentStreak: editingUser.stats?.currentStreak,
                longestStreak: editingUser.stats?.longestStreak
            });

            // Update achievement count separately
            if (editingUser.achievementCount !== undefined) {
                await api.put(`/admin/users/${editingUser.uid || editingUser.id}/achievements`, {
                    achievementCount: editingUser.achievementCount
                });
            }

            toast({ title: "User Updated" });
            setEditingUser(null);
            fetchUsers();
        } catch (e) {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    const handleUpdateProject = async () => {
        if (!editingProject) return;
        try {
            await api.put(`/admin/projects/${editingProject.id}`, editingProject);
            toast({ title: "Project Updated" });
            setEditingProject(null);
            fetchProjects();
        } catch (e) {
            toast({ title: "Failed to update", variant: "destructive" });
        }
    };

    const handleReply = async () => {
        if (!replyingFeedback || !replyText) return;
        try {
            await api.put(`/feedback/${replyingFeedback.id || replyingFeedback._id}/reply`, { reply: replyText });
            toast({ title: "Reply Sent" });
            setReplyingFeedback(null);
            setReplyText('');
            fetchFeedback();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleToggleResolved = async (feedbackId: string, currentResolved: boolean) => {
        try {
            await api.put(`/feedback/${feedbackId}/resolve`, { resolved: !currentResolved });
            toast({ title: !currentResolved ? "Marked as Resolved" : "Marked as Unresolved" });
            fetchFeedback();
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    const handleDeleteFeedback = async (feedbackId: string) => {
        if (!confirm("Delete this feedback? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/feedback/${feedbackId}`);
            toast({ title: "Feedback deleted" });
            fetchFeedback();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete feedback", variant: "destructive" });
        }
    };

    const handleDeleteContribution = async (contributionId: string) => {
        if (!confirm("Delete this contribution log? This cannot be undone.")) return;
        try {
            await api.delete(`/admin/contributions/${contributionId}`);
            toast({ title: "Contribution deleted" });
            fetchContributions();
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete contribution", variant: "destructive" });
        }
    };

    const handleBroadcast = async () => {
        if (!announcementMsg) return;
        try {
            await api.post('/announcements', { message: announcementMsg });
            toast({ title: "Announcement Sent", description: "All users will see this message." });
            setAnnouncementMsg('');
        } catch (error) {
            toast({ title: "Error", description: "Failed to send announcement", variant: "destructive" });
        }
    };

    const handleGiveAward = async () => {
        if (!awardingUser || !awardData.title) return;
        try {
            await api.post('/achievements', {
                targetUserId: awardingUser.uid || awardingUser.id,
                ...awardData
            });
            toast({ title: "Award Given", description: `${awardData.title} awarded to ${awardingUser.name}` });
            setAwardingUser(null);
            setAwardData({ title: '', description: '', type: 'badge', icon: 'trophy' });
        } catch (error) {
            toast({ title: "Error", variant: "destructive" });
        }
    };

    if (user && profile?.role !== 'admin' && profile !== null) return <div className="p-10 text-center text-destructive font-bold text-2xl">Access Denied: Admin Only Area</div>;

    const filteredProjects = projects.filter((p: any) => filterStatus === 'all' || p.status === filterStatus);
    const queries = feedbacks.filter((f: any) => f.type === 'query');
    const generalFeedback = feedbacks.filter((f: any) => f.type && f.type !== 'query');

    return (
        <ClickSpark sparkRadius={105}>
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-slate-100 p-8 space-y-8 font-sans relative overflow-hidden">
            {/* Glassmorphism Background Gradient */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-violet-500/5 rounded-full blur-3xl"></div>
            </div>
            <div className="relative z-10">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="neo-surface-3d flex flex-col md:flex-row justify-between items-start md:items-center bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 shadow-2xl hover:shadow-3xl hover:bg-white/15 transition-all duration-300"
            >
                <div>
                    <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-lg">
                        ADMIN EYEQ
                    </h1>
                    <p className="text-slate-300 mt-2 flex items-center gap-2 text-sm transition-colors">
                        <Signal className="w-5 h-5 text-violet-400 animate-pulse" /> 
                        <span className="flex items-center gap-2">
                            Live Updates
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                            </span>
                        </span>
                    </p>
                    <p className="text-slate-400 mt-1 text-xs">
                        Users: {users.length} | Projects: {projects.length} | Feedback: {feedbacks.length}
                    </p>
                </div>
                <div className="flex items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right hidden md:block">
                        <p className="font-semibold text-sm text-slate-200">{profile?.name || 'Administrator'}</p>
                        <Badge className="text-xs border border-purple-300/50 text-purple-200 bg-purple-400/20">Admin</Badge>
                    </div>
                    <Button 
                        onClick={() => { fetchStats(); fetchUsers(); fetchProjects(); fetchFeedback(); }}
                        className="neo-button-3d gap-2 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/50 font-semibold text-slate-100 hover:text-white transition-all"
                        title="Manual refresh (auto-refreshes every 3 seconds)"
                    >
                        🔄 Refresh Now
                    </Button>
                    <Button onClick={handleLogout} className="neo-button-3d gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-300/50 font-semibold text-slate-100 hover:text-white transition-all">Exit</Button>
                </div>
            </motion.div>
            </div>

            {/* Stats Overview */}
            {stats && (
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-4 gap-4">
                    {[
                        { 
                            title: "Total Members", 
                            value: stats.totalMembers, 
                            icon: Users, 
                            color: "text-blue-300", 
                            bg: "bg-gradient-to-br from-blue-500/20 via-blue-600/10 to-cyan-500/20",
                            borderGlow: "border-blue-400/30 hover:border-blue-400/60",
                            onClick: () => setActiveTab('users')
                        },
                        { 
                            title: "Total Projects", 
                            value: stats.totalProjects, 
                            icon: LayoutDashboard, 
                            color: "text-purple-300", 
                            bg: "bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-pink-500/20",
                            borderGlow: "border-purple-400/30 hover:border-purple-400/60",
                            onClick: () => setActiveTab('projects')
                        },
                        { 
                            title: "Active Today", 
                            value: stats.dailyActiveUsers || 0, 
                            icon: Activity, 
                            color: "text-emerald-300", 
                            bg: "bg-gradient-to-br from-emerald-500/20 via-green-600/10 to-teal-500/20",
                            borderGlow: "border-emerald-400/30 hover:border-emerald-400/60",
                            onClick: () => {
                                const active = getActiveUsersToday();
                                setActiveUsers(active);
                                setActiveTab('users');
                            }
                        },
                        { 
                            title: "Pending Review", 
                            value: projects.filter((p: any) => p.status === 'pending').length, 
                            icon: CheckCircle, 
                            color: "text-amber-300", 
                            bg: "bg-gradient-to-br from-amber-500/20 via-orange-600/10 to-yellow-500/20",
                            borderGlow: "border-amber-400/30 hover:border-amber-400/60",
                            onClick: () => setActiveTab('projects')
                        },
                    ].map((stat, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="cursor-pointer"
                            onClick={stat.onClick}
                        >
                            <Card className={`neo-surface-3d card-rainbow-active ${stat.bg} backdrop-blur-md border ${stat.borderGlow} shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300`}>
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-semibold text-slate-300">{stat.title}</CardTitle>
                                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className={`text-4xl font-bold ${stat.color}`}>{stat.value}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 relative z-10">
                <TabsList className="neo-surface-3d neo-tab-3d bg-white/10 p-1 h-auto overflow-x-auto border border-white/20 w-full justify-start rounded-xl backdrop-blur-md shadow-lg">
                    <TabsTrigger value="overview" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-sky-500/40 data-[state=active]:to-blue-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-sky-300 transition-all rounded-lg">Overview</TabsTrigger>
                    <TabsTrigger value="activity" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-500/40 data-[state=active]:to-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-violet-300 transition-all rounded-lg">Activity Feed</TabsTrigger>
                    <TabsTrigger value="members" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-500/40 data-[state=active]:to-blue-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-cyan-300 transition-all rounded-lg">Members</TabsTrigger>
                    <TabsTrigger value="queries" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-fuchsia-500/40 data-[state=active]:to-pink-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-fuchsia-300 transition-all rounded-lg">Member Queries</TabsTrigger>
                    <TabsTrigger value="users" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-500/40 data-[state=active]:to-purple-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-indigo-300 transition-all rounded-lg">Users</TabsTrigger>
                    <TabsTrigger value="projects" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500/40 data-[state=active]:to-pink-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-rose-300 transition-all rounded-lg">Projects</TabsTrigger>
                    <TabsTrigger value="contributions" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500/40 data-[state=active]:to-green-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-emerald-300 transition-all rounded-lg">Contributions</TabsTrigger>
                    <TabsTrigger value="feedback" className="px-6 py-2 font-medium tracking-wider data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500/40 data-[state=active]:to-orange-500/40 data-[state=active]:text-white data-[state=active]:shadow-lg text-slate-300 hover:text-amber-300 transition-all rounded-lg">Feedback</TabsTrigger>
                </TabsList>

                {/* Overview Tab */}
                <TabsContent value="overview" className="space-y-4 relative p-6 rounded-2xl bg-gradient-to-br from-sky-500/20 via-blue-500/15 to-indigo-500/20 border border-sky-400/40">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="neo-surface-3d bg-gradient-to-br from-sky-500/30 via-blue-500/20 to-indigo-500/30 backdrop-blur-md border border-sky-400/50 hover:border-sky-400/70 shadow-lg hover:shadow-xl transition-all">
                            <CardHeader><CardTitle className="flex items-center gap-2 text-slate-100 font-semibold tracking-wider"><Megaphone className="w-5 h-5 text-blue-300" /> Make Announcement</CardTitle></CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300 font-medium">Message</Label>
                                    <Input
                                        placeholder="Enter global announcement..."
                                        value={announcementMsg}
                                        onChange={e => setAnnouncementMsg(e.target.value)}
                                        className="bg-white/10 border border-white/20 text-slate-100 placeholder:text-slate-400 focus:border-white/40 focus:shadow-lg focus:bg-white/15 transition-all rounded"
                                    />
                                </div>
                                <Button onClick={handleBroadcast} className="neo-button-3d w-full bg-blue-500/20 hover:bg-blue-500/30 border border-blue-300/50 text-blue-100 font-semibold tracking-wider shadow-lg hover:shadow-xl transition-all">📢 Broadcast to All Users</Button>
                            </CardContent>
                        </Card>

                        {/* System Status card removed per request */}
                    </div>
                </TabsContent>

                {/* Activity Feed Tab */}
                <TabsContent value="activity" className="relative p-6 rounded-2xl bg-gradient-to-br from-violet-500/20 via-purple-500/15 to-fuchsia-500/20 border border-violet-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-violet-500/30 via-purple-500/20 to-fuchsia-500/30 backdrop-blur-md border border-violet-400/50 hover:border-violet-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader><CardTitle className="text-slate-100 flex items-center gap-2 font-semibold tracking-wider"><Activity className="w-5 h-5 text-violet-300" /> Live Activity Feed</CardTitle><CardDescription className="text-slate-400">Recent member activities - projects, contributions, and feedback</CardDescription></CardHeader>
                        <CardContent>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto">
                                {activities.length > 0 ? activities.slice(0, 50).map((activity: any, i: number) => (
                                    <div key={i} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-all text-sm">
                                        <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${activity.type === 'project' ? 'bg-blue-400' : activity.type === 'contribution' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-medium text-slate-100">{activity.userName || 'Unknown'}</div>
                                            <div className="text-slate-400 text-xs">
                                                {activity.type === 'project' ? `Submitted project: ${activity.title}` : activity.type === 'contribution' ? `Logged contribution: ${activity.description?.substring(0, 50)}...` : `Sent ${activity.type}: ${activity.message?.substring(0, 40)}...`}
                                            </div>
                                            <div className="text-slate-500 text-xs mt-1">{new Date(activity.timestamp).toLocaleString()}</div>
                                        </div>
                                        <Badge className={`text-xs flex-shrink-0 ${activity.type === 'project' ? 'bg-blue-500/20 text-blue-300 border-blue-400/50' : activity.type === 'contribution' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50' : 'bg-amber-500/20 text-amber-300 border-amber-400/50'}`}>{activity.type}</Badge>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-slate-500">
                                        <Activity className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        No activity yet
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Members Tab */}
                <TabsContent value="members" className="relative p-6 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-blue-500/15 to-indigo-500/20 border border-cyan-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-cyan-500/30 via-blue-500/20 to-indigo-500/30 backdrop-blur-md border border-cyan-400/50 hover:border-cyan-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                            <CardTitle className="text-slate-100 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-300" /> Member Overview
                            </CardTitle>
                            <CardDescription className="text-slate-400">Quick view of all members with activity counts</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <Input
                                    placeholder="Search members by name or email..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="bg-white/10 border border-white/20 text-slate-100 placeholder:text-slate-400"
                                />
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="text-slate-300">Member</TableHead>
                                        <TableHead className="text-slate-300">Email</TableHead>
                                        <TableHead className="text-slate-300">Projects</TableHead>
                                        <TableHead className="text-slate-300">Contributions</TableHead>
                                        <TableHead className="text-slate-300">Feedback</TableHead>
                                        <TableHead className="text-slate-300">Total Activity</TableHead>
                                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.filter((u: any) => 
                                        !searchQuery || u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || u.email?.toLowerCase().includes(searchQuery.toLowerCase())
                                    ).map((u: any) => (
                                        <TableRow key={u.uid || u.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {u.photoURL && <img src={u.photoURL} alt={u.name} className="w-6 h-6 rounded-full object-cover" />}
                                                    <span className="font-semibold text-slate-100 text-sm">{u.name || 'Unknown'}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-slate-400 text-sm">{u.email}</TableCell>
                                            <TableCell className="font-mono text-slate-300">{u.projectCount || 0}</TableCell>
                                            <TableCell className="font-mono text-slate-300">{u.contributionCount || 0}</TableCell>
                                            <TableCell className="font-mono text-slate-300">{u.feedbackCount || 0}</TableCell>
                                            <TableCell className="font-bold text-slate-100">{u.totalActivity || 0}</TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost" className="text-blue-400 hover:bg-blue-500/10 text-xs" onClick={() => fetchMemberDetails(u.uid || u.id)}>View</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={7} className="text-center py-10 text-slate-400">
                                                No members found
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Member Details Modal */}
                    {memberDetails && (
                        <Card className="neo-surface-3d bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mt-6">
                            <CardHeader className="flex flex-row justify-between items-start">
                                <div>
                                    <CardTitle className="text-slate-100 flex items-center gap-2">
                                        {memberDetails.photoURL && <img src={memberDetails.photoURL} alt={memberDetails.name} className="w-8 h-8 rounded-full object-cover" />}
                                        {memberDetails.name} - Detailed View
                                    </CardTitle>
                                </div>
                                <Button size="sm" variant="ghost" onClick={() => setMemberDetails(null)} className="text-slate-400 hover:text-slate-100">Close</Button>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-slate-400 mb-1">Email</div>
                                        <div className="text-sm font-semibold text-slate-100">{memberDetails.email}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-slate-400 mb-1">Projects</div>
                                        <div className="text-2xl font-bold text-blue-400">{memberDetails.projectCount || 0}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-slate-400 mb-1">Contributions</div>
                                        <div className="text-2xl font-bold text-emerald-400">{memberDetails.contributionCount || 0}</div>
                                    </div>
                                    <div className="p-3 bg-white/5 rounded-lg border border-white/10">
                                        <div className="text-xs text-slate-400 mb-1">Feedback</div>
                                        <div className="text-2xl font-bold text-amber-400">{memberDetails.feedbackCount || 0}</div>
                                    </div>
                                </div>
                                {memberDetails.projects?.length > 0 && (
                                    <div>
                                        <h4 className="text-slate-100 font-semibold mb-2">Recent Projects</h4>
                                        <div className="space-y-2">
                                            {memberDetails.projects.map((p: any) => (
                                                <div key={p.id} className="p-2 bg-white/5 rounded border border-white/10 text-sm">
                                                    <div className="font-semibold text-slate-100">{p.title}</div>
                                                    <div className="text-xs text-slate-400">{new Date(p.createdat).toLocaleDateString()}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}
                </TabsContent>

                {/* Queries Tab (Replaces Analytics) */}
                <TabsContent value="queries" className="relative p-6 rounded-2xl bg-gradient-to-br from-fuchsia-500/20 via-pink-500/15 to-purple-500/20 border border-fuchsia-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-fuchsia-500/30 via-pink-500/20 to-purple-500/30 backdrop-blur-md border border-fuchsia-400/50 hover:border-fuchsia-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle className="text-slate-100 flex items-center gap-2 font-semibold tracking-wider">
                                        <MessageSquare className="w-5 h-5 text-purple-300" /> Member Queries
                                        <Badge className="ml-2 bg-purple-500/20 text-purple-300 border-purple-400/50">{queries.length} Total</Badge>
                                    </CardTitle>
                                    <CardDescription className="text-slate-400">Answer questions from members.</CardDescription>
                                </div>
                                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-pulse">
                                    <Signal className="w-3 h-3 mr-1" /> LIVE
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {queries.length > 0 ? queries.map((q: any) => (
                                    <div key={q.id || q._id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2 hover:bg-white/10 hover:border-white/20 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="text-xs text-slate-400 font-mono">{new Date(q.createdat || q.createdAt).toLocaleDateString()}</span>
                                                    {q.resolved ? <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 font-medium">✓ RESPONDED</Badge> : <Badge className="bg-amber-500/20 text-amber-300 border border-amber-400/50 font-medium">⏳ PENDING</Badge>}
                                                </div>
                                                <div className="font-semibold text-slate-100">{q.userName || 'Unknown User'} <span className="text-xs font-normal text-slate-400">({q.userEmail || 'No email'})</span></div>
                                                <p className="text-sm mt-2 font-medium text-slate-200 bg-white/5 p-3 rounded-md border border-white/10">{q.message}</p>
                                                {q.rating && (
                                                    <div className="mt-2 flex items-center gap-1 text-sm text-amber-400 font-medium">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span>{q.rating}/5</span>
                                                    </div>
                                                )}
                                                {q.reply && (
                                                    <div className="mt-2 pl-4 border-l-2 border-blue-300/50 text-sm text-slate-300">
                                                        <span className="font-semibold text-blue-300 text-xs block mb-1">Your Reply:</span>
                                                        {q.reply}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 ml-4 items-center">
                                                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                                    <input
                                                        type="checkbox"
                                                        checked={q.resolved || false}
                                                        onChange={() => handleToggleResolved(q.id || q._id, q.resolved)}
                                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500/50"
                                                    />
                                                    <span className="text-xs text-slate-400">Resolved</span>
                                                </label>
                                                {!q.resolved && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" onClick={() => setReplyingFeedback(q)} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Reply</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-white/10 backdrop-blur-md text-slate-100 border border-white/20">
                                                            <DialogHeader><DialogTitle className="text-slate-100">Reply to {q.userName}</DialogTitle></DialogHeader>
                                                            <div className="py-4">
                                                                <p className="text-sm text-slate-400 mb-2 italic">"{q.message}"</p>
                                                                <textarea
                                                                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300/50"
                                                                    rows={4}
                                                                    placeholder="Type your answer here..."
                                                                    value={replyText}
                                                                    onChange={e => setReplyText(e.target.value)}
                                                                />
                                                            </div>
                                                            <DialogFooter><Button onClick={handleReply} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Send Response</Button></DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                                <Button size="sm" variant="destructive" className="neo-button-3d text-red-100 bg-red-500/30 hover:bg-red-500/40 border border-red-300/50" onClick={() => handleDeleteFeedback(q.id || q._id)}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-center py-10 text-zinc-500">
                                        <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                        No pending queries found.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Users Tab */}
                <TabsContent value="users" className="relative p-6 rounded-2xl bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/20 border border-indigo-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-pink-500/30 backdrop-blur-md border border-indigo-400/50 hover:border-indigo-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <div>
                                    <CardTitle className="text-slate-100 font-semibold tracking-wider">User Directory</CardTitle>
                                    <CardDescription className="text-slate-400">Manage user access and adjust stats manually.</CardDescription>
                                </div>
                                {activeUsers.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-400/50">
                                            <Activity className="w-3 h-3 mr-1" />
                                            Showing {activeUsers.length} Active Today
                                        </Badge>
                                        <Button size="sm" variant="ghost" onClick={() => setActiveUsers([])} className="text-slate-400 hover:text-slate-100">
                                            Show All
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="text-slate-300">User Details</TableHead>
                                        <TableHead className="text-slate-300">Role</TableHead>
                                        <TableHead className="text-slate-300">Streak (Cur/Best)</TableHead>
                                        <TableHead className="text-slate-300">Achievements</TableHead>
                                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {(activeUsers.length > 0 ? activeUsers : users).map((u: any) => (
                                        <TableRow key={u.uid || u.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell>
                                                <div className="font-semibold text-slate-100">{u.name}</div>
                                                <div className="text-xs text-slate-400">{u.email}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className="border-white/20 text-slate-300 bg-white/10">{u.role}</Badge></TableCell>
                                            <TableCell className="font-mono text-sm text-slate-300">{u.stats?.currentStreak || 0} / {u.stats?.longestStreak || 0}</TableCell>
                                            <TableCell className="text-sm text-slate-300">{u.achievementCount || 0} <Trophy className="w-4 h-4 text-amber-400 inline-block ml-1" /></TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="border-white/20 bg-white/10 text-slate-300 hover:bg-white/20" onClick={() => setEditingUser(u)}><Edit className="w-3 h-3 mr-1" /> Edit</Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[425px] bg-white/10 backdrop-blur-md text-slate-100 border border-white/20">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-slate-100">Edit User Profile</DialogTitle>
                                                            <DialogDescription className="text-slate-400">Make changes to user profile and stats here.</DialogDescription>
                                                        </DialogHeader>
                                                        {editingUser && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">Full Name</Label>
                                                                    <Input value={editingUser.name} onChange={e => setEditingUser({ ...editingUser, name: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100 placeholder:text-slate-400" />
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-4">
                                                                    <div className="space-y-2">
                                                                        <Label className="text-slate-300">Current Streak</Label>
                                                                        <Input type="number" value={editingUser.stats?.currentStreak || 0} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, currentStreak: e.target.value } })} className="bg-white/10 border border-white/20 text-slate-100" />
                                                                    </div>
                                                                    <div className="space-y-2">
                                                                        <Label className="text-slate-300">Longest Streak</Label>
                                                                        <Input type="number" value={editingUser.stats?.longestStreak || 0} onChange={e => setEditingUser({ ...editingUser, stats: { ...editingUser.stats, longestStreak: e.target.value } })} className="bg-white/10 border border-white/20 text-slate-100" />
                                                                    </div>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">Achievement Count</Label>
                                                                    <Input type="number" min="0" value={editingUser.achievementCount || 0} onChange={e => setEditingUser({ ...editingUser, achievementCount: parseInt(e.target.value) })} className="bg-white/10 border border-white/20 text-slate-100" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-slate-300">Skills (comma separated)</Label>
                                                                    <Input value={editingUser.skills ? (Array.isArray(editingUser.skills) ? editingUser.skills.join(', ') : editingUser.skills) : ''} onChange={e => setEditingUser({ ...editingUser, skills: e.target.value.split(',') })} className="bg-white/10 border border-white/20 text-slate-100" />
                                                                </div>
                                                            </div>
                                                        )}
                                                        <DialogFooter>
                                                            <Button onClick={handleUpdateUser} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Save changes</Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="sm" variant="outline" className="text-amber-400 border-amber-400/20 bg-amber-400/5 hover:bg-amber-400/10" onClick={() => setAwardingUser(u)}>
                                                            <Trophy className="w-3 h-3 mr-1" /> Award
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-zinc-900 text-zinc-100 border-zinc-800">
                                                        <DialogHeader><DialogTitle>Award Achievement to {u.name}</DialogTitle></DialogHeader>
                                                        <div className="grid gap-4 py-4">
                                                            <div className="space-y-2"><Label className="text-zinc-400">Title</Label><Input placeholder="e.g. Hackathon Winner" value={awardData.title} onChange={e => setAwardData({ ...awardData, title: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                            <div className="space-y-2"><Label className="text-zinc-400">Description</Label><Input placeholder="Reason for award..." value={awardData.description} onChange={e => setAwardData({ ...awardData, description: e.target.value })} className="bg-zinc-950 border-zinc-800 text-zinc-100" /></div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Type</Label>
                                                                    <select className="w-full p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100" value={awardData.type} onChange={e => setAwardData({ ...awardData, type: e.target.value })}>
                                                                        <option value="badge">Badge</option>
                                                                        <option value="certificate">Certificate</option>
                                                                        <option value="medal">Medal</option>
                                                                    </select>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <Label className="text-zinc-400">Icon</Label>
                                                                    <select className="w-full p-2 rounded-md bg-zinc-950 border border-zinc-800 text-zinc-100" value={awardData.icon} onChange={e => setAwardData({ ...awardData, icon: e.target.value })}>
                                                                        <option value="trophy">Trophy 🏆</option>
                                                                        <option value="star">Star ⭐</option>
                                                                        <option value="medal">Medal 🥇</option>
                                                                        <option value="ribbon">Ribbon 🎗️</option>
                                                                    </select>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <DialogFooter><Button onClick={handleGiveAward} className="neo-button-3d bg-yellow-600 hover:bg-yellow-700">Award Achievement</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button size="sm" variant="destructive" onClick={() => handleDeleteUser(u.uid || u.id)} className="bg-red-900/20 hover:bg-red-900/40 text-red-500 border border-red-900/50"><Trash2 className="w-3 h-3" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-10">
                                                <Users className="w-12 h-12 mx-auto mb-3 text-slate-500 opacity-30" />
                                                <div className="text-slate-400 font-medium">No users found</div>
                                                <div className="text-slate-500 text-sm mt-2">Users will appear here after they log in for the first time</div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Projects Tab */}
                <TabsContent value="projects" className="relative p-6 rounded-2xl bg-gradient-to-br from-rose-500/20 via-pink-500/15 to-red-500/20 border border-rose-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-rose-500/30 via-pink-500/20 to-red-500/30 backdrop-blur-md border border-rose-400/50 hover:border-rose-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-slate-100">Project Master List</CardTitle>
                            <div className="flex bg-white/10 p-1 rounded-lg border border-white/20">
                                {['all', 'pending', 'approved', 'rejected'].map(s => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${filterStatus === s ? 'bg-white/20 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
                                    >
                                        {s.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow className="border-white/10 hover:bg-white/5">
                                        <TableHead className="text-slate-300">Author</TableHead>
                                        <TableHead className="text-slate-300">Project Details</TableHead>
                                        <TableHead className="text-slate-300">Links</TableHead>
                                        <TableHead className="text-slate-300">Status</TableHead>
                                        <TableHead className="text-right text-slate-300">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredProjects.map((p: any) => (
                                        <TableRow key={p.id} className="border-white/10 hover:bg-white/5">
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {p.authorPhoto && <img src={p.authorPhoto} alt={p.authorName} className="w-8 h-8 rounded-full object-cover" />}
                                                    <div>
                                                        <div className="font-semibold text-slate-100 text-sm">{p.authorName || 'Unknown'}</div>
                                                        <div className="text-xs text-slate-400">{p.authorEmail || 'No email'}</div>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="font-semibold text-slate-100">{p.title}</div>
                                                <div className="text-xs text-slate-400 line-clamp-2 max-w-md">{p.description}</div>
                                                <div className="text-xs text-slate-500 mt-1">{p.createdAt ? new Date(p.createdAt || p.createdat).toLocaleDateString() : ''}</div>
                                            </TableCell>
                                            <TableCell className="text-xs space-y-1">
                                                {p.repoLink && <a href={p.repoLink} className="flex items-center gap-1 text-blue-300 hover:underline" target="_blank"><Code className="w-3 h-3" />Repo</a>}
                                                {p.demoLink && <a href={p.demoLink} className="flex items-center gap-1 text-violet-300 hover:underline" target="_blank"><ExternalLink className="w-3 h-3" />Demo</a>}
                                                {p.linkedInPostLink && <a href={p.linkedInPostLink} className="flex items-center gap-1 text-blue-400 hover:underline" target="_blank"><Linkedin className="w-3 h-3" />LinkedIn</a>}
                                            </TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={p.status === 'approved' ? 'default' : p.status === 'rejected' ? 'destructive' : 'secondary'}
                                                    className={`${p.status === 'pending' ? 'bg-amber-500/20 text-amber-400 border-amber-400/50' : ''} ${p.status === 'approved' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-400/50' : ''} ${p.status === 'rejected' ? 'bg-red-500/20 text-red-400 border-red-400/50' : ''}`}
                                                >
                                                    {p.status?.toUpperCase()}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button size="icon" variant="ghost" onClick={() => setEditingProject(p)} className="text-slate-400 hover:text-slate-100 hover:bg-white/10"><Edit className="w-4 h-4" /></Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="sm:max-w-[500px] bg-white/10 backdrop-blur-md text-slate-100 border border-white/20 max-h-[90vh] overflow-y-auto">
                                                        <DialogHeader>
                                                            <DialogTitle className="text-slate-100">Edit Project</DialogTitle>
                                                            <DialogDescription className="text-slate-400">By {p.authorName}</DialogDescription>
                                                        </DialogHeader>
                                                        {editingProject && (
                                                            <div className="grid gap-4 py-4">
                                                                <div className="space-y-2"><Label className="text-slate-300">Title</Label><Input value={editingProject.title} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100" /></div>
                                                                <div className="space-y-2"><Label className="text-slate-300">Description</Label><Input value={editingProject.description} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100" /></div>
                                                                <div className="space-y-2"><Label className="text-slate-300">Repository Link</Label><Input value={editingProject.repoLink || ''} onChange={e => setEditingProject({ ...editingProject, repoLink: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100" /></div>
                                                                <div className="space-y-2"><Label className="text-slate-300">Demo Link</Label><Input value={editingProject.demoLink || ''} onChange={e => setEditingProject({ ...editingProject, demoLink: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100" /></div>
                                                                <div className="space-y-2"><Label className="text-slate-300">LinkedIn Post</Label><Input value={editingProject.linkedInPostLink || ''} onChange={e => setEditingProject({ ...editingProject, linkedInPostLink: e.target.value })} className="bg-white/10 border border-white/20 text-slate-100" /></div>
                                                            </div>
                                                        )}
                                                        <DialogFooter><Button onClick={handleUpdateProject} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Save Project</Button></DialogFooter>
                                                    </DialogContent>
                                                </Dialog>

                                                <Button size="icon" variant="ghost" className="neo-button-3d text-emerald-400 hover:bg-emerald-500/10" onClick={() => handleProjectStatus(p.id, 'approved')}><CheckCircle className="w-4 h-4" /></Button>
                                                <Button size="icon" variant="ghost" className="neo-button-3d text-red-400 hover:bg-red-500/10" onClick={() => handleProjectStatus(p.id, 'rejected')}><XCircle className="w-4 h-4" /></Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {filteredProjects.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-slate-400">No projects matching filter.</TableCell></TableRow>}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Feedback Tab (General) */}
                <TabsContent value="feedback" className="relative p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 via-yellow-500/15 to-orange-500/20 border border-amber-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-amber-500/30 via-yellow-500/20 to-orange-500/30 backdrop-blur-md border border-amber-400/50 hover:border-amber-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader><CardTitle className="text-slate-100">User Feedback</CardTitle></CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {generalFeedback.map((f: any) => (
                                    <div key={f.id || f._id} className="p-4 rounded-lg bg-white/5 border border-white/10 flex flex-col gap-2 hover:bg-white/10 transition-all">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Badge variant={f.type === 'bug' ? 'destructive' : f.type === 'query' ? 'outline' : 'default'} className={f.type === 'query' ? 'border-slate-400 text-slate-300' : 'border-white/20 text-slate-300'}>
                                                        {f.type.toUpperCase()}
                                                    </Badge>
                                                    <span className="text-xs text-slate-400">{new Date(f.createdat || f.createdAt).toLocaleDateString()}</span>
                                                    {f.resolved && <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-300 ml-2 border-emerald-400/50">Resolved</Badge>}
                                                </div>
                                                <div className="font-semibold text-slate-100">{f.userName || 'Unknown User'} <span className="text-xs font-normal text-slate-400">({f.userEmail || 'No email'})</span></div>
                                                <p className="text-sm mt-1 font-medium text-slate-300">{f.message}</p>
                                                {f.rating && (
                                                    <div className="mt-2 flex items-center gap-1 text-sm text-amber-400">
                                                        <Star className="w-4 h-4 fill-current" />
                                                        <span className="font-semibold">{f.rating}/5</span>
                                                    </div>
                                                )}
                                                {f.reply && (
                                                    <div className="mt-2 pl-4 border-l-2 border-blue-300/50 text-sm text-slate-300">
                                                        <span className="font-semibold text-blue-300 text-xs block mb-1">Reply:</span>
                                                        {f.reply}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2 items-center">
                                                <label className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                                                    <input
                                                        type="checkbox"
                                                        checked={f.resolved || false}
                                                        onChange={() => handleToggleResolved(f.id || f._id, f.resolved)}
                                                        className="w-4 h-4 rounded border-white/20 bg-white/10 text-emerald-500 focus:ring-emerald-500/50"
                                                    />
                                                    <span className="text-xs text-slate-400">Resolved</span>
                                                </label>
                                                {!f.resolved && (
                                                    <Dialog>
                                                        <DialogTrigger asChild>
                                                            <Button size="sm" onClick={() => setReplyingFeedback(f)} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Reply</Button>
                                                        </DialogTrigger>
                                                        <DialogContent className="bg-white/10 backdrop-blur-md text-slate-100 border border-white/20">
                                                            <DialogHeader><DialogTitle className="text-slate-100">Reply to {f.userName}</DialogTitle></DialogHeader>
                                                            <div className="py-4">
                                                                <p className="text-sm text-slate-400 mb-2">"{f.message}"</p>
                                                                <textarea
                                                                    className="w-full p-2 border rounded-md bg-white/10 border-white/20 text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-300/50"
                                                                    rows={4}
                                                                    placeholder="Type your reply..."
                                                                    value={replyText}
                                                                    onChange={e => setReplyText(e.target.value)}
                                                                />
                                                            </div>
                                                            <DialogFooter><Button onClick={handleReply} className="neo-button-3d bg-blue-500/30 hover:bg-blue-500/40 text-blue-100 border border-blue-300/50">Send Reply</Button></DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                )}
                                                <Button size="sm" variant="destructive" className="neo-button-3d text-red-100 bg-red-500/30 hover:bg-red-500/40 border border-red-300/50" onClick={() => handleDeleteFeedback(f.id || f._id)}>Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Contributions Tab */}
                <TabsContent value="contributions" className="relative p-6 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-green-500/15 to-teal-500/20 border border-emerald-400/40">
                    <Card className="neo-surface-3d bg-gradient-to-br from-emerald-500/30 via-green-500/20 to-teal-500/30 backdrop-blur-md border border-emerald-400/50 hover:border-emerald-400/70 shadow-lg hover:shadow-xl transition-all">
                        <CardHeader><CardTitle className="text-slate-100 flex items-center gap-2 font-semibold tracking-wider"><Medal className="w-5 h-5 text-emerald-300" /> Member Contributions</CardTitle><CardDescription className="text-slate-400">Track daily contributions and streak activity from members</CardDescription></CardHeader>
                        <CardContent>
                            {contributions.length > 0 ? (
                                <div className="space-y-3">
                                    {contributions.map((contrib: any) => (
                                        <div key={contrib.id} className="p-3 rounded-lg bg-white/5 border border-white/10 flex items-start gap-3 hover:bg-white/10 transition-all">
                                            <div className="w-2 h-2 rounded-full mt-1.5 bg-emerald-400"></div>
                                            <div className="flex-1">
                                                <div className="font-semibold text-slate-100">{contrib.userName || 'Unknown'}</div>
                                                <div className="text-sm text-slate-300 mt-1">{contrib.description}</div>
                                                <div className="text-xs text-slate-500 mt-1">{new Date(contrib.createdat).toLocaleString()}</div>
                                            </div>
                                            <Button size="sm" variant="destructive" className="neo-button-3d text-red-100 bg-red-500/30 hover:bg-red-500/40 border border-red-300/50" onClick={() => handleDeleteContribution(contrib.id || contrib._id)}>Delete</Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-10 text-slate-500">
                                    <Medal className="w-10 h-10 mx-auto mb-2 opacity-20" />
                                    No contributions logged yet
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs >
        </div >
        </ClickSpark>
    );
};

export default AdminDashboard;
