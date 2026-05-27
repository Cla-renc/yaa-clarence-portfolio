import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Account = () => {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    if (loading || !user) {
        return <div className="text-center py-20 text-muted-text">Loading...</div>;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto w-full py-16 px-4">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card-bg p-8 rounded-xl border border-border shadow-md"
            >
                <div className="flex justify-between items-center mb-8 border-b border-border pb-4">
                    <h1 className="text-3xl font-heading text-primary-accent">My Account</h1>
                    <button 
                        onClick={handleLogout}
                        className="px-4 py-2 bg-secondary-bg hover:bg-red-500/10 hover:text-red-500 text-primary-text rounded border border-border transition-colors font-semibold text-sm uppercase tracking-wider"
                    >
                        Log Out
                    </button>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                    <div className="bg-secondary-bg p-6 rounded-lg border border-border">
                        <h2 className="text-xl font-bold text-primary-text mb-4">Profile Information</h2>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Name</span>
                                <span className="text-lg text-primary-text">{user.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Email</span>
                                <span className="text-lg text-primary-text">{user.email}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-muted-text uppercase tracking-widest mb-1">Account Role</span>
                                <span className="inline-block px-2 py-1 bg-primary-accent/10 text-primary-accent text-xs font-bold uppercase tracking-wider rounded">
                                    {user.role}
                                </span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="bg-secondary-bg p-6 rounded-lg border border-border flex flex-col justify-center items-center text-center">
                        <div className="w-16 h-16 bg-primary-accent/20 rounded-full flex items-center justify-center mb-4">
                            <span className="text-2xl text-primary-accent font-black">
                                {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                            </span>
                        </div>
                        <h3 className="text-lg font-bold text-primary-text mb-2">Welcome to Yaa Clarence</h3>
                        <p className="text-muted-text text-sm">
                            More features like saved articles, purchases, and subscriptions will be available here soon.
                        </p>
                        {user.role === 'admin' && (
                            <button onClick={() => navigate('/admin')} className="mt-6 px-6 py-2 bg-primary-accent text-primary-bg font-bold uppercase tracking-widest rounded hover:bg-secondary-accent transition-colors text-sm">
                                Go to Admin Dashboard
                            </button>
                        )}
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Account;
