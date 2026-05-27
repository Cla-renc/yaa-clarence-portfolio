import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, TelegramIcon, TikTokIcon, XIcon, YouTubeIcon, LinkedInIcon } from '../atoms/BrandIcons';
import { iconHover } from '../../utils/animations';
import api from '../../services/api';

const Footer = () => {
    const [dbLinks, setDbLinks] = useState({});

    useEffect(() => {
        api.get('/site-config')
            .then(res => {
                const configSocial = res.data?.data?.socialLinks;
                if (configSocial && typeof configSocial === 'object') {
                    setDbLinks(configSocial);
                }
            })
            .catch(() => { });
    }, []);

    const socialLinks = [
        ...(dbLinks.facebook ? [{ icon: <FacebookIcon size={20} />, label: 'Facebook', color: '#1877F2', href: dbLinks.facebook }] : []),
        ...(dbLinks.instagram ? [{ icon: <InstagramIcon size={20} />, label: 'Instagram', color: '#E4405F', href: dbLinks.instagram }] : []),
        ...(dbLinks.whatsapp ? [{ icon: <WhatsAppIcon size={20} />, label: 'WhatsApp', color: '#25D366', href: dbLinks.whatsapp }] : []),
        ...(dbLinks.telegram ? [{ icon: <TelegramIcon size={20} />, label: 'Telegram', color: '#0088CC', href: dbLinks.telegram }] : []),
        ...(dbLinks.tiktok ? [{ icon: <TikTokIcon size={20} />, label: 'TikTok', color: '#FFFFFF', href: dbLinks.tiktok }] : []),
        ...(dbLinks.x ? [{ icon: <XIcon size={20} />, label: 'X', color: '#000000', href: dbLinks.x }] : []),
        ...(dbLinks.youtube ? [{ icon: <YouTubeIcon size={20} />, label: 'YouTube', color: '#FF0000', href: dbLinks.youtube }] : []),
        ...(dbLinks.linkedin ? [{ icon: <LinkedInIcon size={20} />, label: 'LinkedIn', color: '#0A66C2', href: dbLinks.linkedin }] : []),
    ];

    const linkVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const linkItemVariants = {
        hidden: { opacity: 0, y: 10 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <footer className="bg-[#1A1A2E] text-white py-16 mt-auto border-t border-border/20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-center md:items-start text-center md:text-left">
                    {/* Logo Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-heading font-black text-primary-accent uppercase tracking-widest mb-3">Yaa Clarence</h2>
                        <p className="text-gray-300 font-body text-sm max-w-xs mx-auto md:mx-0 leading-relaxed">
                            Discipline. Wisdom. Purpose. Exploring masculinity, enforcing daily discipline, and mastering philosophical self-control.
                        </p>
                    </motion.div>

                    {/* Navigation Links */}
                    <motion.div
                        className="flex justify-center md:justify-center gap-12 font-heading tracking-wider uppercase text-xs font-bold pt-2"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={linkVariants}
                    >
                        <div className="flex flex-col space-y-4">
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/about" className="text-gray-200 hover:text-primary-accent transition-colors">About</Link>
                            </motion.div>
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/books" className="text-gray-200 hover:text-primary-accent transition-colors">Books</Link>
                            </motion.div>
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/bruce-lee-diaries" className="text-gray-200 hover:text-primary-accent transition-colors">BLDD</Link>
                            </motion.div>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/blog" className="text-gray-200 hover:text-primary-accent transition-colors">Blog</Link>
                            </motion.div>
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/contact" className="text-gray-200 hover:text-primary-accent transition-colors">Contact</Link>
                            </motion.div>
                            <motion.div variants={linkItemVariants} whileHover={{ x: 5 }}>
                                <Link to="/projects" className="text-gray-400 hover:text-primary-accent transition-colors">Projects</Link>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Social Icons */}
                    <motion.div
                        className="flex flex-wrap justify-center md:justify-end gap-3 pt-2"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.08,
                                },
                            },
                        }}
                    >
                        {socialLinks.map((social) => (
                            <motion.a
                                key={social.label}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={social.label}
                                className="p-3 bg-white/10 rounded-lg border border-white/20 hover:text-white transition-colors"
                                style={{ color: social.color }}
                                {...iconHover}
                                variants={{
                                    hidden: { opacity: 0, scale: 0 },
                                    visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
                                }}
                                whileHover={{ backgroundColor: social.color, color: 'white' }}
                            >
                                {social.icon}
                            </motion.a>
                        ))}
                    </motion.div>
                </div>

                <motion.div
                    className="mt-16 pt-8 border-t border-white/10 text-center"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                >
                    <p className="text-xs text-gray-300 uppercase tracking-widest font-heading font-medium">
                        &copy; {new Date().getFullYear()} Yaa Clarence. All rights reserved.
                    </p>
                </motion.div>
            </div>
        </footer>
    );
};

export default Footer;
