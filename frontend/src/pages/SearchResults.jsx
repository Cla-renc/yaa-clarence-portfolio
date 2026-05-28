import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    
    const [results, setResults] = useState({ books: [], blogs: [], projects: [] });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            if (!query) {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError('');
            try {
                const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
                setResults(data);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch search results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [query]);

    const totalResults = results.books.length + results.blogs.length + results.projects.length;

    return (
        <div className="max-w-4xl mx-auto w-full py-16 px-4">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <h1 className="text-3xl md:text-4xl font-heading text-primary-accent mb-2">Search Results</h1>
                <p className="text-muted-text mb-10 text-lg">
                    {query ? `Showing results for "${query}"` : 'Enter a search query to begin.'}
                </p>

                {loading && <div className="text-primary-text font-bold">Searching...</div>}
                
                {error && <div className="text-red-500">{error}</div>}

                {!loading && !error && query && totalResults === 0 && (
                    <div className="bg-card-bg p-8 text-center text-muted-text rounded-xl border border-border">
                        No results found across books, blogs, or projects.
                    </div>
                )}

                {!loading && !error && totalResults > 0 && (
                    <div className="space-y-12">
                        {/* Books */}
                        {results.books.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-heading text-primary-text mb-6 border-b border-border pb-2">Books ({results.books.length})</h2>
                                <div className="grid gap-4">
                                    {results.books.map(book => (
                                        <Link to={`/books/${book.slug || book._id}`} key={book._id} className="block bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors">
                                            <h3 className="text-xl font-bold text-primary-text mb-2">{book.title}</h3>
                                            <p className="text-sm text-muted-text line-clamp-2">{book.synopsis}</p>
                                            <span className="inline-block mt-3 px-2 py-1 bg-secondary-bg text-secondary-accent text-xs uppercase tracking-wider rounded">{book.genre}</span>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Blogs */}
                        {results.blogs.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-heading text-primary-text mb-6 border-b border-border pb-2">Blog Posts ({results.blogs.length})</h2>
                                <div className="grid gap-4">
                                    {results.blogs.map(blog => (
                                        <Link to={`/blog/${blog.slug}`} key={blog._id} className="block bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors">
                                            <h3 className="text-xl font-bold text-primary-text mb-2">{blog.title}</h3>
                                            <p className="text-sm text-muted-text line-clamp-2">{blog.excerpt}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Projects */}
                        {results.projects.length > 0 && (
                            <section>
                                <h2 className="text-2xl font-heading text-primary-text mb-6 border-b border-border pb-2">Projects ({results.projects.length})</h2>
                                <div className="grid gap-4">
                                    {results.projects.map(project => (
                                        <Link to={`/projects`} key={project._id} className="block bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors">
                                            <h3 className="text-xl font-bold text-primary-text mb-2">{project.title}</h3>
                                            <p className="text-sm text-muted-text line-clamp-2">{project.description}</p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default SearchResults;
