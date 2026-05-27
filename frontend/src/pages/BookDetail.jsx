import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, EnvelopeSimple } from '@phosphor-icons/react';
import api from '../services/api';

const BookDetail = () => {
    const { slug } = useParams();
    const [book, setBook] = useState(null);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [notifyStatus, setNotifyStatus] = useState('');

    useEffect(() => {
        // Try to find book by id (since books may not have slugs)
        api.get('/books')
            .then(res => {
                const found = res.data.find(b => b._id === slug || b.slug === slug);
                setBook(found || null);
            })
            .catch(() => { })
            .finally(() => setLoading(false));
    }, [slug]);

    const handleNotify = (e) => {
        e.preventDefault();
        setNotifyStatus('You\'re on the list!');
        setEmail('');
    };

    if (loading) return <div className="py-24 text-center text-muted-text">Loading...</div>;
    if (!book) return <div className="py-24 text-center"><h2 className="text-2xl text-primary-accent">Book not found.</h2><Link to="/#books" className="mt-4 inline-block text-muted-text hover:text-primary-accent">← Back to Books</Link></div>;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="py-12 max-w-5xl mx-auto px-4 w-full"
        >
            <Link to="/#books" className="inline-flex items-center gap-2 text-muted-text hover:text-primary-accent transition-colors mb-8 font-heading font-semibold uppercase tracking-wider text-sm">
                <ArrowLeft size={18} /> Back to Books
            </Link>

            <div className="flex flex-col md:flex-row gap-12 bg-card-bg p-8 rounded-2xl border border-border shadow-2xl">
                {/* Cover */}
                <div className="w-full md:w-1/3 min-h-[400px] bg-secondary-bg flex items-center justify-center rounded-xl border border-border overflow-hidden">
                    {book.coverImage
                        ? <img src={book.coverImage} className="w-full h-full object-cover" alt={book.title} loading="lazy" decoding="async" />
                        : <span className="text-muted-text italic text-center px-4 font-bold text-sm tracking-widest uppercase">Draft Cover<br /><br />{book.title}</span>
                    }
                </div>

                {/* Details */}
                <div className="w-full md:w-2/3 flex flex-col">
                    <h1 className="font-heading text-primary-text mb-4 leading-tight">{book.title}</h1>

                    <div className="flex gap-3 mb-6 flex-wrap">
                        <span className="px-3 py-1 bg-secondary-bg text-xs text-secondary-accent uppercase tracking-wider rounded">{book.genre}</span>
                        <span className="px-3 py-1 bg-secondary-bg text-xs text-primary-accent uppercase tracking-wider rounded">Status: {book.status}</span>
                        {book.isFree
                            ? <span className="px-3 py-1 bg-green-500/20 text-xs text-green-500 uppercase tracking-wider rounded">Free Giveaway</span>
                            : book.isForSale
                                ? <span className="px-3 py-1 bg-blue-500/20 text-xs text-blue-500 uppercase tracking-wider rounded">KES {book.price}</span>
                                : <span className="px-3 py-1 bg-secondary-bg text-xs text-muted-text uppercase tracking-wider rounded">Coming Soon</span>
                        }
                    </div>

                    {book.audience && (
                        <p className="text-sm text-muted-text mb-4"><span className="font-bold text-primary-text">Target Audience:</span> {book.audience}</p>
                    )}

                    <p className="text-primary-text leading-relaxed mb-auto flex-1">{book.synopsis}</p>

                    <div className="mt-8 border-t border-border pt-6">
                        <h3 className="text-lg font-bold text-primary-text mb-3 uppercase tracking-widest text-sm">Get Notified on Publication</h3>
                        {notifyStatus
                            ? <p className="text-secondary-accent font-bold">{notifyStatus}</p>
                            : <form onSubmit={handleNotify} className="flex gap-3">
                                <div className="flex-1 relative">
                                    <EnvelopeSimple size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
                                    <input type="email" placeholder="Enter your email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full pl-10 bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors" />
                                </div>
                                <button type="submit" className="bg-primary-accent text-primary-bg font-bold px-6 py-3 rounded hover:bg-secondary-accent transition-colors whitespace-nowrap">Notify Me</button>
                            </form>
                        }
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default BookDetail;
