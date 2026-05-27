import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import Navbar from './components/organisms/Navbar';
import Footer from './components/organisms/Footer';
import SEOHead from './components/SEOHead';
import { SkipToMainContent, useAccessibilityFocus } from './utils/accessibility.jsx';
import useAnalytics from './hooks/useAnalytics';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Books from './pages/Books';
import BookDetail from './pages/BookDetail';
import BruceLeeDiaries from './pages/BruceLeeDiaries';
import Contact from './pages/Contact';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Account from './pages/Account';
import SearchResults from './pages/SearchResults';

import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProjects from './pages/admin/AdminProjects';
import AdminBlog from './pages/admin/AdminBlog';
import AdminContacts from './pages/admin/AdminContacts';
import AdminBooks from './pages/admin/AdminBooks';
import AdminSettings from './pages/admin/AdminSettings';

// Loading fallback
const LoadingFallback = () => (
    <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-accent"></div>
    </div>
);

function App() {
    // Enable accessibility focus styles
    useAccessibilityFocus();
    // Lightweight analytics: send pageview events on route changes
    useAnalytics();

    return (
        <div className="flex flex-col min-h-screen">
            <SEOHead />
            <SkipToMainContent />
            <Navbar />
            <main id="main-content" className="flex-grow container mx-auto px-4 py-8 flex flex-col">
                <Suspense fallback={<LoadingFallback />}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/projects" element={<Projects />} />
                        <Route path="/blog" element={<Blog />} />
                        <Route path="/blog/:slug" element={<BlogPost />} />
                        <Route path="/books" element={<Books />} />
                        <Route path="/books/:slug" element={<BookDetail />} />
                        <Route path="/bruce-lee-diaries" element={<BruceLeeDiaries />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/search" element={<SearchResults />} />

                        {/* Public Auth Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/account" element={<Account />} />

                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<AdminLogin />} />
                        <Route path="/admin" element={<AdminLayout />}>
                            <Route index element={<AdminDashboard />} />
                            <Route path="projects" element={<AdminProjects />} />
                            <Route path="books" element={<AdminBooks />} />
                            <Route path="blog" element={<AdminBlog />} />
                            <Route path="contacts" element={<AdminContacts />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>

                        <Route 
                            path="*" 
                            element={
                                <div className="text-center py-20 m-auto">
                                    <h1 className="text-4xl text-primary-accent mb-4">Page Not Found</h1>
                                    <p className="text-muted-text">This page does not exist.</p>
                                </div>
                            } 
                        />
                    </Routes>
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;
