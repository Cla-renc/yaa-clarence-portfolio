import { useState, useEffect, useRef } from 'react';
import api from '../../services/api';

/* ─── Minimal Rich Text Toolbar ─────────────────────────────── */
const RichEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);

    // Sync external value into editor only on first mount
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value || '';
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const exec = (cmd, arg = null) => {
        editorRef.current?.focus();
        document.execCommand(cmd, false, arg);
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML || '');
    };

    const toolbarBtn = (label, cmd, arg) => (
        <button
            type="button"
            onMouseDown={(e) => { e.preventDefault(); exec(cmd, arg); }}
            className="px-2 py-1 bg-secondary-bg border border-border rounded text-primary-text hover:bg-primary-accent hover:text-primary-bg transition text-sm font-bold"
            title={label}
        >
            {label}
        </button>
    );

    return (
        <div className="border border-border rounded overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-1 p-2 bg-secondary-bg border-b border-border">
                {toolbarBtn('B', 'bold')}
                {toolbarBtn('I', 'italic')}
                {toolbarBtn('U', 'underline')}
                {toolbarBtn('H2', 'formatBlock', 'h2')}
                {toolbarBtn('H3', 'formatBlock', 'h3')}
                {toolbarBtn('¶', 'formatBlock', 'p')}
                {toolbarBtn('• List', 'insertUnorderedList')}
                {toolbarBtn('1. List', 'insertOrderedList')}
                {toolbarBtn('Link', 'createLink', prompt('URL:') || '')}
                {toolbarBtn('Clear', 'removeFormat')}
            </div>
            {/* Editable area */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                className="min-h-64 p-4 bg-white text-black focus:outline-none text-sm leading-relaxed"
                style={{ minHeight: '260px' }}
            />
        </div>
    );
};

/* ─── Admin Blog Component ───────────────────────────────────── */
const AdminBlog = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({ title: '', excerpt: '', content: '', externalMediaUrl: '' });
    const [mediaFile, setMediaFile] = useState(null);
    const [mediaPreview, setMediaPreview] = useState('');
    const [mediaType, setMediaType] = useState('image');

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

    // eslint-disable-next-line react-hooks/set-state-in-effect
    useEffect(() => { fetchPosts(); }, []);

    useEffect(() => {
        return () => {
            if (mediaPreview && mediaPreview.startsWith('blob:')) {
                URL.revokeObjectURL(mediaPreview);
            }
        };
    }, [mediaPreview]);

    const resolveMediaType = (url) => {
        if (/tiktok\.com|youtube\.com|youtu\.be|vimeo\.com/i.test(url)) return 'video';
        return /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url) ? 'video' : 'image';
    };

    const isDirectVideoUrl = (url) => /\.(mp4|webm|mov|avi|mkv)(\?|$)/i.test(url);

    const handleMediaFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const previewUrl = URL.createObjectURL(file);
        setMediaFile(file);
        setMediaPreview(previewUrl);
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
        setFormData(prev => ({ ...prev, externalMediaUrl: '' }));
    };

    const handleExternalMediaUrlChange = (e) => {
        const url = e.target.value;
        setFormData(prev => ({ ...prev, externalMediaUrl: url }));
        setMediaFile(null);
        setMediaPreview(url);
        setMediaType(resolveMediaType(url));
    };

    const resetForm = () => {
        setFormData({ title: '', excerpt: '', content: '', externalMediaUrl: '' });
        setMediaFile(null);
        setMediaPreview('');
        setMediaType('image');
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            let uploadedMediaUrl = '';
            if (mediaFile) {
                const uploadData = new FormData();
                uploadData.append('image', mediaFile);
                const uploadRes = await api.post('/blog/upload', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                uploadedMediaUrl = uploadRes.data.imageUrl;
            }

            const postData = {
                title: formData.title,
                excerpt: formData.excerpt,
                content: formData.content,
            };

            if (uploadedMediaUrl) {
                postData.mediaUrl = uploadedMediaUrl;
                postData.mediaType = mediaType;
            } else if (formData.externalMediaUrl) {
                postData.mediaUrl = formData.externalMediaUrl;
                postData.mediaType = mediaType;
            }

            await api.post('/blog', postData);
            resetForm();
            fetchPosts();
        } catch (err) {
            alert(err.response?.data?.message || 'Error occurred while saving blog post');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog post?')) return;
        try {
            await api.delete(`/blog/${id}`);
            fetchPosts();
        } catch (err) {
            console.error(err);
            alert('Failed to delete blog post');
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-heading text-primary-accent">Manage Blog Posts</h1>
                <button
                    onClick={() => setShowForm(prev => !prev)}
                    className="bg-primary-accent text-primary-bg px-4 py-2 rounded font-bold hover:bg-secondary-accent transition"
                >
                    {showForm ? 'Cancel' : '+ New Post'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} className="bg-card-bg p-6 rounded-lg border border-border mb-8 space-y-4 text-primary-text shadow-lg">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Title</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-1">Excerpt</label>
                        <input
                            type="text"
                            required
                            value={formData.excerpt}
                            onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                            className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2">Content</label>
                        <RichEditor
                            value={formData.content}
                            onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-1">Upload Image or Video</label>
                            <input
                                type="file"
                                accept="image/*,video/*"
                                onChange={handleMediaFileChange}
                                className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold mb-1">External media link (TikTok / Reels / YouTube)</label>
                            <input
                                type="url"
                                value={formData.externalMediaUrl}
                                onChange={handleExternalMediaUrlChange}
                                placeholder="https://"
                                className="w-full bg-secondary-bg border border-border rounded p-2 focus:outline-none focus:border-primary-accent text-sm"
                            />
                        </div>
                    </div>

                    {/* Post Preview */}
                    <div className="border border-border rounded-3xl p-4 bg-secondary-bg/80">
                        <p className="text-xs font-bold uppercase tracking-widest text-muted-text mb-3">Post Preview</p>
                        <div className="max-w-md mx-auto bg-white rounded-3xl border border-border shadow-lg overflow-hidden">
                            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-border">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary-accent text-white flex items-center justify-center font-bold">YC</div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">Yaa Clarence</p>
                                        <p className="text-xs text-slate-500">Just now · Public</p>
                                    </div>
                                </div>
                                <div className="text-slate-400 text-xl">⋯</div>
                            </div>
                            <div className="px-4 py-4 space-y-4">
                                <div className="space-y-2">
                                    <p className="text-base font-semibold text-slate-900 line-clamp-2">{formData.title || 'Post title preview'}</p>
                                    <p className="text-sm text-slate-600">{formData.excerpt || 'Excerpt preview will show here when you type it.'}</p>
                                </div>
                                <div
                                    className="rounded-3xl bg-slate-50 p-4 text-slate-700 text-sm leading-relaxed"
                                    dangerouslySetInnerHTML={{ __html: formData.content || '<em>Content preview will appear here when you type it.</em>' }}
                                />
                            </div>
                            <div className="bg-slate-100 border-t border-border">
                                <div className="w-full min-h-16 bg-slate-200 flex items-center justify-center overflow-hidden">
                                    {mediaPreview ? (
                                        mediaType === 'video' ? (
                                            isDirectVideoUrl(mediaPreview) ? (
                                                <video controls className="w-full h-full object-cover">
                                                    <source src={mediaPreview} />
                                                </video>
                                            ) : (
                                                <div className="text-slate-500 text-center px-4 py-4 text-sm">
                                                    External video link detected. Preview after publish.
                                                </div>
                                            )
                                        ) : (
                                            <img src={mediaPreview} alt="media preview" className="w-full h-full object-cover" />
                                        )
                                    ) : (
                                        <div className="text-slate-400 text-sm py-6">Image/video preview will appear here</div>
                                    )}
                                </div>
                            </div>
                            <div className="px-4 py-3 border-t border-border bg-slate-50">
                                <div className="flex items-center justify-between text-slate-500 text-xs">
                                    <span>👍 Like</span>
                                    <span>💬 Comment</span>
                                    <span>↗ Share</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-2 flex gap-3">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="bg-primary-accent text-primary-bg px-6 py-2 rounded font-bold hover:bg-secondary-accent transition disabled:opacity-60"
                        >
                            {submitting ? 'Publishing...' : 'Publish Post'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="border border-border text-muted-text px-6 py-2 rounded font-bold hover:bg-secondary-bg transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            {loading ? <p className="text-muted-text">Loading...</p> : (
                <div className="grid gap-4">
                    {posts.length === 0 && !showForm && (
                        <div className="bg-secondary-bg/50 border border-dashed border-border p-8 text-center rounded-lg">
                            <p className="text-muted-text">No blog posts found. Time to write some wisdom!</p>
                        </div>
                    )}
                    {posts.map(post => (
                        <div key={post._id} className="bg-card-bg p-4 rounded-lg border border-border flex justify-between items-center transition hover:border-primary-accent">
                            <div>
                                <h3 className="font-bold text-xl text-primary-text">{post.title}</h3>
                                <p className="text-sm text-secondary-accent mt-1">{new Date(post.createdAt).toLocaleDateString()}</p>
                            </div>
                            <button
                                onClick={() => handleDelete(post._id)}
                                className="text-red-500 hover:text-red-400 hover:bg-red-500/10 border border-red-500/30 px-4 py-2 rounded text-sm font-semibold transition"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminBlog;
