import React, { useEffect, useState } from 'react';
import { fetchProjects, approveProject, rejectProject } from '../../services/projectService';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        const loadProjects = async () => {
            const fetchedProjects = await fetchProjects();
            setProjects(fetchedProjects);
        };

        loadProjects();
    }, []);

    const handleApprove = async (projectId) => {
        await approveProject(projectId);
        setProjects(projects.map(project => 
            project.id === projectId ? { ...project, status: 'approved' } : project
        ));
    };

    const handleReject = async (projectId) => {
        await rejectProject(projectId);
        setProjects(projects.map(project => 
            project.id === projectId ? { ...project, status: 'rejected' } : project
        ));
    };

    return (
        <div className="admin-dashboard">
            <h1>Admin Dashboard</h1>
            <table>
                <thead>
                    <tr>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map(project => (
                        <tr key={project.id}>
                            <td>{project.name}</td>
                            <td>{project.status}</td>
                            <td>
                                <button onClick={() => handleApprove(project.id)}>✓ Approve</button>
                                <button onClick={() => handleReject(project.id)}>✗ Reject</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;