import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { motion } from 'framer-motion';
import { Eye, EyeClosed } from '@phosphor-icons/react';

const ResetPassword = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);

        try {
            const { data } = await api.put(`/auth/reset-password/${token}`, { password });
            setMessage(data.message || 'Password reset successful!');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password. The link might be expired.');
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
                <h1 className="text-3xl font-heading text-primary-accent mb-6 text-center">Set New Password</h1>
                
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

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-1">New Password</label>
                        <div className="relative">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-secondary-bg border border-border rounded p-3 pr-12 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-accent transition-colors"
                            >
                                {showPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-1">Confirm New Password</label>
                        <div className="relative">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full bg-secondary-bg border border-border rounded p-3 pr-12 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-text hover:text-primary-accent transition-colors"
                            >
                                {showConfirmPassword ? <Eye size={20} /> : <EyeClosed size={20} />}
                            </button>
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={loading || !!message}
                        className="w-full bg-primary-accent text-primary-bg font-bold py-3 rounded hover:bg-secondary-accent transition-colors disabled:opacity-50 mt-4"
                    >
                        {loading ? 'Saving...' : 'Reset Password'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-text">
                    <Link to="/login" className="text-primary-accent hover:underline font-semibold">Back to Login</Link>
                </div>
            </motion.div>
        </div>
    );
};

export default ResetPassword;
