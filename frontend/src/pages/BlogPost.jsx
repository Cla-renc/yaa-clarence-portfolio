import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CalendarBlank } from '@phosphor-icons/react';
import api from '../services/api';

const BlogPost = () => {
    const { slug } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get(`/blog/${slug}`)
            .then(res => setPost(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [slug]);

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
                    className="prose prose-lg max-w-none text-primary-text leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: post.content || '<p>Full article coming soon...</p>' }}
                />
            </article>
        </motion.div>
    );
};

export default BlogPost;
