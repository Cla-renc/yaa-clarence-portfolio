import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarBlank, Heart, FacebookLogo, TiktokLogo, Link as LinkIcon } from '@phosphor-icons/react';
import api from '../services/api';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [commentData, setCommentData] = useState({ name: '', text: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        api.get(`/blog/${slug}`)
            .then(res => setPost(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

    const handleLike = async () => {
        try {
            const res = await api.post(`/blog/${post._id}/like`);
            setPost(prev => ({ ...prev, likes: res.data.likes }));
        } catch (error) {
            console.error('Error liking post', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            const res = await api.post(`/blog/${post._id}/comment`, commentData);
            setPost(prev => ({ ...prev, comments: [...(prev.comments || []), res.data] }));
            setCommentData({ name: '', text: '' });
        } catch (error) {
            console.error('Error adding comment', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const shareFacebook = () => {
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    };

    const copyLink = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard! You can now share it on TikTok or anywhere else.');
    };

    if (loading) return <div className="py-24 text-center text-muted-text">Loading...</div>;
    if (!post) return <div className="py-24 text-center"><h2 className="text-2xl text-primary-accent">Post not found.</h2><Link to="/#blog" className="mt-4 inline-block text-muted-text hover:text-primary-accent">← Back to Blog</Link></div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 max-w-3xl mx-auto px-4 w-full"
        >
            <Link to="/#blog" className="inline-flex items-center gap-2 text-muted-text hover:text-primary-accent transition-colors mb-8 font-heading font-semibold uppercase tracking-wider text-sm">
                <ArrowLeft size={18} /> Back to Blog
            </Link>

            <article>
                <header className="mb-10">
                    <h1 className="font-heading text-primary-text mb-4 leading-tight">{post.title}</h1>
                    <div className="flex items-center gap-3 text-muted-text text-sm">
                        <CalendarBlank size={16} />
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {post.excerpt && <p className="mt-4 text-xl text-muted-text leading-relaxed border-l-4 border-primary-accent pl-4 italic">{post.excerpt}</p>}
                </header>

                {(post.mediaUrl || post.featuredImage) && (
                    <div className="mb-10">
                        {post.mediaType === 'video' ? (
                            post.mediaUrl?.match(/\.(mp4|webm|mov|avi|mkv)(\?|$)/i) ? (
                                <video controls className="w-full rounded-xl shadow-lg bg-black">
                                    <source src={post.mediaUrl} />
                                </video>
                            ) : (
                                <div className="rounded-xl bg-secondary-bg p-8 text-center text-primary-text border border-border">
                                    <a href={post.mediaUrl} target="_blank" rel="noreferrer" className="text-primary-accent underline">
                                        View video content
                                    </a>
                                </div>
                            )
                        ) : (
                            <img src={post.mediaUrl || post.featuredImage} alt={post.title} className="w-full rounded-xl shadow-lg object-cover" loading="lazy" decoding="async" />
                        )}
                    </div>
                )}

                <div
                    className="prose prose-lg max-w-none text-primary-text leading-relaxed mt-10"
                    dangerouslySetInnerHTML={{ __html: post.content || '<p>Full article coming soon...</p>' }}
                />

                <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-b border-border py-6 gap-4">
                    <button 
                        onClick={handleLike} 
                        className="flex items-center gap-2 px-6 py-3 bg-secondary-bg hover:bg-card-bg rounded-full transition-colors border border-border text-primary-text font-bold"
                    >
                        <Heart size={24} className="text-red-500" weight="fill" />
                        {post.likes || 0} Likes
                    </button>
                    
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-muted-text uppercase tracking-wider mr-2">Share:</span>
                        <button onClick={shareFacebook} className="p-3 bg-[#1877F2]/10 text-[#1877F2] hover:bg-[#1877F2]/20 rounded-full transition-colors" title="Share on Facebook">
                            <FacebookLogo size={24} weight="fill" />
                        </button>
                        <button onClick={copyLink} className="p-3 bg-white/10 text-white hover:bg-white/20 rounded-full transition-colors border border-border" title="Copy link for TikTok">
                            <TiktokLogo size={24} weight="regular" />
                        </button>
                        <button onClick={copyLink} className="p-3 bg-secondary-bg text-primary-text hover:bg-card-bg rounded-full transition-colors border border-border" title="Copy Link">
                            <LinkIcon size={24} weight="bold" />
                        </button>
                    </div>
                </div>

                <div className="mt-12">
                    <h3 className="text-2xl font-heading text-primary-text mb-8">Comments ({post.comments?.length || 0})</h3>
                    
                    <div className="space-y-6 mb-12">
                        {post.comments?.map((comment, index) => (
                            <div key={index} className="bg-card-bg p-5 rounded-xl border border-border">
                                <div className="flex justify-between items-center mb-3">
                                    <h4 className="font-bold text-primary-text">{comment.name}</h4>
                                    <span className="text-xs text-muted-text">{new Date(comment.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-secondary-text text-sm leading-relaxed">{comment.text}</p>
                            </div>
                        ))}
                        {(!post.comments || post.comments.length === 0) && (
                            <p className="text-muted-text italic">No comments yet. Be the first to share your thoughts!</p>
                        )}
                    </div>

                    <div className="bg-secondary-bg p-6 md:p-8 rounded-2xl border border-border shadow-lg">
                        <h4 className="text-xl font-heading text-primary-text mb-6">Leave a Reply</h4>
                        <form onSubmit={handleCommentSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary-text">Name</label>
                                <input 
                                    type="text" 
                                    required 
                                    value={commentData.name} 
                                    onChange={(e) => setCommentData({...commentData, name: e.target.value})}
                                    className="w-full bg-card-bg border border-border rounded-lg p-3 focus:outline-none focus:border-primary-accent text-primary-text transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-primary-text">Comment</label>
                                <textarea 
                                    required 
                                    rows="4"
                                    value={commentData.text} 
                                    onChange={(e) => setCommentData({...commentData, text: e.target.value})}
                                    className="w-full bg-card-bg border border-border rounded-lg p-3 focus:outline-none focus:border-primary-accent text-primary-text transition-colors resize-y"
                                    placeholder="Your thoughts..."
                                ></textarea>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-primary-accent text-primary-bg font-bold rounded-lg hover:bg-secondary-accent transition-colors disabled:opacity-50 mt-4"
                            >
                                {isSubmitting ? 'Posting...' : 'Post Comment'}
                            </button>
                        </form>
                    </div>
                </div>
            </article>
        </motion.div>
    );
};

export default BlogPost;
