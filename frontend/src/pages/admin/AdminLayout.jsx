import { Outlet, Navigate, Link, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const navigate = useNavigate();

    if (!userInfo || userInfo.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    const logout = () => {
        localStorage.removeItem('userInfo');
        navigate('/admin/login');
    };

    return (
        <div className="flex flex-col md:flex-row min-h-[80vh] bg-primary-bg text-primary-text border border-border rounded-lg overflow-hidden shadow-2xl">
            <aside className="w-full md:w-64 bg-secondary-bg border-r border-border flex flex-col">
                <div className="p-6">
                    <h2 className="text-2xl font-heading text-primary-accent font-bold">Admin Portal</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                    <Link to="/" className="block px-4 py-2 text-primary-text hover:text-primary-accent transition">&larr; Back to Site</Link>
                    <hr className="border-border my-4" />
                    <Link to="/admin" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Overview</Link>
                    <Link to="/admin/projects" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Projects</Link>
                    <Link to="/admin/books" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Books Catalog</Link>
                    <Link to="/admin/blog" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Blog Posts</Link>
                    <Link to="/admin/contacts" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Messages</Link>
                    <Link to="/admin/settings" className="block px-4 py-2 text-primary-text hover:bg-card-bg rounded transition border border-transparent hover:border-border">Site Settings</Link>
                </nav>
                <div className="p-6 border-t border-border mt-auto">
                    <button onClick={logout} className="w-full bg-card-bg border border-border font-bold text-primary-text py-3 rounded hover:bg-secondary-bg transition">
                        Logout
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto bg-primary-bg p-8">
                <Outlet />
            </main>
        </div>
    );
};
export default AdminLayout;
