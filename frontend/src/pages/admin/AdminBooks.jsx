import { useState, useEffect } from 'react';
import api from '../../services/api';

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    // Using string default flags to handle HTML checkbox changes easier, or booleans
    const [formData, setFormData] = useState({
        title: '',
        synopsis: '',
        genre: 'Personal Development',
        audience: 'Young Men',
        status: 'Writing',
        price: 0,
        isForSale: false,
        isFree: false
    });
    const [file, setFile] = useState(null);

    const fetchBooks = async () => {
        try {
            const { data } = await api.get('/books');
            setBooks(data);
        } catch {
            console.error('Failed to fetch books');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        fetchBooks();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let coverImage = '';
            if (file) {
                const uploadData = new FormData();
                uploadData.append('image', file);
                const uploadRes = await api.post('/books/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                coverImage = uploadRes.data.imageUrl;
            }

            const bookData = { ...formData };
            if (coverImage) bookData.coverImage = coverImage;

            await api.post('/books', bookData);
            setShowForm(false);
            setFormData({ title: '', synopsis: '', genre: 'Personal Development', audience: 'Young Men', status: 'Writing', price: 0, isForSale: false, isFree: false });
            setFile(null);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create book');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks();
        } catch {
            alert('Failed to delete book');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading text-primary-accent">Manage Books</h1>
                <button onClick={() => setShowForm(!showForm)} className="bg-primary-accent text-primary-bg px-4 py-2 rounded font-bold hover:bg-secondary-accent transition">
                    {showForm ? 'Cancel' : '+ Add Book'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card-bg p-6 text-primary-text rounded-lg border border-border mb-8 space-y-4 shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Title</label>
                            <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Status</label>
                            <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent">
                                <option>Writing</option>
                                <option>Editing</option>
                                <option>Seeking Publisher</option>
                                <option>Published</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Synopsis</label>
                        <textarea required value={formData.synopsis} onChange={e => setFormData({ ...formData, synopsis: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent resize-none" rows="3"></textarea>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Genre</label>
                            <input type="text" value={formData.genre} onChange={e => setFormData({ ...formData, genre: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">Target Audience</label>
                            <input type="text" value={formData.audience} onChange={e => setFormData({ ...formData, audience: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-border p-4 rounded bg-secondary-bg/30">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Price ($)</label>
                            <input type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent" />
                        </div>
                        <div className="flex items-center gap-3 md:mt-7">
                            <input type="checkbox" checked={formData.isForSale} onChange={e => setFormData({ ...formData, isForSale: e.target.checked })} className="w-5 h-5 accent-primary-accent" />
                            <label className="text-sm font-semibold">Is For Sale?</label>
                        </div>
                        <div className="flex items-center gap-3 md:mt-7">
                            <input type="checkbox" checked={formData.isFree} onChange={e => setFormData({ ...formData, isFree: e.target.checked })} className="w-5 h-5 accent-primary-accent" />
                            <label className="text-sm font-semibold">Is Free (Giveaway)?</label>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Cover Image (Upload via Cloudinary)</label>
                        <input type="file" accept="image/*" onChange={e => setFile(e.target.files[0])} className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent text-sm" />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="bg-primary-accent text-primary-bg px-6 py-2 rounded font-bold hover:bg-secondary-accent transition">Save Book</button>
                    </div>
                </form>
            )}

            {loading ? <p className="text-muted-text">Loading books...</p> : (
                <div className="grid gap-4">
                    {books.length === 0 && !showForm && (
                        <div className="bg-secondary-bg/50 border border-dashed border-border p-8 text-center rounded-lg">
                            <p className="text-muted-text">No books found. Add one to get started.</p>
                        </div>
                    )}
                    {books.map(book => (
                        <div key={book._id} className="bg-card-bg p-4 rounded-lg border border-border flex justify-between items-center transition hover:border-primary-accent">
                            <div className="flex gap-4 items-center">
                                {book.coverImage ? (
                                    <img src={book.coverImage} alt={book.title} className="w-12 h-16 object-cover rounded bg-secondary-bg" loading="lazy" decoding="async" />
                                ) : (
                                    <div className="w-12 h-16 bg-secondary-bg rounded flex items-center justify-center text-[10px] text-muted-text uppercase font-bold tracking-wider">Cover</div>
                                )}
                                <div>
                                    <h3 className="font-bold text-lg text-primary-text">{book.title}</h3>
                                    <p className="text-secondary-accent text-sm mt-1">
                                        {book.status} &bull; {book.isFree ? 'Free' : (book.isForSale ? `$${book.price}` : 'Not for sale')}
                                    </p>
                                </div>
                            </div>
                            <button onClick={() => handleDelete(book._id)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 font-semibold px-4 py-2 border border-red-500/30 rounded transition duration-200">Delete</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBooks;
