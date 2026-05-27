import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Clock, Calendar } from '@phosphor-icons/react';
import api from '../services/api';

const Blog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', 'Masculinity', 'Discipline', 'Campus', 'Society', 'Technology'];

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await api.get('/blog');
                setPosts(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchPosts();
    }, []);

    const filteredPosts = selectedCategory === 'All' 
        ? posts 
        : posts.filter(post => post.category === selectedCategory);

    const featuredPost = filteredPosts[0];
    const otherPosts = filteredPosts.slice(1);

    const calculateReadingTime = (text) => {
        const wordsPerMinute = 200;
        const wordCount = (text || '').split(/\s+/).length;
        return Math.ceil(wordCount / wordsPerMinute);
    };

    const renderMediaPreview = (post, className = '') => {
        const mediaSrc = post.mediaUrl || post.featuredImage;
        if (!mediaSrc) {
            return <div className="text-muted-text text-center">No Image</div>;
        }

        if (post.mediaType === 'video') {
            return mediaSrc.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/i) ? (
                <video src={mediaSrc} controls className={className} />
            ) : (
                <div className="text-muted-text text-center p-6">Video content available</div>
            );
        }

        return <img src={mediaSrc} alt={post.title} className={className} loading="lazy" decoding="async" />;
    };

    return (
        <div className="py-12 max-w-6xl mx-auto px-4">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-heading text-primary-accent mb-4">
                    Blog / Articles
                </h1>
                <p className="text-muted-text leading-relaxed max-w-3xl">
                    The blog section displays Van Clarence's articles organized by category with filter functionality. The section header includes a title and subtitle, followed by a horizontal row of category filter pills (All, Masculinity, Discipline, Campus, Society, Technology). The active filter is highlighted with the accent color. Below the filters, a responsive grid of blog cards displays each article with a featured image, category tag, title, short excerpt, and publication date. Each card is clickable and navigates to the individual blog post page, which includes the full article text, metadata, publication date, reading time, and social sharing buttons. The blog also includes a search functionality and pagination or infinite scroll for loading additional posts.
                </p>
            </motion.div>

            {/* Category Filters */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-wrap gap-3 mb-12 pb-6 border-b border-border"
            >
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-all duration-300 ${
                            selectedCategory === category
                                ? 'bg-primary-accent text-primary-bg'
                                : 'bg-secondary-bg text-muted-text hover:text-primary-text hover:border-primary-accent border border-border'
                        }`}
                    >
                        {category}
                    </button>
                ))}
            </motion.div>

            {loading ? (
                <p className="text-center text-muted-text py-8">Loading articles...</p>
            ) : filteredPosts.length === 0 ? (
                <p className="text-center text-muted-text py-8">No blog posts in this category yet.</p>
            ) : (
                <div className="space-y-12">
                    {/* Featured Article */}
                    {featuredPost && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col md:flex-row gap-8 bg-card-bg border border-border rounded-lg overflow-hidden hover:border-primary-accent transition-all duration-300 shadow-lg"
                        >
                            {/* Featured Image */}
                            <div className="w-full md:w-2/5 bg-secondary-bg flex items-center justify-center min-h-[300px] overflow-hidden">
                                {renderMediaPreview(featuredPost, 'w-full h-full object-cover')}
                            </div>

                            {/* Featured Content */}
                            <div className="w-full md:w-3/5 p-8 flex flex-col justify-between">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-secondary-bg text-xs text-primary-accent uppercase tracking-wider rounded mb-4 font-bold">
                                        {featuredPost.category || 'Uncategorized'}
                                    </span>
                                    <h2 className="text-3xl font-heading text-primary-text mb-4">{featuredPost.title}</h2>
                                    <p className="text-muted-text leading-relaxed mb-6">{featuredPost.excerpt}</p>
                                </div>

                                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-6">
                                    <div className="flex flex-wrap gap-4 text-sm text-secondary-accent">
                                        <span className="flex items-center gap-2">
                                            <Calendar size={16} />
                                            {new Date(featuredPost.createdAt).toLocaleDateString()}
                                        </span>
                                        <span className="flex items-center gap-2">
                                            <Clock size={16} />
                                            {calculateReadingTime(featuredPost.content)} min read
                                        </span>
                                    </div>
                                    <Link
                                        to={`/blog/${featuredPost.slug || featuredPost._id}`}
                                        className="bg-primary-accent text-primary-bg px-6 py-2 rounded font-bold hover:bg-secondary-accent transition-colors uppercase text-sm"
                                    >
                                        Read Article
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Blog Grid */}
                    {otherPosts.length > 0 && (
                        <div>
                            <h2 className="text-2xl font-heading text-primary-text mb-8">More Articles</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {otherPosts.map((post, idx) => (
                                    <motion.div
                                        key={post._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="bg-card-bg border border-border rounded-lg overflow-hidden hover:border-primary-accent hover:shadow-lg transition-all duration-300 flex flex-col"
                                    >
                                        {/* Card Image */}
                                        <div className="w-full h-48 bg-secondary-bg flex items-center justify-center overflow-hidden">
                                            {renderMediaPreview(post, 'w-full h-full object-cover')}
                                        </div>

                                        {/* Card Content */}
                                        <div className="p-6 flex flex-col flex-grow">
                                            <span className="inline-block px-2 py-1 bg-secondary-bg text-xs text-primary-accent uppercase tracking-wider rounded mb-3 font-bold w-fit">
                                                {post.category || 'Uncategorized'}
                                            </span>
                                            <h3 className="text-xl font-heading text-primary-text mb-3 line-clamp-2">{post.title}</h3>
                                            <p className="text-sm text-muted-text mb-4 line-clamp-2 flex-grow">{post.excerpt}</p>

                                            {/* Card Footer */}
                                            <div className="border-t border-border pt-4">
                                                <div className="flex items-center justify-between mb-4">
                                                    <div className="flex gap-3 text-xs text-secondary-accent">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={14} />
                                                            {new Date(post.createdAt).toLocaleDateString()}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock size={14} />
                                                            {calculateReadingTime(post.content)} min
                                                        </span>
                                                    </div>
                                                </div>
                                                <Link
                                                    to={`/blog/${post.slug || post._id}`}
                                                    className="text-primary-accent font-semibold text-sm hover:underline"
                                                >
                                                    Read More →
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default Blog;
