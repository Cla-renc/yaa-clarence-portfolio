import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';

const defaultAbout = {
    heading: 'About Yaa Clarence',
    title: 'IT Student · Author · Brand Strategist',
    intro: 'I am a fourth-year Information Technology student on attachment at the Kenya Methodist University (KEMU) ICT Department. My academic background combines software engineering with a deep passion for personal development and brand building.',
    paragraph1: 'Through the Bruce Lee Discipline Diaries, I curate wisdom around masculinity, discipline and growth. My upcoming books seek to define and explore modern male identity.',
    paragraph2: 'This portfolio is the digital home for my technical work, brand strategy, and authorship journey. It is designed to present my skills, values, and creative vision in one cohesive experience.',
    skills: ['React.js', 'Node.js', 'MongoDB', 'Express', 'Python', 'TypeScript', 'Tailwind CSS', 'REST APIs', 'Git', 'Leadership', 'Authorship', 'Brand Strategy'],
    stats: [
        { label: 'Years Dev', value: '3+' },
        { label: 'Projects', value: '12' },
        { label: 'Books Drafted', value: '2' },
        { label: 'Brand Followers', value: '9000+' }
    ],
    profilePhoto: '',
    cvFile: ''
};

const About = () => {
    const [about, setAbout] = useState(defaultAbout);

    useEffect(() => {
        const loadAboutContent = async () => {
            try {
                const { data } = await api.get('/site-config/about');
                if (data?.data && typeof data.data === 'object') {
                    setAbout(prev => ({ ...prev, ...data.data }));
                }
            } catch (error) {
                console.warn('Failed to load about content', error);
            }
        };
        loadAboutContent();
    }, []);

    return (
        <div className="py-10 max-w-5xl mx-auto px-4">

            {/* ════════════════════════════════════════
                HERO — editorial two-column layout
                LEFT : full portrait + decorative block
                RIGHT: name / title / bio / CV button
            ════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col md:flex-row items-start gap-12 md:gap-16 mb-20"
            >
                {/* ── LEFT: portrait with decorative offset block ── */}
                <div className="relative flex-shrink-0 w-full md:w-auto flex justify-center">
                    {/* Decorative offset block — sits behind & below the photo */}
                    <div
                        className="absolute bottom-[-18px] left-[-18px] w-[88%] h-[88%] rounded-sm z-0"
                        style={{ background: 'rgba(99,55,182,0.13)' }}
                    />

                    {/* Photo */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2, duration: 0.6 }}
                        className="relative z-10"
                        style={{ width: 'clamp(260px, 38vw, 420px)' }}
                    >
                        {about.profilePhoto ? (
                            <img
                                src={about.profilePhoto}
                                alt="Yaa Clarence"
                                className="w-full rounded-sm shadow-2xl"
                                style={{
                                    display: 'block',
                                    height: 'auto',
                                    objectFit: 'unset'
                                }}
                            />
                        ) : (
                            /* Placeholder when no photo uploaded yet */
                            <div
                                className="w-full rounded-sm shadow-2xl flex flex-col items-center justify-center gap-3 select-none"
                                style={{
                                    aspectRatio: '3/4',
                                    background: 'linear-gradient(160deg, #6337b6 0%, #a78bfa 100%)',
                                    color: '#fff'
                                }}
                            >
                                <span style={{ fontSize: '5rem', fontWeight: 900, lineHeight: 1 }}>YC</span>
                                <span style={{ fontSize: '0.85rem', opacity: 0.75, letterSpacing: '0.1em' }}>
                                    Upload photo in Admin → Settings
                                </span>
                            </div>
                        )}
                    </motion.div>
                </div>

                {/* ── RIGHT: identity & bio ── */}
                <motion.div
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="flex-1 flex flex-col gap-5"
                >
                    {/* Name */}
                    <h1
                        className="font-heading font-bold leading-tight"
                        style={{
                            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
                            color: 'var(--primary-text)',
                            letterSpacing: '-0.01em'
                        }}
                    >
                        Yaa Clarence
                    </h1>

                    {/* Role — uppercase spaced accent text like the reference */}
                    <p
                        className="font-bold tracking-widest uppercase text-sm"
                        style={{ color: 'var(--primary-accent, #6337b6)' }}
                    >
                        {about.title}
                    </p>

                    {/* Thin divider */}
                    <div
                        className="w-14 rounded-full"
                        style={{ height: '2px', background: 'var(--primary-accent, #6337b6)', opacity: 0.35 }}
                    />

                    {/* Bio paragraphs */}
                    <p
                        className="leading-relaxed"
                        style={{ color: 'var(--muted-text, #666)', fontSize: '0.97rem', maxWidth: '520px' }}
                    >
                        {about.intro}
                    </p>
                    <p
                        className="leading-relaxed"
                        style={{ color: 'var(--muted-text, #666)', fontSize: '0.97rem', maxWidth: '520px' }}
                    >
                        {about.paragraph1}
                    </p>
                    <p
                        className="leading-relaxed"
                        style={{ color: 'var(--muted-text, #666)', fontSize: '0.97rem', maxWidth: '520px' }}
                    >
                        {about.paragraph2}
                    </p>

                    {/* CV download button */}
                    <div className="flex flex-wrap gap-3 mt-2">
                        {about.cvFile ? (
                            <a
                                href={about.cvFile}
                                download="Yaa_Clarence_CV.pdf"
                                id="cv-download-btn"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-bold text-sm transition-all duration-200"
                                style={{
                                    background: 'var(--primary-accent, #6337b6)',
                                    color: '#fff',
                                    boxShadow: '0 4px 16px rgba(99,55,182,0.28)'
                                }}
                                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,55,182,0.38)'; }}
                                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,55,182,0.28)'; }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5" />
                                </svg>
                                Download CV
                            </a>
                        ) : (
                            <span
                                id="cv-unavailable-notice"
                                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border"
                                style={{ borderColor: 'var(--border, #ddd)', color: 'var(--muted-text, #888)' }}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6M5 20h14a2 2 0 002-2V8l-5-5H5a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                                CV coming soon
                            </span>
                        )}

                        <a
                            href="#experience"
                            id="about-view-experience-btn"
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-sm border transition-all duration-200"
                            style={{ borderColor: 'var(--primary-accent, #6337b6)', color: 'var(--primary-accent, #6337b6)' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            View Experience ↓
                        </a>
                    </div>
                </motion.div>
            </motion.section>

            {/* ════════════════════════════════════════
                SKILLS & STATS
            ════════════════════════════════════════ */}
            <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid gap-6 md:grid-cols-2 mb-14"
            >
                <div className="bg-card-bg p-8 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-primary-text mb-4">Core Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {about.skills.map(skill => (
                            <span
                                key={skill}
                                className="px-3 py-2 bg-secondary-bg text-primary-accent rounded-full text-sm font-semibold border border-border"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="bg-card-bg p-8 rounded-xl border border-border shadow-sm">
                    <h3 className="text-xl font-bold text-primary-text mb-4">Snapshot Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {about.stats.map(stat => (
                            <div
                                key={stat.label}
                                className="rounded-xl p-4 border"
                                style={{ background: 'rgba(99,55,182,0.05)', borderColor: 'rgba(99,55,182,0.12)' }}
                            >
                                <p className="text-2xl font-bold text-primary-accent">{stat.value}</p>
                                <p className="text-xs text-muted-text uppercase tracking-widest mt-1">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.section>

            {/* ════════════════════════════════════════
                EXPERIENCE TIMELINE
            ════════════════════════════════════════ */}
            <motion.section
                id="experience"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
            >
                <h2 className="text-3xl font-heading text-primary-accent mb-8">Experience Timeline</h2>
                <div className="space-y-0">
                    {[
                        {
                            role: 'IT Attachment',
                            org: 'Kenya Methodist University (KEMU)',
                            period: 'Present',
                            desc: 'Working within the ICT department to maintain systems and support administrative functions.'
                        },
                        {
                            role: 'Founder & Author',
                            org: 'Bruce Lee Discipline Diaries',
                            period: 'Ongoing',
                            desc: 'Operating a social media brand focused on masculinity, discipline, and campus life wisdom.'
                        }
                    ].map((item, i) => (
                        <div key={i} className="flex gap-6 pb-10">
                            {/* Timeline spine */}
                            <div className="flex flex-col items-center">
                                <div
                                    className="w-3 h-3 rounded-full mt-1.5 flex-shrink-0"
                                    style={{ background: 'var(--primary-accent, #6337b6)', boxShadow: '0 0 0 4px rgba(99,55,182,0.15)' }}
                                />
                                {i < 1 && (
                                    <div
                                        className="flex-1 w-px mt-2"
                                        style={{ background: 'var(--primary-accent, #6337b6)', opacity: 0.2 }}
                                    />
                                )}
                            </div>
                            {/* Content */}
                            <div className="flex-1 pb-2">
                                <h3 className="text-xl font-bold text-primary-text">{item.role}</h3>
                                <p
                                    className="font-semibold text-sm mt-0.5 mb-2"
                                    style={{ color: 'var(--secondary-accent, #b06b2f)' }}
                                >
                                    {item.org} · {item.period}
                                </p>
                                <p className="text-muted-text text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </motion.section>

        </div>
    );
};

export default About;
