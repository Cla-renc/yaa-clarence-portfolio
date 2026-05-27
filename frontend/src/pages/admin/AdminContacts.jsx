import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminContacts = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMessages = async () => {
        try {
            // Assumes a GET /api/contacts endpoint exists, if not, it will just show empty or err
            const { data } = await api.get('/contact').catch(() => ({ data: [] }));
            // Or fallback if the route was named differently, try /contacts if /contact fails
            setMessages(data || []);
        } catch {
            console.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchMessages();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this message?')) return;
        try {
            await api.delete(`/contact/${id}`);
            fetchMessages();
        } catch {
            alert('Failed to delete');
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-heading text-primary-accent mb-8">Messages</h1>
            {loading ? <p className="text-muted-text">Loading...</p> : (
                <div className="space-y-4">
                    {messages.length === 0 && <p className="text-muted-text bg-secondary-bg/50 p-8 text-center rounded-lg border border-dashed border-border">No messages found. The inbox is clear! (Or the backend endpoint needs configuration)</p>}
                    {messages.map((msg) => (
                        <div key={msg._id} className="bg-card-bg p-6 rounded-lg border border-border">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-primary-text">{msg.name} <span className="text-sm font-normal text-muted-text">&lt;{msg.email}&gt;</span></h3>
                                    <p className="text-secondary-accent font-semibold">{msg.subject}</p>
                                    <p className="text-xs text-muted-text">{new Date(msg.createdAt).toLocaleString()}</p>
                                </div>
                                <button onClick={() => handleDelete(msg._id)} className="text-red-500 hover:text-red-400 font-semibold px-4 py-2 border border-red-500/30 rounded text-sm transition">Delete</button>
                            </div>
                            <div className="bg-secondary-bg p-4 rounded text-primary-text whitespace-pre-wrap border border-border">
                                {msg.message}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
};
export default AdminContacts;
