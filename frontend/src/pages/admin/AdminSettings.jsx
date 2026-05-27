import { useState, useEffect } from 'react';
import api from '../../services/api';

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
    ],
    profilePhoto: '',
    cvFile: ''
};

const defaultBldd = {
    title: 'Bruce Lee Discipline Diaries',
    subtitle: 'A dedicated brand showcase celebrating masculinity, discipline, and wisdom',
    intro: 'The Bruce Lee Discipline Diaries section is the dedicated brand showcase within the VAA CLARENCE portfolio. It features a dark color scheme leader banner and visual control with the rest of the portfolio, creating a unified yet distinctive brand presence. The content is divided into two main areas: a content grid displaying featured posts, reels, and video thumbnails from the BLDD social media channels, while the right displays a content card featuring live follower counts and engagement metrics, streamlined accommodations varying content sizes. Each piece of content can be clicked to view the original post on the respective social media platform.',
    profilePhoto: '',
    coverPhoto: ''
};

const defaultSocialLinks = {
    facebook: '',
    instagram: '',
    whatsapp: '',
    telegram: '',
    tiktok: '',
    x: '',
    youtube: '',
    linkedin: ''
};

const AdminSettings = () => {
    const [activeTab, setActiveTab] = useState('about');
    const [about, setAbout] = useState(defaultAbout);
    const [bldd, setBldd] = useState(defaultBldd);
    const [socialLinks, setSocialLinks] = useState(defaultSocialLinks);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const loadConfig = async () => {
            try {
                const { data } = await api.get('/site-config');
                const configAbout = data?.data?.about;
                if (configAbout && typeof configAbout === 'object') {
                    setAbout((prev) => ({ ...prev, ...configAbout }));
                }
                const configBldd = data?.data?.bldd;
                if (configBldd && typeof configBldd === 'object') {
                    setBldd((prev) => ({ ...prev, ...configBldd }));
                }
                const configSocial = data?.data?.socialLinks;
                if (configSocial && typeof configSocial === 'object') {
                    setSocialLinks((prev) => ({ ...prev, ...configSocial }));
                }
            } catch (err) {
                console.error('Failed to load site settings', err);
            } finally {
                setLoading(false);
            }
        };
        loadConfig();
    }, []);

    const handleAboutChange = (field) => (event) => {
        setAbout({ ...about, [field]: event.target.value });
    };

    const handleBlddChange = (field) => (event) => {
        setBldd({ ...bldd, [field]: event.target.value });
    };

    const handleSocialLinksChange = (field) => (event) => {
        setSocialLinks({ ...socialLinks, [field]: event.target.value });
    };

    const handleSaveAbout = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        const updatedAbout = {
            ...about,
            skills: about.skills ? about.skills : [],
            stats: about.stats ? about.stats : []
        };

        try {
            await api.put('/site-config/about', { value: updatedAbout, type: 'object' });
            setMessage('About section saved successfully.');
        } catch (err) {
            console.error('Save settings error', err.response || err);
            setMessage(err.response?.data?.message || err.message || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveBldd = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await api.put('/site-config/bldd', { value: bldd, type: 'object' });
            setMessage('BLDD section saved successfully.');
        } catch (err) {
            console.error('Save settings error', err.response || err);
            setMessage(err.response?.data?.message || err.message || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleSaveSocialLinks = async (e) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');

        try {
            await api.put('/site-config/socialLinks', { value: socialLinks, type: 'object' });
            setMessage('Social Links saved successfully.');
        } catch (err) {
            console.error('Save settings error', err.response || err);
            setMessage(err.response?.data?.message || err.message || 'Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleSkillsChange = (event) => {
        setAbout({ ...about, skills: event.target.value.split(',').map((skill) => skill.trim()).filter(Boolean) });
    };

    const handleStatsChange = (event) => {
        const lines = event.target.value.split('\n').map((line) => line.trim()).filter(Boolean);
        const stats = lines.map((line) => {
            const [label, value] = line.split('|').map((item) => item.trim());
            return { label: label || '', value: value || '' };
        }).filter((item) => item.label && item.value);
        setAbout({ ...about, stats });
    };

    const statsText = about.stats?.map((item) => `${item.label} | ${item.value}`).join('\n');
    const skillsText = about.skills?.join(', ');

    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-heading text-primary-accent mb-2">Site Settings</h1>
                    <p className="text-muted-text max-w-2xl">Edit the portfolio configurations here.</p>
                </div>
                <div className="bg-card-bg p-4 rounded-lg border border-border flex items-center justify-center">
                    <p className="text-sm text-secondary-accent mr-2">Current status:</p>
                    <p className="font-semibold text-primary-text">{loading ? 'Loading…' : 'Loaded'}</p>
                </div>
            </div>

            {/* TABS */}
            <div className="flex flex-wrap gap-4 mb-6 border-b border-border pb-2">
                <button 
                    onClick={() => { setActiveTab('about'); setMessage(''); }}
                    className={`pb-2 px-2 font-bold transition-all ${activeTab === 'about' ? 'text-primary-accent border-b-2 border-primary-accent' : 'text-muted-text hover:text-primary-text'}`}
                >
                    About Section
                </button>
                <button 
                    onClick={() => { setActiveTab('bldd'); setMessage(''); }}
                    className={`pb-2 px-2 font-bold transition-all ${activeTab === 'bldd' ? 'text-primary-accent border-b-2 border-primary-accent' : 'text-muted-text hover:text-primary-text'}`}
                >
                    BLDD Section
                </button>
                <button 
                    onClick={() => { setActiveTab('socialLinks'); setMessage(''); }}
                    className={`pb-2 px-2 font-bold transition-all ${activeTab === 'socialLinks' ? 'text-primary-accent border-b-2 border-primary-accent' : 'text-muted-text hover:text-primary-text'}`}
                >
                    Social Links
                </button>
            </div>

            {message && (
                <div className={`mb-6 px-4 py-3 rounded-lg text-sm border ${message.toLowerCase().includes('failed') ? 'border-red-500 bg-red-500/10 text-red-600' : 'border-emerald-500 bg-emerald-500/10 text-emerald-700'}`}>
                    {message}
                </div>
            )}

            {activeTab === 'about' && (
                <form onSubmit={handleSaveAbout} className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-primary-text mb-2">About Heading</label>
                            <input value={about.heading} onChange={handleAboutChange('heading')} className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary-text mb-2">Title</label>
                            <input value={about.title} onChange={handleAboutChange('title')} className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Intro paragraph</label>
                        <textarea value={about.intro} onChange={handleAboutChange('intro')} rows="3" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Paragraph 1</label>
                        <textarea value={about.paragraph1} onChange={handleAboutChange('paragraph1')} rows="4" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Paragraph 2</label>
                        <textarea value={about.paragraph2} onChange={handleAboutChange('paragraph2')} rows="4" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-primary-text mb-2">Skills (comma separated)</label>
                            <textarea value={skillsText} onChange={handleSkillsChange} rows="3" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-primary-text mb-2">Stats (one per line, use &quot;Label | Value&quot;)</label>
                            <textarea value={statsText} onChange={handleStatsChange} rows="4" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Profile Photo</label>
                        <div className="flex items-center gap-4">
                            {about.profilePhoto && (
                                <img src={about.profilePhoto} alt="Profile preview" className="w-20 h-20 object-cover rounded-lg border border-border" />
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setAbout({ ...about, profilePhoto: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-muted-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                            />
                        </div>
                        <p className="text-xs text-muted-text mt-2">Recommended: Square image, max 2MB.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">CV / Resume (PDF)</label>
                        <div className="flex items-center gap-4 flex-wrap">
                            {about.cvFile && (
                                <a
                                    href={about.cvFile}
                                    download="Yaa_Clarence_CV.pdf"
                                    className="inline-flex items-center gap-1 text-sm text-primary-accent underline hover:no-underline"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M12 4v12m0 0l-3.5-3.5M12 16l3.5-3.5" />
                                    </svg>
                                    Current CV (click to preview/download)
                                </a>
                            )}
                            <input
                                type="file"
                                accept="application/pdf"
                                id="cv-upload-input"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        if (file.size > 5 * 1024 * 1024) {
                                            setMessage('CV file must be under 5 MB.');
                                            return;
                                        }
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setAbout({ ...about, cvFile: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-muted-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                            />
                        </div>
                        <p className="text-xs text-muted-text mt-2">Upload a PDF file (max 5 MB). This will appear as a downloadable button on the public About page.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <button type="submit" disabled={saving} className="bg-primary-accent text-primary-bg px-6 py-3 rounded font-bold hover:bg-secondary-accent transition disabled:opacity-60">
                            {saving ? 'Saving…' : 'Save About Section'}
                        </button>
                        <p className="text-xs text-muted-text">Use the pipe | separator for stats. Example: <span className="text-primary-accent">Years Dev | 3+</span>.</p>
                    </div>
                </form>
            )}

            {activeTab === 'bldd' && (
                <form onSubmit={handleSaveBldd} className="space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Title</label>
                        <input value={bldd.title} onChange={handleBlddChange('title')} className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Subtitle</label>
                        <input value={bldd.subtitle} onChange={handleBlddChange('subtitle')} className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Intro paragraph</label>
                        <textarea value={bldd.intro} onChange={handleBlddChange('intro')} rows="5" className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Cover Photo (Banner)</label>
                        <div className="flex items-center gap-4">
                            {bldd.coverPhoto && (
                                <img src={bldd.coverPhoto} alt="Cover preview" className="w-32 h-16 object-cover rounded-lg border border-border" />
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setBldd({ ...bldd, coverPhoto: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-muted-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                            />
                        </div>
                        <p className="text-xs text-muted-text mt-2">Recommended: Wide image, max 2MB. This will be used as the top banner background.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-primary-text mb-2">Profile Photo (Editorial Layout)</label>
                        <div className="flex items-center gap-4">
                            {bldd.profilePhoto && (
                                <img src={bldd.profilePhoto} alt="Profile preview" className="w-20 h-20 object-cover rounded-lg border border-border" />
                            )}
                            <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setBldd({ ...bldd, profilePhoto: reader.result });
                                        };
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-muted-text file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-primary-accent/10 file:text-primary-accent hover:file:bg-primary-accent/20"
                            />
                        </div>
                        <p className="text-xs text-muted-text mt-2">Recommended: Portrait or square image, max 2MB.</p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                        <button type="submit" disabled={saving} className="bg-primary-accent text-primary-bg px-6 py-3 rounded font-bold hover:bg-secondary-accent transition disabled:opacity-60">
                            {saving ? 'Saving…' : 'Save BLDD Section'}
                        </button>
                    </div>
                </form>
            )}

            {activeTab === 'socialLinks' && (
                <form onSubmit={handleSaveSocialLinks} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.keys(defaultSocialLinks).map((platform) => (
                            <div key={platform}>
                                <label className="block text-sm font-semibold text-primary-text mb-2 capitalize">{platform} URL</label>
                                <input 
                                    type="url"
                                    value={socialLinks[platform] || ''} 
                                    onChange={handleSocialLinksChange(platform)} 
                                    placeholder={`https://${platform}.com/...`}
                                    className="w-full bg-secondary-bg border border-border rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent" 
                                />
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mt-6">
                        <button type="submit" disabled={saving} className="bg-primary-accent text-primary-bg px-6 py-3 rounded font-bold hover:bg-secondary-accent transition disabled:opacity-60">
                            {saving ? 'Saving…' : 'Save Social Links'}
                        </button>
                        <p className="text-xs text-muted-text">Leave a URL blank to hide the corresponding icon on the site.</p>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AdminSettings;

