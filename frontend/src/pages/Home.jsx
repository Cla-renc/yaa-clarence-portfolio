import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, animate, useInView } from 'framer-motion';
import { BookOpenText } from '@phosphor-icons/react';
import { FacebookIcon, InstagramIcon, TikTokIcon, XIcon, YouTubeIcon, LinkedInIcon, EmailIcon, PhoneIcon, LocationIcon } from '../components/atoms/BrandIcons';
import api from '../services/api';
import SearchBar from '../components/molecules/SearchBar';
import {
  buttonHover,
  buttonScale,
  iconHover,
} from '../utils/animations';

const defaultAbout = {
    heading: '4.2 About Yaa Clarence',
    title: 'The Architect Behind the Brand',
    intro: 'I am a fourth-year Information Technology student on attachment at the Kenya Methodist University (KEMU) ICT Department. My academic background combines software engineering with a deep passion for personal development and brand building.',
    paragraph1: 'Through the Bruce Lee Discipline Diaries, I curate wisdom around masculinity, discipline and growth. My upcoming books seek to define and explore modern male identity.',
    paragraph2: 'This portfolio is the digital home for my technical work, brand strategy, and authorship journey. It is designed to present my skills, values, and creative vision in one cohesive experience.',
    skills: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Python', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Leadership', 'Authorship', 'Brand Strategy'],
    stats: [
        { label: 'Years Dev', value: '3+' },
        { label: 'Projects', value: '12' },
        { label: 'Books Drafted', value: '2' },
        { label: 'Brand Followers', value: '9000+' }
    ]
};

/* ─── Utility: Animated Counter ─────────────────────────────────────────── */
const Counter = ({ from, to }) => {
    const nodeRef = useRef();
    const inView = useInView(nodeRef, { once: true });
    useEffect(() => {
        if (inView) {
            const controls = animate(from, to, {
                duration: 2.5,
                onUpdate(value) {
                    if (nodeRef.current) nodeRef.current.textContent = Math.round(value);
                }
            });
            return () => controls.stop();
        }
    }, [from, to, inView]);
    return <span ref={nodeRef} />;
};

/* ─── Section: Hero ──────────────────────────────────────────────────────── */
const HeroSection = ({ bgY, aboutData }) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const isAdmin = userInfo && userInfo.role === 'admin';

    const handleHeroPhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newPhoto = reader.result;
                try {
                    await api.put('/site-config/about', {
                        value: { ...aboutData, heroPhoto: newPhoto },
                        type: 'object'
                    });
                    window.location.reload();
                } catch (err) {
                    console.error('Failed to update photo', err);
                    alert('Failed to upload photo');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <section
            id="hero"
            className="relative min-h-[85vh] w-[100vw] ml-[calc(-50vw+50%)] overflow-hidden flex flex-col justify-center bg-primary-bg"
        >
            {/* Subtle background gradient */}
            <motion.div
                style={{ y: bgY }}
                className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary-accent/5 via-secondary-bg/40 to-primary-bg pointer-events-none"
            />

            {/* Main content: two-column split */}
            <div className="relative z-10 max-w-7xl mx-auto w-full px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row items-end justify-between gap-8 py-16 md:py-0 md:min-h-[85vh]">

                {/* ── LEFT: Profile Photo (no card/bg, blends with theme) ── */}
                <motion.div
                    className="relative flex-shrink-0 w-[240px] sm:w-[280px] md:w-[320px] lg:w-[360px] xl:w-[380px] self-end md:pb-24"
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                >
                    {/* Photo — no border/card, transparent background */}
                    <div
                        className={`relative overflow-hidden group ${
                            isAdmin ? 'cursor-pointer' : ''
                        }`}
                        style={{ aspectRatio: '6/5' }}
                    >
                        {isAdmin && (
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleHeroPhotoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-30 w-full h-full"
                                title="Upload Hero Photo"
                            />
                        )}

                        {aboutData?.heroPhoto || aboutData?.profilePhoto ? (
                            <img
                                src={aboutData.heroPhoto || aboutData.profilePhoto}
                                alt="Yaa Clarence"
                                className="w-full h-full object-cover object-top"
                                style={{ mixBlendMode: 'normal' }}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-12">
                                <span className="text-7xl font-black text-primary-accent mb-3">Y.C.</span>
                                {isAdmin && (
                                    <span className="text-xs font-bold uppercase tracking-widest text-muted-text px-4 text-center">
                                        Click to Upload Photo
                                    </span>
                                )}
                            </div>
                        )}

                        {/* Admin hover overlay */}
                        {isAdmin && (
                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center z-20 pointer-events-none transition-all">
                                <span className="text-white text-sm font-bold uppercase tracking-widest">📷 Click to Upload</span>
                            </div>
                        )}
                    </div>

                    {/* Name banner — centered, slightly below hand/watch */}
                    <motion.div
                        className="absolute left-1/2 -translate-x-1/2 bg-primary-accent px-6 py-2.5 shadow-lg z-20 whitespace-nowrap"
                        style={{ top: '65%' }}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7, delay: 0.8 }}
                    >
                        <h1 className="font-heading font-black text-primary-bg tracking-wide
                            text-[18px] sm:text-[20px] md:text-[22px] lg:text-[24px] whitespace-nowrap"
                        >
                            Yaa Clarence
                        </h1>
                    </motion.div>
                </motion.div>

                {/* ── RIGHT: Tagline & CTAs ── */}
                <motion.div
                    className="flex flex-col items-center md:items-start text-center md:text-left flex-1 max-w-xl md:pb-24"
                    initial={{ opacity: 0, x: 60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
                >
                    {/* Role badge */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.5 }}
                        className="text-primary-accent font-bold tracking-[0.2em] uppercase mb-4
                            text-[11px] sm:text-[12px] md:text-[13px]"
                    >
                        IT Student &bull; Author &bull; Brand Owner
                    </motion.div>

                    {/* Main heading */}
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        style={{ fontWeight: 800 }}
                        className="font-heading text-primary-text leading-[1.1] mb-5 drop-shadow-lg
                            text-[30px] sm:text-[36px] md:text-[42px] lg:text-[52px] xl:text-[58px]"
                    >
                        Warrior Scholar
                    </motion.h2>

                    {/* Subtitle */}
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.8 }}
                        className="text-muted-text mb-10 leading-relaxed
                            text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]"
                    >
                        From conditioned to conscious manhood — building discipline, identity, and purpose through authorship and technology.
                    </motion.p>

                    {/* CTA Buttons */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.0 }}
                        className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
                    >
                        <motion.a
                            href="#books"
                            {...buttonHover}
                            className="bg-primary-accent text-primary-bg rounded font-bold hover:bg-secondary-accent uppercase tracking-wider shadow-lg flex items-center justify-center
                                text-[13px] h-11 px-7
                                md:text-[14px] md:h-12 md:px-9"
                        >
                            View My Work
                        </motion.a>
                        <motion.a
                            href="#contact"
                            {...buttonHover}
                            className="border-2 border-primary-accent text-primary-accent rounded font-bold hover:bg-primary-accent hover:text-primary-bg uppercase tracking-wider shadow-lg flex items-center justify-center
                                text-[13px] h-11 px-7
                                md:text-[14px] md:h-12 md:px-9"
                        >
                            Get in Touch
                        </motion.a>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <motion.a
                href="#about"
                animate={{ y: [0, 12, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute bottom-8 left-1/2 -translate-x-1/2 text-primary-accent text-3xl z-10"
            >
                ↓
            </motion.a>
        </section>
    );
};

/* ─── Section: About ─────────────────────────────────────────────────────── */
const AboutSection = ({ aboutData = defaultAbout }) => {
    const skills = aboutData.skills?.length ? aboutData.skills : ['React.js', 'Node.js', 'MongoDB', 'Express', 'Python', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Leadership', 'Authorship', 'Brand Strategy'];
    const stats = aboutData.stats?.length ? aboutData.stats : [
        { label: 'Years Dev', value: '3+' },
        { label: 'Projects', value: '12' },
        { label: 'Books Drafted', value: '2' },
        { label: 'Brand Followers', value: '9000+' },
    ];
    
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
    const isAdmin = userInfo && userInfo.role === 'admin';

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const newPhoto = reader.result;
                try {
                    await api.put('/site-config/about', { 
                        value: { ...aboutData, profilePhoto: newPhoto }, 
                        type: 'object' 
                    });
                    window.location.reload();
                } catch (err) {
                    console.error('Failed to update photo', err);
                    alert('Failed to upload photo');
                }
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <motion.section
            id="about"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="py-24 px-4 max-w-6xl mx-auto w-full scroll-mt-20"
        >
            <h2 className="text-3xl md:text-4xl font-heading text-primary-accent mb-12 text-center">{aboutData.heading}</h2>

            {/* Two-column 40/60 on desktop, stacked on tablet/mobile */}
            <div className="flex flex-col md:flex-row gap-10 bg-card-bg p-6 md:p-10 rounded-2xl border border-border shadow-2xl">

                {/* LEFT COLUMN - 40% - Photo + Social */}
                <div className="flex flex-col items-center md:items-start md:w-[40%] shrink-0">
                    {/* Photo: natural height based on width */}
                    <div className={`
                        w-[160px] sm:w-[200px] md:w-[240px]
                        min-h-[200px] sm:min-h-[250px] md:min-h-[300px] h-auto
                        bg-secondary-bg rounded-lg overflow-hidden border border-border shadow-md
                        flex items-center justify-center mb-6 mx-auto md:mx-0
                        relative ${isAdmin ? 'cursor-pointer group' : ''}
                    `}>
                        {isAdmin && (
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-20"
                                title="Upload Profile Photo"
                            />
                        )}
                        {aboutData.profilePhoto ? (
                            <img src={aboutData.profilePhoto} alt="Profile" className="w-full h-auto relative z-10 block" />
                        ) : (
                            <div className="absolute inset-0 bg-gradient-to-tr from-card-bg to-secondary-bg flex flex-col items-center justify-center text-muted-text z-10">
                                <span className="text-5xl font-black text-primary-accent mb-2">Y.C.</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-center px-2">Profile Photo</span>
                            </div>
                        )}
                        {isAdmin && (
                            <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center z-30 transition-all pointer-events-none">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Click to Upload</span>
                            </div>
                        )}
                    </div>

                    {/* Social Icons */}
                    <div className="flex flex-wrap gap-3 mx-auto md:mx-0">
                        <a href="#" aria-label="Facebook" className="p-2.5 bg-secondary-bg rounded-lg border border-border text-[#1877F2] hover:text-white hover:bg-[#1877F2] transition-colors"><FacebookIcon size={18} /></a>
                        <a href="#" aria-label="TikTok" className="p-2.5 bg-secondary-bg rounded-lg border border-border text-[#000000] hover:text-white hover:bg-[#000000] transition-colors"><TikTokIcon size={18} /></a>
                    </div>
                </div>

                {/* RIGHT COLUMN - 60% - Bio, Skills, Stats */}
                <div className="flex flex-col flex-1">
                    <h3 className="font-heading text-primary-text mb-4 leading-tight
                        text-[22px] sm:text-[26px] md:text-[28px]">{aboutData.title}</h3>

                    {/* Bio text: 14-15px mobile, 15-16px tablet, 16-18px desktop */}
                    <p className="text-primary-text leading-relaxed mb-3
                        text-[14px] sm:text-[15px] md:text-[16px] lg:text-[17px]">
                        {aboutData.intro}
                    </p>
                    <p className="text-muted-text leading-relaxed mb-6
                        text-[14px] sm:text-[15px] md:text-[16px]">
                        {aboutData.paragraph1}
                    </p>
                    <p className="text-muted-text leading-relaxed mb-6
                        text-[14px] sm:text-[15px] md:text-[16px]">
                        {aboutData.paragraph2}
                    </p>

                    {/* Skill Tags - Inline pills */}
                    <motion.div
                        className="mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                    delayChildren: 0.2,
                                },
                            },
                        }}
                    >
                        <span className="block text-xs font-bold text-muted-text uppercase tracking-widest mb-3">Skills &amp; Technologies</span>
                        <div className="flex flex-wrap gap-2">
                            {skills.map(skill => (
                                <motion.span
                                    key={skill}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0.8 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    className="px-3 py-1 bg-primary-accent/10 text-primary-accent text-xs font-semibold rounded-full border border-primary-accent/30 hover:bg-primary-accent hover:text-primary-bg transition-colors cursor-default"
                                >
                                    {skill}
                                </motion.span>
                            ))}
                        </div>
                    </motion.div>

                    {/* Stats: horizontal row desktop/tablet, 2x2 grid mobile */}
                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {stats.map((s) => (
                            <motion.div
                                key={s.label}
                                variants={{
                                    hidden: { opacity: 0, y: 20 },
                                    visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
                                }}
                                whileHover={{ scale: 1.05, borderColor: 'var(--primary-accent)' }}
                                className="text-center p-3 bg-secondary-bg/60 rounded-lg border border-border hover:border-primary-accent transition-all"
                            >
                                <span className="block text-2xl md:text-3xl font-black text-primary-accent mb-1">{s.value}</span>
                                <span className="text-[10px] text-muted-text font-bold uppercase tracking-widest">{s.label}</span>
                            </motion.div>
                        ))}
                    </motion.div>

                    <div className="flex gap-4 mt-auto border-t border-border pt-5">
                        <a href="#bldd" className="text-primary-accent hover:underline font-bold text-sm inline-flex items-center gap-1 tracking-wide uppercase">Explore BLDD →</a>
                        <span className="text-border">|</span>
                        <a href="#contact" className="text-primary-accent hover:underline font-bold text-sm inline-flex items-center gap-1 tracking-wide uppercase">Contact →</a>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};


/* ─── Section: Books ─────────────────────────────────────────────────────── */
const BookCard = ({ book, featured = false, delay = 0 }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.3, ease: "easeInOut", delay }}
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(75,47,159,0.15)' }}
        className={`bg-card-bg border border-border overflow-hidden transition-colors hover:border-primary-accent group cursor-pointer ${featured
            ? 'flex flex-col md:flex-row rounded-[8px]'
            : 'flex flex-col rounded-[8px] sm:rounded-[8px] rounded-[6px]'
            }`}
    >
        {/* Cover Image */}
        <motion.div
            className={`relative overflow-hidden flex-shrink-0 ${featured
                ? 'w-full md:w-2/5 h-[160px] sm:h-[180px] md:h-auto md:min-h-[240px]'
                : 'w-full h-[160px] sm:h-[180px] md:h-[200px]'
                }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
        >
            {book.coverImage ? (
                <img src={book.coverImage} alt={book.title} className="w-full h-full object-cover" loading="lazy" decoding="async" />
            ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-primary-accent/20 via-secondary-bg to-card-bg flex flex-col items-center justify-center">
                    <BookOpenText size={48} weight="thin" className="text-primary-accent/40 mb-2" />
                    <span className="text-xs font-bold uppercase tracking-widest text-muted-text">Cover Preview</span>
                </div>
            )}
            {featured && (
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="absolute top-3 left-3 bg-primary-accent text-primary-bg text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded"
                >
                    Featured
                </motion.div>
            )}
        </motion.div>

        {/* Card Content */}
        <div className={`flex flex-col p-5 flex-1 ${featured ? 'md:p-8' : ''}`}>
            <motion.div
                className="flex flex-wrap gap-2 mb-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
            >
                <span className="px-2 py-0.5 bg-secondary-bg text-[10px] text-secondary-accent uppercase tracking-wider rounded">{book.genre}</span>
                <span className="px-2 py-0.5 bg-secondary-bg text-[10px] text-primary-accent uppercase tracking-wider rounded">{book.status}</span>
                {book.isFree
                    ? <span className="px-2 py-0.5 bg-green-500/20 text-[10px] text-green-500 uppercase tracking-wider rounded">Free</span>
                    : book.isForSale
                        ? <span className="px-2 py-0.5 bg-blue-500/20 text-[10px] text-blue-500 uppercase tracking-wider rounded">KES {book.price}</span>
                        : null
                }
            </motion.div>
            <h3 className={`font-heading font-bold text-primary-text group-hover:text-primary-accent transition-colors mb-2 leading-tight ${featured ? 'text-xl md:text-2xl' : 'text-lg'}`}>{book.title}</h3>
            <p className={`text-muted-text leading-relaxed flex-1 ${featured ? 'text-sm md:text-base line-clamp-4' : 'text-sm line-clamp-3'}`}>{book.synopsis}</p>

            <div className="mt-4 border-t border-border pt-4">
                {featured ? (
                    <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                        <motion.input
                            type="email"
                            placeholder="Your email"
                            required
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="flex-1 bg-secondary-bg border border-border rounded p-2.5 text-sm text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                        />
                        <motion.button
                            type="submit"
                            {...buttonScale}
                            className="bg-primary-accent text-primary-bg font-bold px-4 py-2.5 text-sm rounded hover:bg-secondary-accent transition-colors whitespace-nowrap"
                        >
                            Notify Me
                        </motion.button>
                    </form>
                ) : (
                    <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Link to={`/books/${book._id}`} className="text-primary-accent font-bold text-xs uppercase tracking-wider hover:underline inline-block">
                            Learn More →
                        </Link>
                    </motion.div>
                )}
            </div>
        </div>
    </motion.div>
);

const BooksSection = ({ books }) => {
    const featured = books[0];
    const grid = books.slice(1);

    return (
        <section id="books" className="py-24 px-4 bg-secondary-bg/30 w-[100vw] ml-[calc(-50vw+50%)] scroll-mt-20">
            <div className="max-w-6xl mx-auto">
                {/* Section Header */}
                <motion.div
                    className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <div>
                        <h2 className="text-4xl md:text-5xl font-heading text-primary-text mb-2">Books &amp; Publications</h2>
                        <p className="text-muted-text text-lg">Literary works exploring masculinity, discipline &amp; purpose.</p>
                    </div>
                </motion.div>

                {books.length === 0 && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-center text-muted-text bg-card-bg p-8 rounded-lg border border-border shadow-lg"
                    >
                        No books in the catalog yet. Check back soon.
                    </motion.p>
                )}

                {/* Featured Book Highlight (horizontal panel, image left) */}
                {featured && (
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                    >
                        <BookCard book={featured} featured={true} />
                    </motion.div>
                )}

                {/* Book Cards Grid: 3 col desktop, 2 col tablet, 1 col mobile */}
                {grid.length > 0 && (
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {grid.map((book, idx) => (
                            <BookCard key={book._id} book={book} delay={idx * 0.1} />
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
};


/* ─── Section: BLDD ──────────────────────────────────────────────────────── */
const BLDDSection = () => (
    <motion.section
        id="bldd"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="py-24 px-4 max-w-6xl mx-auto w-full scroll-mt-20"
    >
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card-bg via-secondary-bg to-primary-bg border border-border p-12 md:p-20 shadow-[0_0_50px_rgba(75,47,159,0.05)]">
            <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none pointer-events-none">
                <span className="text-[200px] font-heading font-black leading-none">Y.C.</span>
            </div>
            <div className="relative z-10 grid md:grid-cols-2 gap-16 items-center">
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading text-primary-text mb-6 leading-tight">
                        Bruce Lee <br />
                        <span className="text-primary-accent italic">Discipline Diaries</span>
                    </h2>
                    <p className="text-lg md:text-xl text-muted-text mb-6 leading-relaxed">Exploring masculinity, enforcing daily discipline, and mastering the philosophical art of self-control.</p>
                    <motion.div
                        className="bg-card-bg rounded-xl p-6 border border-border mb-8"
                        whileHover={{ borderColor: 'var(--primary-accent)' }}
                        transition={{ duration: 0.3 }}
                    >
                        <blockquote className="text-lg italic text-secondary-accent">"Knowledge will give you power, but character respect."</blockquote>
                        <footer className="mt-3 text-sm font-bold text-primary-text">— Bruce Lee</footer>
                    </motion.div>
                    <motion.a
                        href="#"
                        {...buttonHover}
                        className="inline-block bg-primary-accent text-primary-bg px-10 py-4 text-center rounded font-bold hover:bg-secondary-accent uppercase tracking-widest w-full sm:w-auto"
                    >
                        Follow the Brand
                    </motion.a>
                </motion.div>
                <motion.div
                    className="grid grid-cols-2 gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    <motion.div
                        className="bg-secondary-bg/80 p-8 rounded-xl text-center border border-border shadow-xl hover:-translate-y-1 transition-transform"
                        whileHover={{ y: -4 }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                        }}
                    >
                        <span className="block text-5xl font-black text-primary-accent mb-3"><Counter from={0} to={85} /></span>
                        <span className="text-sm text-muted-text uppercase font-bold tracking-widest">Articles Published</span>
                    </motion.div>
                    <motion.div
                        className="bg-secondary-bg/80 p-8 rounded-xl text-center border border-border shadow-xl hover:-translate-y-1 transition-transform"
                        whileHover={{ y: -4 }}
                        variants={{
                            hidden: { opacity: 0, y: 20 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                        }}
                    >
                        <span className="block text-5xl font-black text-primary-accent mb-3"><Counter from={0} to={9000} /></span>
                        <span className="text-sm text-muted-text uppercase font-bold tracking-widest">Active Readers</span>
                    </motion.div>
                    <motion.div
                        className="col-span-2 grid grid-cols-3 gap-4"
                        variants={{
                            hidden: { opacity: 0 },
                            visible: {
                                opacity: 1,
                                transition: {
                                    staggerChildren: 0.1,
                                },
                            },
                        }}
                    >
                        {['Masculinity', 'Discipline', 'Philosophy'].map(tag => (
                            <motion.div
                                key={tag}
                                className="bg-card-bg p-4 rounded-lg text-center border border-border hover:border-secondary-accent transition"
                                whileHover={{ scale: 1.05 }}
                                variants={{
                                    hidden: { opacity: 0, scale: 0.8 },
                                    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                }}
                            >
                                <span className="text-xs text-secondary-accent uppercase tracking-widest font-bold">{tag}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    </motion.section>
);

/* ─── Section: Blog ──────────────────────────────────────────────────────── */
const BlogSection = ({ posts }) => (
    <section id="blog" className="py-24 px-4 w-[100vw] ml-[calc(-50vw+50%)] bg-secondary-bg/20 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
            <motion.div
                className="flex flex-col sm:flex-row justify-between items-end mb-12 gap-4"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl md:text-5xl font-heading text-primary-text">Latest Intel</h2>
            </motion.div>
            <motion.div
                className="grid md:grid-cols-3 gap-8"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15,
                        },
                    },
                }}
            >
                {posts.length > 0 ? posts.map((post) => (
                    <motion.div
                        key={post._id}
                        variants={{
                            hidden: { opacity: 0, y: 30 },
                            visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
                        }}
                        whileHover={{ y: -4 }}
                        className="bg-card-bg p-8 rounded-xl border border-border hover:border-primary-accent transition-all group cursor-pointer shadow-lg flex flex-col"
                    >
                        <span className="text-xs font-bold text-secondary-accent uppercase tracking-widest block mb-4 border-b border-border pb-4">{new Date(post.createdAt).toLocaleDateString()}</span>
                        <h3 className="text-2xl font-bold text-primary-text mb-4 group-hover:text-primary-accent transition-colors leading-snug line-clamp-2">{post.title}</h3>
                        <p className="text-muted-text text-base line-clamp-3 leading-relaxed flex-1">{post.excerpt}</p>
                        <motion.div
                            className="inline-block mt-6"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                        >
                            <Link to={`/blog/${post.slug || post._id}`} className="text-primary-accent font-bold text-sm uppercase tracking-wide hover:underline">Read →</Link>
                        </motion.div>
                    </motion.div>
                )) : [1, 2, 3].map(i => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ delay: i * 0.15 }}
                        className="bg-card-bg p-12 rounded-xl border border-border text-center text-muted-text italic shadow-inner"
                    >
                        Incoming Article...
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
);

/* ─── Section: Contact ───────────────────────────────────────────────────── */
const ContactSection = ({ socialLinks = {} }) => {
    const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
    const [status, setStatus] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('Sending...');
        try {
            await api.post('/contact', formData);
            setStatus('Message sent!');
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
        } catch {
            setStatus('Failed. Please try again.');
        }
    };

    return (
        <section id="contact" className="py-24 px-4 max-w-6xl mx-auto w-full scroll-mt-20">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl md:text-5xl font-heading text-primary-accent mb-4 text-center">Get in Touch</h2>
                <p className="text-center text-muted-text mb-16">Open to collaborations, speaking engagements, and meaningful connections.</p>
            </motion.div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <motion.form
                    onSubmit={handleSubmit}
                    className="bg-card-bg p-8 flex flex-col rounded-lg shadow-lg border border-border"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-primary-text mb-2">Name</label>
                            <motion.input
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                            />
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.15 }}
                        >
                            <label className="block text-sm font-semibold text-primary-text mb-2">Email</label>
                            <motion.input
                                type="email"
                                required
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                whileFocus={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                                className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                            />
                        </motion.div>
                    </div>
                    <motion.div
                        className="mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <label className="block text-sm font-semibold text-primary-text mb-2">Subject</label>
                        <motion.select
                            value={formData.subject}
                            onChange={e => setFormData({ ...formData, subject: e.target.value })}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors"
                        >
                            <option>General Inquiry</option>
                            <option>Collaboration Opportunity</option>
                            <option>Speaking Engagement</option>
                            <option>Job Opportunity</option>
                            <option>Book Interest</option>
                        </motion.select>
                    </motion.div>
                    <motion.div
                        className="mb-6 flex-1"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.25 }}
                    >
                        <label className="block text-sm font-semibold text-primary-text mb-2">Message</label>
                        <motion.textarea
                            rows="5"
                            required
                            value={formData.message}
                            onChange={e => setFormData({ ...formData, message: e.target.value })}
                            whileFocus={{ scale: 1.02 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors resize-none h-full min-h-[120px]"
                        />
                    </motion.div>
                    <motion.button
                        type="submit"
                        {...buttonScale}
                        className="w-full bg-primary-accent text-primary-bg font-bold py-3 rounded hover:bg-secondary-accent transition-colors"
                    >
                        Send Message
                    </motion.button>
                    {status && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center mt-4 text-sm font-bold text-secondary-accent"
                        >
                            {status}
                        </motion.p>
                    )}
                </motion.form>

                <motion.div
                    className="flex flex-col gap-6"
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                    variants={{
                        visible: {
                            transition: {
                                staggerChildren: 0.1,
                            },
                        },
                    }}
                >
                    {[
                        { icon: <EmailIcon size={32} />, label: 'Email Address', value: 'yaaclarence@gmail.com' },
                        { icon: <PhoneIcon size={32} />, label: 'Phone Number', value: '+254 759193674' },
                        { icon: <LocationIcon size={32} />, label: 'Location', value: 'Nairobi, Kenya' },
                    ].map(({ icon, label, value }) => (
                        <motion.div
                            key={label}
                            className="bg-card-bg p-6 rounded-lg border border-border flex items-center gap-6 group hover:border-primary-accent transition-colors shadow-lg"
                            whileHover={{ scale: 1.02 }}
                            variants={{
                                hidden: { opacity: 0, y: 20 },
                                visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                            }}
                        >
                            <motion.div
                                className="p-4 bg-secondary-bg rounded-lg text-primary-accent group-hover:scale-110 transition-transform"
                                whileHover={{ rotate: 5 }}
                            >
                                {icon}
                            </motion.div>
                            <div>
                                <span className="block text-xs font-bold text-muted-text uppercase tracking-widest mb-1">{label}</span>
                                <span className="text-lg text-primary-text font-medium">{value}</span>
                            </div>
                        </motion.div>
                    ))}
                    <motion.div
                        className="bg-card-bg p-6 rounded-lg border border-border shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <h3 className="font-bold text-primary-text mb-4 uppercase tracking-widest text-sm">Connect via Socials</h3>
                        <motion.div
                            className="flex flex-wrap gap-3"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            variants={{
                                visible: {
                                    transition: {
                                        staggerChildren: 0.08,
                                    },
                                },
                            }}
                        >
                            {socialLinks.facebook && (
                                <motion.a
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#1877F2] hover:text-white hover:bg-[#1877F2] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <FacebookIcon size={22} />
                                </motion.a>
                            )}
                            {socialLinks.instagram && (
                                <motion.a
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#E4405F] hover:text-white hover:bg-[#E4405F] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <InstagramIcon size={22} />
                                </motion.a>
                            )}
                            {socialLinks.tiktok && (
                                <motion.a
                                    href={socialLinks.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#000000] hover:text-white hover:bg-[#000000] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <TikTokIcon size={22} />
                                </motion.a>
                            )}
                            {socialLinks.x && (
                                <motion.a
                                    href={socialLinks.x}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#000000] hover:text-white hover:bg-[#000000] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <XIcon size={22} />
                                </motion.a>
                            )}
                            {socialLinks.youtube && (
                                <motion.a
                                    href={socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#FF0000] hover:text-white hover:bg-[#FF0000] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <YouTubeIcon size={22} />
                                </motion.a>
                            )}
                            {socialLinks.linkedin && (
                                <motion.a
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-3 bg-secondary-bg rounded-lg border border-border text-[#0A66C2] hover:text-white hover:bg-[#0A66C2] transition-colors"
                                    {...iconHover}
                                    variants={{
                                        hidden: { opacity: 0, scale: 0 },
                                        visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                    }}
                                >
                                    <LinkedInIcon size={22} />
                                </motion.a>
                            )}
                        </motion.div>
                    </motion.div>
                </motion.div>
            </div>
        </section>
    );
};

/* ─── Main SPA Home ──────────────────────────────────────────────────────── */
const Home = () => {
    const { scrollYProgress } = useScroll();
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

    const [books, setBooks] = useState([]);
    const [blogs, setBlogs] = useState([]);
    const [about, setAbout] = useState(defaultAbout);
    const [socialLinks, setSocialLinks] = useState({});

    useEffect(() => {
        api.get('/books').then(res => setBooks(res.data)).catch(() => { });
        api.get('/blog').then(res => setBlogs(res.data)).catch(() => { });

        api.get('/site-config')
            .then(res => {
                const configAbout = res.data?.data?.about;
                if (configAbout && typeof configAbout === 'object') {
                    setAbout(prev => ({ ...prev, ...configAbout }));
                }
                const configSocial = res.data?.data?.socialLinks;
                if (configSocial && typeof configSocial === 'object') {
                    setSocialLinks(configSocial);
                }
            })
            .catch(() => { });
    }, []);

    return (
        <div className="flex flex-col w-full -mt-8">
            <HeroSection bgY={bgY} aboutData={about} />
            <AboutSection aboutData={about} />
            <BooksSection books={books} />
            <BLDDSection />
            <BlogSection posts={blogs} />
            <ContactSection socialLinks={socialLinks} />
        </div>
    );
};

export default Home;
