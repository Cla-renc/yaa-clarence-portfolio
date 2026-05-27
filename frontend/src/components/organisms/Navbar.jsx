import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { List, X, Sun, Moon, Star, User } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { useTheme } from '../ThemeProvider';
import { useAuth } from '../../context/AuthContext';
import SearchBar from '../molecules/SearchBar';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { user } = useAuth();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu on route change
    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { setIsOpen(false); }, [location]);

    const scrollToTop = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const renderThemeIcon = () => {
        if (theme === 'theme-default') return <Sun size={20} />;
        if (theme === 'theme-midnight-purpose') return <Star size={20} />;
        return <Moon size={20} />;
    };

    const links = [
        { name: 'About', to: '/about' },
        { name: 'Books', to: '/books' },
        { name: 'BLDD', to: '/bruce-lee-diaries' },
        { name: 'Blog', to: '/blog' },
        { name: 'Projects', to: '/projects' },
        { name: 'Contact', to: '/contact' },
    ];

    const mobileMenuVariants = {
        hidden: { opacity: 0, y: -100 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                staggerChildren: 0.05,
            },
        },
        exit: { opacity: 0, y: -100, transition: { duration: 0.2 } },
    };

    const mobileItemVariants = {
        hidden: { opacity: 0, y: -20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-card-bg/95 backdrop-blur-md shadow-md' : 'bg-primary-bg'}`}>
            <div className="container mx-auto px-4 py-4 flex justify-between items-center relative z-50">
                <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Link to="/" onClick={scrollToTop} className="text-2xl font-heading font-black text-primary-accent uppercase tracking-widest cursor-pointer">
                        Yaa Clarence
                    </Link>
                </motion.div>
                <div className="hidden md:flex space-x-8 items-center">
                    {links.map((link) => (
                        <motion.div
                            key={link.name}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <NavLink
                                to={link.to}
                                className={({ isActive }) =>
                                    `font-heading text-sm uppercase tracking-wider font-medium transition-colors ${isActive ? 'text-primary-accent' : 'text-primary-text hover:text-primary-accent'}`
                                }
                            >
                                {link.name}
                            </NavLink>
                        </motion.div>
                    ))}
                </div>
                <div className="hidden md:flex items-center space-x-4 ml-4">
                    <SearchBar className="w-64" placeholder="Search..." />
                    
                    {user ? (
                        <Link to="/account" className="flex items-center gap-1 font-heading text-sm uppercase tracking-wider font-bold text-primary-accent hover:text-secondary-accent transition-colors" title="Account">
                            <User size={24} weight="bold" />
                        </Link>
                    ) : (
                        <Link to="/login" className="flex items-center gap-1 font-heading text-sm uppercase tracking-wider font-bold text-primary-text hover:text-primary-accent transition-colors">
                            Login
                        </Link>
                    )}

                    <motion.button
                        onClick={toggleTheme}
                        className="p-2 border border-border rounded-full hover:bg-secondary-bg text-primary-text transition-colors"
                        title="Toggle Theme"
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderThemeIcon()}
                    </motion.button>
                </div>
                {/* Mobile Icons */}
                <div className="md:hidden flex items-center space-x-3">
                    <motion.button
                        onClick={toggleTheme}
                        className="p-2 rounded-full hover:bg-secondary-bg text-primary-text transition-colors"
                        whileHover={{ rotate: 180, scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{ duration: 0.3 }}
                    >
                        {renderThemeIcon()}
                    </motion.button>
                    <motion.button
                        className="text-primary-text p-2"
                        onClick={() => setIsOpen(!isOpen)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {isOpen ? <X size={28} weight="regular" /> : <List size={28} weight="regular" />}
                    </motion.button>
                </div>
            </div>

            {/* Full Screen Mobile Menu */}
            <motion.div
                className={`fixed inset-0 bg-primary-bg z-40 flex flex-col justify-center items-center md:hidden ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'}`}
                animate={isOpen ? 'visible' : 'hidden'}
                variants={mobileMenuVariants}
                initial="hidden"
            >
                <motion.div
                    className="flex flex-col items-center space-y-10"
                    variants={{
                        hidden: { opacity: 0 },
                        visible: {
                            opacity: 1,
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <motion.div variants={mobileItemVariants} className="w-3/4 mb-4">
                        <SearchBar placeholder="Search..." />
                    </motion.div>
                    <motion.div variants={mobileItemVariants}>
                        <Link to="/" onClick={scrollToTop} className="text-3xl font-heading font-black uppercase tracking-widest hover:text-primary-accent transition-colors">Home</Link>
                    </motion.div>
                    {links.map((link) => (
                        <motion.div key={link.name} variants={mobileItemVariants}>
                            <Link
                                to={link.to}
                                className="text-3xl font-heading font-black uppercase tracking-widest hover:text-primary-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        </motion.div>
                    ))}
                    <motion.div variants={mobileItemVariants}>
                        {user ? (
                            <Link to="/account" className="flex items-center gap-2 text-3xl font-heading font-black text-primary-accent uppercase tracking-widest hover:text-secondary-accent transition-colors">
                                <User size={32} weight="bold" /> Account
                            </Link>
                        ) : (
                            <Link to="/login" className="text-3xl font-heading font-black uppercase tracking-widest hover:text-primary-accent transition-colors">
                                Login
                            </Link>
                        )}
                    </motion.div>
                </motion.div>
            </motion.div>
        </nav>
    );
};

export default Navbar;
