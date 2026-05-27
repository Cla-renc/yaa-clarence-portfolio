import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import { CheckCircle } from '@phosphor-icons/react';
import { FacebookIcon, InstagramIcon, WhatsAppIcon, TelegramIcon, TikTokIcon, XIcon, YouTubeIcon, LinkedInIcon, EmailIcon, PhoneIcon, LocationIcon } from '../components/atoms/BrandIcons';

const Contact = () => {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [status, setStatus] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [socialLinks, setSocialLinks] = useState({});

    useEffect(() => {
        api.get('/site-config')
            .then(res => {
                const configSocial = res.data?.data?.socialLinks;
                if (configSocial && typeof configSocial === 'object') {
                    setSocialLinks(configSocial);
                }
            })
            .catch(() => { });
    }, []);

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = validateForm();

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setErrors({});
        setStatus('Sending...');
        setIsSubmitting(true);

        try {
            // Extract first 50 chars of message as subject, or use default
            const subject = formData.message.trim().substring(0, 50) || 'Contact Form Submission';
            await api.post('/contact', { ...formData, subject });
            setStatus('Message sent successfully!');
            setFormData({ name: '', email: '', message: '' });
            setTimeout(() => setStatus(''), 5000);
        } catch (err) {
            console.error(err);
            setStatus('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    return (
        <div className="py-12 max-w-6xl mx-auto px-4 w-full">
            {/* Header Section */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h1 className="text-4xl md:text-5xl font-heading text-primary-accent mb-4">
                    Contact
                </h1>
                <p className="text-muted-text leading-relaxed max-w-3xl">
                    The Contact section uses a two-column layout on desktop: the left column contains a contact form with fields for name, email address, and message, along with a submit button styled with the primary accent color. The right column displays informational cards for email, phone, and location, each with an icon, label, and value. Below the info cards, a row of social media link buttons allows visitors to connect through Facebook, TikTok, Twitter, and LinkedIn. The contact form includes client-side validation and displays inline error messages. On successful submission, a success message appears with a confirmation animation. On mobile, the layout stacks vertically with the form on top and the info cards below, ensuring the primary action (sending a message) is immediately accessible without scrolling.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full">
                {/* Form - Left Column */}
                <div className="lg:col-span-2">
                    <motion.form
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-card-bg p-8 rounded-lg border border-border shadow-lg"
                    >
                        <h2 className="text-2xl font-heading text-primary-text mb-8">Send a Message</h2>

                        {/* Name Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-primary-text mb-2">Name</label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={`w-full bg-secondary-bg border ${errors.name ? 'border-red-500' : 'border-border'
                                    } rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors`}
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-2">{errors.name}</p>}
                        </div>

                        {/* Email Field */}
                        <div className="mb-6">
                            <label className="block text-sm font-semibold text-primary-text mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={`w-full bg-secondary-bg border ${errors.email ? 'border-red-500' : 'border-border'
                                    } rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors`}
                            />
                            {errors.email && <p className="text-red-500 text-xs mt-2">{errors.email}</p>}
                        </div>

                        {/* Message Field */}
                        <div className="mb-8">
                            <label className="block text-sm font-semibold text-primary-text mb-2">Message</label>
                            <textarea
                                name="message"
                                rows="6"
                                required
                                value={formData.message}
                                onChange={handleChange}
                                className={`w-full bg-secondary-bg border ${errors.message ? 'border-red-500' : 'border-border'
                                    } rounded p-3 text-primary-text focus:outline-none focus:border-primary-accent transition-colors resize-none`}
                            ></textarea>
                            {errors.message && <p className="text-red-500 text-xs mt-2">{errors.message}</p>}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-primary-accent text-primary-bg font-bold py-3 rounded hover:bg-secondary-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed uppercase text-sm tracking-wider"
                        >
                            {isSubmitting ? 'Sending...' : 'Send Message'}
                        </button>

                        {/* Status Messages */}
                        {status && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-4 p-4 rounded bg-secondary-bg border border-primary-accent"
                            >
                                {status === 'Message sent successfully!' ? (
                                    <div className="flex items-center gap-2 text-green-500">
                                        <CheckCircle size={20} />
                                        <p className="font-semibold">{status}</p>
                                    </div>
                                ) : (
                                    <p className="text-center text-sm font-semibold text-secondary-accent">{status}</p>
                                )}
                            </motion.div>
                        )}
                    </motion.form>
                </div>

                {/* Info Cards & Socials - Right Column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    {/* Email Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary-bg rounded-lg text-primary-accent group-hover:scale-110 transition-transform">
                                <EmailIcon size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-text uppercase tracking-widest">Email</p>
                                <p className="text-lg text-primary-text font-semibold">yaaclarence@gmail.com</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Phone Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary-bg rounded-lg text-primary-accent group-hover:scale-110 transition-transform">
                                <PhoneIcon size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-text uppercase tracking-widest">Phone</p>
                                <p className="text-lg text-primary-text font-semibold">+254 759193674</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Location Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-card-bg p-6 rounded-lg border border-border hover:border-primary-accent transition-colors group cursor-pointer"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="p-3 bg-secondary-bg rounded-lg text-primary-accent group-hover:scale-110 transition-transform">
                                <LocationIcon size={28} />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-muted-text uppercase tracking-widest">Location</p>
                                <p className="text-lg text-primary-text font-semibold">Nairobi, Kenya</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Links */}
                    <div className="border-t border-border pt-6 mt-2">
                        <h3 className="text-sm font-heading font-bold text-primary-text mb-6 uppercase tracking-wider">Connect Socials</h3>
                        <div className="grid grid-cols-2 gap-3">
                            {socialLinks.facebook && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.facebook}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Facebook"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#1877F2] hover:text-white hover:bg-[#1877F2] border border-border transition-colors flex items-center justify-center"
                                >
                                    <FacebookIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.instagram && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Instagram"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#E4405F] hover:text-white hover:bg-[#E4405F] border border-border transition-colors flex items-center justify-center"
                                >
                                    <InstagramIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.whatsapp && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="WhatsApp"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#25D366] hover:text-white hover:bg-[#25D366] border border-border transition-colors flex items-center justify-center"
                                >
                                    <WhatsAppIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.telegram && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.telegram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Telegram"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#0088CC] hover:text-white hover:bg-[#0088CC] border border-border transition-colors flex items-center justify-center"
                                >
                                    <TelegramIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.tiktok && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.tiktok}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="TikTok"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#000000] hover:text-white hover:bg-[#000000] border border-border transition-colors flex items-center justify-center"
                                >
                                    <TikTokIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.x && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.x}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="X"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#000000] hover:text-white hover:bg-[#000000] border border-border transition-colors flex items-center justify-center"
                                >
                                    <XIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.youtube && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.youtube}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="YouTube"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#FF0000] hover:text-white hover:bg-[#FF0000] border border-border transition-colors flex items-center justify-center"
                                >
                                    <YouTubeIcon size={24} />
                                </motion.a>
                            )}
                            {socialLinks.linkedin && (
                                <motion.a
                                    whileHover={{ scale: 1.1 }}
                                    href={socialLinks.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="LinkedIn"
                                    className="p-3 bg-secondary-bg rounded-lg text-[#0A66C2] hover:text-white hover:bg-[#0A66C2] border border-border transition-colors flex items-center justify-center"
                                >
                                    <LinkedInIcon size={24} />
                                </motion.a>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
