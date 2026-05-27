require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Project = require('../models/Project');
const BlogPost = require('../models/BlogPost');
const SiteConfig = require('../models/SiteConfig');
const connectDB = require('../config/database');

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Project.deleteMany();
        await BlogPost.deleteMany();

        // Create Admin User
        const adminUser = await User.create({
            name: 'Yaa Clarence',
            email: 'yaaclarence@gmail.com',
            passwordHash: 'admin123', // Will be hashed via pre-save hook
            role: 'admin'
        });

        // Seed site config with default about content
        await SiteConfig.findOneAndUpdate(
            { key: 'about' },
            {
                key: 'about',
                value: {
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
                },
                type: 'object',
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        // Seed site config with default social links
        await SiteConfig.findOneAndUpdate(
            { key: 'socialLinks' },
            {
                key: 'socialLinks',
                value: {
                    facebook: 'https://www.facebook.com/BruceLeeMindset',
                    instagram: '',
                    whatsapp: 'https://wa.me/254759193674',
                    telegram: '',
                    tiktok: 'https://www.tiktok.com/@bl_disciplinediaries',
                    x: '',
                    youtube: '',
                    linkedin: ''
                },
                type: 'object',
                updatedAt: new Date()
            },
            { upsert: true, new: true }
        );

        console.log('Admin user and site config seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
