import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Projects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [category, setCategory] = useState('All');

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const { data } = await api.get('/projects');
                setProjects(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProjects();
    }, []);

    const filteredProjects = category === 'All' ? projects : projects.filter(p => p.category === category);

    return (
        <div className="py-8">
            <h1 className="text-4xl font-heading text-primary-accent mb-8">Portfolio Projects</h1>
            <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                {['All', 'Web Development', 'Mobile Development', 'Design', 'Writing'].map(c => (
                    <button
                        key={c}
                        onClick={() => setCategory(c)}
                        className={`px-4 py-2 rounded-md whitespace-nowrap transition-colors border border-primary-accent 
               ${category === c ? 'bg-primary-accent text-primary-bg' : 'text-primary-accent hover:bg-primary-accent/20'}`}
                    >
                        {c}
                    </button>
                ))}
            </div>

            {loading ? (
                <p>Loading projects...</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id || index}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-card-bg rounded-lg overflow-hidden border border-border hover:border-primary-accent transition-colors"
                        >
                            <div className="h-48 bg-gray-800 flex items-center justify-center p-4">
                                {/* Placeholder for project thumbnail */}
                                {project.thumbnail ? <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" loading="lazy" decoding="async" /> : <span className="text-muted-text">Thumb Placeholder</span>}
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-primary-text mb-2">{project.title}</h3>
                                <span className="inline-block px-2 py-1 bg-secondary-bg text-secondary-accent text-xs rounded-sm mb-3">
                                    {project.category}
                                </span>
                                <p className="text-muted-text text-sm mb-4 line-clamp-3">{project.description}</p>
                                <div className="flex justify-between items-center text-sm font-semibold text-primary-accent">
                                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="hover:underline">View Live</a>
                                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="hover:underline">Repo</a>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                    {filteredProjects.length === 0 && <p className="col-span-3 text-muted-text">No projects found for this category.</p>}
                </div>
            )}
        </div>
    );
};
export default Projects;
