import { useState } from 'react';
import { motion } from 'framer-motion';
import api from '../../services/api';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const { data } = await api.post('/auth/login', { email, password });
            localStorage.setItem('userInfo', JSON.stringify(data));
            window.location.href = '/admin';
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary-bg px-4 py-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card-bg p-8 rounded-lg shadow-lg border border-border"
            >
                <h1 className="text-3xl font-heading text-primary-accent mb-6 text-center">Admin Portal</h1>
                {error && <p className="bg-red-500/10 border border-red-500 text-red-500 p-3 rounded mb-4 text-center">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Email</label>
                        <input
                            type="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Password</label>
                        <input
                            type="password" required
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                        />
                    </div>
                    <button type="submit" className="w-full bg-primary-accent text-primary-bg font-bold py-3 rounded hover:bg-secondary-accent transition-colors">
                        Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
};
export default AdminLogin;
