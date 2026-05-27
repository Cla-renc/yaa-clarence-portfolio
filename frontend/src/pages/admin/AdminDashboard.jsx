import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ projects: 0, posts: 0, messages: 0, books: 0 });
    const [latestMessage, setLatestMessage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const [projectsRes, postsRes, booksRes, contactsRes] = await Promise.all([
                    api.get('/projects'),
                    api.get('/blog'),
                    api.get('/books'),
                    api.get('/contact')
                ]);

                const messagesData = contactsRes.data?.data || [];
                setStats({
                    projects: Array.isArray(projectsRes.data) ? projectsRes.data.length : 0,
                    posts: Array.isArray(postsRes.data) ? postsRes.data.length : 0,
                    books: Array.isArray(booksRes.data) ? booksRes.data.length : 0,
                    messages: messagesData.length
                });
                setLatestMessage(messagesData?.[0] || null);
            } catch (err) {
                console.error('Failed to load dashboard metrics', err);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-heading text-primary-accent mb-2">Dashboard Overview</h1>
                    <p className="text-muted-text max-w-2xl">Live counts from the backend API for projects, blog posts, books, and contact messages.</p>
                </div>
                <Link to="/admin/settings" className="bg-secondary-bg border border-border rounded px-4 py-2 text-primary-text hover:bg-card-bg transition">Edit About Section</Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <div className="bg-card-bg p-6 rounded-lg border border-border">
                    <h3 className="text-lg text-muted-text mb-2">Total Projects</h3>
                    <p className="text-3xl font-bold text-primary-text">{loading ? '...' : stats.projects}</p>
                </div>
                <div className="bg-card-bg p-6 rounded-lg border border-border">
                    <h3 className="text-lg text-muted-text mb-2">Blog Posts</h3>
                    <p className="text-3xl font-bold text-primary-text">{loading ? '...' : stats.posts}</p>
                </div>
                <div className="bg-card-bg p-6 rounded-lg border border-border">
                    <h3 className="text-lg text-muted-text mb-2">Messages</h3>
                    <p className="text-3xl font-bold text-secondary-accent">{loading ? '...' : stats.messages}</p>
                </div>
                <div className="bg-card-bg p-6 rounded-lg border border-border">
                    <h3 className="text-lg text-muted-text mb-2">Books</h3>
                    <p className="text-3xl font-bold text-primary-text">{loading ? '...' : stats.books}</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="bg-card-bg p-8 rounded-lg border border-border shadow-sm">
                    <h2 className="text-2xl font-bold text-primary-text mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <Link to="/admin/projects" className="block bg-primary-accent text-primary-bg px-4 py-3 rounded font-bold hover:bg-secondary-accent transition">Manage Projects</Link>
                        <Link to="/admin/blog" className="block bg-secondary-bg border border-border text-primary-text px-4 py-3 rounded hover:bg-card-bg transition">Manage Blog Posts</Link>
                        <Link to="/admin/contacts" className="block bg-secondary-bg border border-border text-primary-text px-4 py-3 rounded hover:bg-card-bg transition">View Messages</Link>
                    </div>
                </div>

                <div className="bg-card-bg p-8 rounded-lg border border-border shadow-sm">
                    <h2 className="text-2xl font-bold text-primary-text mb-4">Latest Message</h2>
                    {loading ? (
                        <p className="text-muted-text">Loading latest activity…</p>
                    ) : latestMessage ? (
                        <div className="space-y-3">
                            <p className="text-sm text-secondary-accent uppercase tracking-wider">{latestMessage.subject}</p>
                            <p className="text-lg font-bold text-primary-text">From {latestMessage.name}</p>
                            <p className="text-sm text-muted-text leading-relaxed">{latestMessage.message.slice(0, 180)}{latestMessage.message.length > 180 ? '...' : ''}</p>
                            <p className="text-xs text-muted-text">{new Date(latestMessage.createdAt).toLocaleString()}</p>
                        </div>
                    ) : (
                        <p className="text-muted-text">No messages have arrived yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
