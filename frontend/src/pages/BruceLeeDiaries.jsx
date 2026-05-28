import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import facebookLogo from '../assets/facebook-logo.svg';
import tiktokLogo from '../assets/tiktok-logo.svg';

const defaultBldd = {
    title: 'Bruce Lee Discipline Diaries',
    subtitle: 'A dedicated brand showcase celebrating masculinity, discipline, and wisdom',
    intro: 'The Bruce Lee Discipline Diaries section is the dedicated brand showcase within the YAA CLARENCE portfolio. It features a dark color scheme leader banner and visual control with the rest of the portfolio, creating a unified yet distinctive brand presence. The content is divided into two main areas: a content grid displaying featured posts, reels, and video thumbnails from the BLDD social media channels, while the right displays a content card featuring live follower counts and engagement metrics, streamlined accommodations varying content sizes. Each piece of content can be clicked to view the original post on the respective social media platform.',
    profilePhoto: '',
    coverPhoto: ''
};

const BruceLeeDiaries = () => {
    const [bldd, setBldd] = useState(defaultBldd);
    const [loading, setLoading] = useState(true);

    const platformLogos = {
        Facebook: facebookLogo,
        TikTok: tiktokLogo,
    };

    const [platforms, setPlatforms] = useState([
        {
            name: 'Facebook',
            followers: 10,
            isFollowing: false,
            link: 'https://www.facebook.com/BruceLeeMindset',
            color: 'bg-blue-600'
        },
        {
            name: 'TikTok',
            followers: 34,
            isFollowing: false,
            link: 'https://www.tiktok.com/@bl_disciplinediaries',
            color: 'bg-black'
        }
    ]);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const { data } = await api.get('/site-config');
                const configBldd = data?.data?.bldd;
                if (configBldd && typeof configBldd === 'object') {
                    setBldd((prev) => ({ ...prev, ...configBldd }));
                }
            } catch (err) {
                console.error('Failed to load bldd settings', err);
            } finally {
                setLoading(false);
            }
        };
        fetchConfig();
    }, []);

    const handleFollow = (e, idx) => {
        e.preventDefault();
        e.stopPropagation();
        
        setPlatforms(prev => {
            const newPlatforms = [...prev];
            const platform = { ...newPlatforms[idx] };
            if (platform.isFollowing) {
                platform.followers -= 1;
                platform.isFollowing = false;
            } else {
                platform.followers += 1;
                platform.isFollowing = true;
            }
            newPlatforms[idx] = platform;
            return newPlatforms;
        });
    };

    const contentPosts = [
        { id: 1, title: 'Discipline', platform: 'Facebook', thumbnail: '📝' },
        { id: 2, title: 'Wisdom', platform: 'TikTok', thumbnail: '💭' },
        { id: 3, title: 'Strength', platform: 'Facebook', thumbnail: '💪' },
        { id: 4, title: 'Focus', platform: 'TikTok', thumbnail: '🎯' },
        { id: 5, title: 'Growth', platform: 'Facebook', thumbnail: '📈' },
        { id: 6, title: 'Legacy', platform: 'TikTok', thumbnail: '🏆' },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-muted-text">Loading...</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Header Banner - Dark Theme (#1A1A2E) */}
            <div 
                className="w-full h-80 relative flex flex-col items-center justify-center pt-10"
                style={{
                    backgroundColor: '#1A1A2E',
                    backgroundImage: bldd.coverPhoto ? `url(${bldd.coverPhoto})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Overlay for text readability if cover photo exists */}
                {bldd.coverPhoto && <div className="absolute inset-0 bg-[#1A1A2E]/70"></div>}
                
                <div className="relative z-10 text-center px-4 max-w-4xl">
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-heading text-white mb-6 uppercase tracking-wider"
                    >
                        {bldd.title}
                    </motion.h1>
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="w-24 h-1 bg-primary-accent mx-auto"
                    ></motion.div>
                </div>

                {/* Gradient Fade Transition into content area */}
                <div className="absolute bottom-0 left-0 w-full h-32 bg-linear-to-t from-primary-bg to-transparent"></div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 mb-24 relative z-10 -mt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column (70%) - Manifesto & Masonry Grid */}
                    <div className="lg:col-span-8">
                        {/* Brand Manifesto / Intro */}
                        <div className="bg-card-bg rounded-xl p-8 shadow-lg border border-border mb-12">
                            <h2 className="text-2xl font-heading text-primary-text mb-2 uppercase tracking-wide">Brand Manifesto</h2>
                            <h3 className="text-sm font-bold text-primary-accent uppercase tracking-widest mb-6">{bldd.subtitle}</h3>
                            <div className="text-muted-text leading-relaxed space-y-4">
                                <p>{bldd.intro}</p>
                            </div>
                            
                            {/* Optional: if profile photo exists, display it subtly inside the manifesto */}
                            {bldd.profilePhoto && (
                                <div className="mt-8 flex items-center gap-4">
                                    <img src={bldd.profilePhoto} alt="Author" className="w-16 h-16 rounded-full object-cover border-2 border-primary-accent" />
                                    <span className="text-sm font-bold text-primary-text uppercase tracking-wider">Curated by Yaa Clarence</span>
                                </div>
                            )}
                        </div>

                        {/* Equal-size Content Grid (3-column desktop, 2-column tablet, 1-column mobile) */}
                        <h2 className="text-2xl font-heading text-primary-text mb-6 uppercase tracking-wide">Featured Content</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {contentPosts.map((post, idx) => (
                                <motion.a
                                    key={post.id}
                                    href="#"
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="block bg-card-bg border border-border rounded-xl overflow-hidden hover:border-primary-accent hover:shadow-xl transition-all duration-300 group"
                                >
                                    <div className="w-full h-48 bg-secondary-bg flex items-center justify-center text-5xl relative">
                                        {post.thumbnail}
                                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                                            <span className="text-white text-sm font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity translate-y-4 group-hover:translate-y-0">View Post</span>
                                        </div>
                                        {/* Platform Icon Badge */}
                                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md p-1.5">
                                            <img src={platformLogos[post.platform]} alt={post.platform} className="w-full h-full object-contain" />
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-heading text-primary-text font-bold uppercase tracking-wide mb-1">{post.title}</h3>
                                        <span className="text-xs text-secondary-accent font-medium uppercase tracking-wider">via {post.platform}</span>
                                    </div>
                                </motion.a>
                            ))}
                        </div>
                    </div>

                    {/* Right Column (30%) - Platform Cards Sidebar */}
                    <div className="lg:col-span-4">
                        <div className="sticky top-24">
                            <h2 className="text-2xl font-heading text-primary-text mb-6 uppercase tracking-wide">Platform Cards</h2>
                            <div className="space-y-6">
                                {platforms.map((platform, idx) => (
                                    <motion.a
                                        key={platform.name}
                                        href={platform.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.2 }}
                                        className="block bg-card-bg border border-border rounded-xl p-8 hover:border-primary-accent hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
                                    >
                                        {/* Subtle background color hint based on platform */}
                                        <div className={`absolute top-0 left-0 w-1 h-full ${platform.color} opacity-80`}></div>
                                        
                                        <div className="flex items-center gap-5 mb-6">
                                            <div className={`w-14 h-14 ${platform.color} rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                                <img src={platformLogos[platform.name]} alt={`${platform.name} logo`} className="w-8 h-8 object-contain" />
                                            </div>
                                            <div>
                                                <h3 className="font-heading text-primary-text font-bold text-xl">{platform.name}</h3>
                                                <p className="text-xs text-muted-text">Official Channel</p>
                                            </div>
                                        </div>
                                        
                                        <div className="bg-secondary-bg rounded-lg p-6 text-center border border-border">
                                            <p className="text-4xl font-bold text-primary-accent mb-2">{platform.followers.toLocaleString()}</p>
                                            <p className="text-xs font-bold text-primary-text uppercase tracking-widest">Total Followers</p>
                                        </div>
                                        
                                        <button 
                                            onClick={(e) => handleFollow(e, idx)}
                                            className={`w-full mt-6 font-bold py-3 rounded-lg text-sm transition-colors uppercase tracking-widest ${
                                                platform.isFollowing 
                                                    ? 'bg-secondary-bg text-primary-text border border-border hover:bg-card-bg' 
                                                    : 'bg-primary-text text-primary-bg hover:bg-primary-accent hover:text-white'
                                            }`}
                                        >
                                            {platform.isFollowing ? 'Following' : 'Follow Page'}
                                        </button>
                                    </motion.a>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default BruceLeeDiaries;
