import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'Web Development',
        liveUrl: '',
        repoUrl: '',
    });
    const [file, setFile] = useState(null);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
        } catch {
            setError('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchProjects();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let imageUrl = '';
            if (file) {
                const uploadData = new FormData();
                uploadData.append('image', file);
                const uploadRes = await api.post('/projects/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                imageUrl = uploadRes.data.imageUrl;
            }

            const projectData = { ...formData };
            if (imageUrl) projectData.thumbnail = imageUrl;

            await api.post('/projects', projectData);

            setShowForm(false);
            setFormData({ title: '', description: '', category: 'Web Development', liveUrl: '', repoUrl: '' });
            setFile(null);
            fetchProjects();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create project');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        try {
            await api.delete(`/projects/${id}`);
            fetchProjects();
        } catch {
            alert('Failed to delete project');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading text-primary-accent">Manage Projects</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-primary-accent text-primary-bg px-4 py-2 rounded font-bold hover:bg-secondary-accent transition"
                >
                    {showForm ? 'Cancel' : '+ Add Project'}
                </button>
            </div>

            {error && <p className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4">{error}</p>}

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg border border-border mb-8 space-y-4 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-primary-text">Title</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text focus:border-primary-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-primary-text">Category</label>
                            <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text focus:border-primary-accent outline-none">
                                <option>Web Development</option>
                                <option>Mobile Development</option>
                                <option>Design</option>
                                <option>Writing</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-primary-text">Description</label>
                        <textarea required value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text focus:border-primary-accent outline-none resize-none" rows="3"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-primary-text">Live URL (optional)</label>
                            <input type="text" value={formData.liveUrl} onChange={e => setFormData({ ...formData, liveUrl: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text focus:border-primary-accent outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-primary-text">Repo URL (optional)</label>
                            <input type="text" value={formData.repoUrl} onChange={e => setFormData({ ...formData, repoUrl: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text focus:border-primary-accent outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1 text-primary-text">Project Image (Upload via Cloudinary)</label>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full bg-secondary-bg border border-border rounded p-2 text-primary-text" />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-primary-accent text-primary-bg px-6 py-2 rounded font-bold hover:bg-secondary-accent transition">Save Project</button>
                    </div>
                </form>
            )}

            {loading ? <p className="text-muted-text">Loading projects...</p> : (
                <div className="grid gap-4">
                    {projects.map(project => (
                        <div key={project._id} className="bg-card-bg p-4 rounded-lg border border-border flex justify-between items-center transition hover:border-primary-accent">
                            <div className="flex gap-4 items-center">
                                {project.thumbnail ? (
                                    <img src={project.thumbnail} alt={project.title} className="w-16 h-16 object-cover rounded bg-secondary-bg" loading="lazy" decoding="async" />
                                ) : (
                                    <div className="w-16 h-16 bg-secondary-bg rounded flex items-center justify-center text-xs text-muted-text">Img</div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-primary-text">{project.title}</h3>
                                    <p className="text-secondary-accent text-sm">{project.category}</p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(project._id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-semibold px-4 py-2 border border-red-500/30 rounded transition duration-200">Delete</button>
                        </div>
                    ))}
                    {projects.length === 0 && !showForm && (
                        <div className="bg-secondary-bg/50 border border-dashed border-border p-8 text-center rounded-lg">
                            <p className="text-muted-text">No projects found. Add one to get started.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminProjects;
