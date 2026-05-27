import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const { data } = await api.get('/books');
                setBooks(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBooks();
    }, []);

    return (
        <div className="py-12 max-w-6xl mx-auto px-4">
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-heading text-primary-accent mb-4 text-center"
            >
                Books and Publications
            </motion.h1>
            <p className="text-center text-muted-text mb-12 max-w-2xl mx-auto leading-relaxed">
                The books below showcase Van Gleeson's published and upcoming texts on masculinity. The works explore in-depth analysis, historical perspective, and essential conversations on male identity. Each work is highlighted with extensive discussions ranging across cultures to provide a fresh, multi-faceted view.
            </p>

            {loading ? (
                <p className="text-center text-muted-text">Loading books...</p>
            ) : (
                <div>
                    {books.length === 0 ? (
                        <p className="text-center text-muted-text bg-card-bg p-8 rounded-lg border border-border shadow-lg">No books found in the catalog yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                            {books.map((book, idx) => (
                                <motion.div
                                    key={book._id || idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="group flex flex-col bg-card-bg rounded-lg border border-border hover:border-primary-accent hover:shadow-xl transition-all duration-300 overflow-hidden cursor-pointer h-full"
                                >
                                    {/* Book Cover */}
                                    <div className="w-full aspect-[3/4] bg-secondary-bg flex items-center justify-center overflow-hidden relative">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async" />
                                        ) : (
                                            <span className="text-muted-text italic text-center px-4 font-bold text-sm tracking-widest uppercase">Draft Cover<br /><br />{book.title}</span>
                                        )}
                                    </div>

                                    {/* Book Info */}
                                    <div className="p-6 flex flex-col flex-grow">
                                        <h2 className="text-xl font-heading text-primary-text mb-3 line-clamp-2">{book.title}</h2>
                                        
                                        {/* Genre and Status Tags */}
                                        <div className="flex gap-2 mb-4 flex-wrap">
                                            <span className="px-2 py-1 bg-secondary-bg text-xs text-secondary-accent uppercase tracking-wider rounded">{book.genre}</span>
                                            <span className="px-2 py-1 bg-secondary-bg text-xs text-primary-accent uppercase tracking-wider rounded">{book.status}</span>
                                        </div>

                                        {/* Pricing Badge */}
                                        <div className="mb-4">
                                            {book.isFree ? (
                                                <span className="inline-block px-3 py-1 bg-green-500/20 text-xs text-green-500 uppercase tracking-wider rounded font-bold">Free</span>
                                            ) : book.isForSale ? (
                                                <span className="inline-block px-3 py-1 bg-blue-500/20 text-xs text-blue-500 uppercase tracking-wider rounded font-bold">${book.price}</span>
                                            ) : (
                                                <span className="inline-block px-3 py-1 bg-secondary-bg text-xs text-muted-text uppercase tracking-wider rounded">Not Available</span>
                                            )}
                                        </div>

                                        {/* Synopsis */}
                                        <p className="text-sm text-muted-text mb-6 leading-relaxed flex-grow line-clamp-3">{book.synopsis}</p>

                                        {/* Notification Form */}
                                        <form className="flex gap-2 mt-auto">
                                            <input 
                                                type="email" 
                                                placeholder="Email" 
                                                required 
                                                className="flex-1 bg-secondary-bg border border-border rounded px-3 py-2 text-sm text-primary-text placeholder-muted-text focus:outline-none focus:border-primary-accent transition-colors" 
                                            />
                                            <button 
                                                type="submit" 
                                                className="bg-primary-accent text-primary-bg font-bold px-4 py-2 rounded text-sm hover:bg-secondary-accent transition-colors whitespace-nowrap"
                                            >
                                                Notify
                                            </button>
                                        </form>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};
export default Books;
