import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            setMessage(data.message || 'Reset link sent to your email.');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto w-full py-16 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card-bg p-8 rounded-xl border border-border shadow-2xl"
            >
                <h1 className="text-3xl font-heading text-primary-accent mb-6 text-center">Reset Password</h1>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 text-red-500 rounded text-sm text-center">
                        {error}
                    </div>
                )}
                {message && (
                    <div className="mb-4 p-3 bg-green-500/10 border border-green-500/50 text-green-500 rounded text-sm text-center">
                        {message}
                    </div>
                )}

                <p className="text-muted-text text-sm mb-6 text-center">
                    Enter your email address and we'll send you a link to reset your password.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-1">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary-accent text-primary-bg font-bold py-3 rounded hover:bg-secondary-accent transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Sending Link...' : 'Send Reset Link'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-text">
                    Remember your password? <Link to="/login" className="text-primary-accent hover:underline font-semibold">Log In</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ForgotPassword;
