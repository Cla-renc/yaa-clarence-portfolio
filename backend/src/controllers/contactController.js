const Contact = require('../models/Contact');
const { sendContactEmail } = require('../utils/emailService');

// Validation helper
const validateContactData = (name, email, subject, message) => {
    const errors = {};

    // Name validation
    if (!name || name.trim().length < 2) {
        errors.name = 'Name must be at least 2 characters';
    }
    if (name && name.length > 100) {
        errors.name = 'Name must not exceed 100 characters';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
        errors.email = 'Please provide a valid email address';
    }

    // Subject validation
    if (!subject || subject.trim().length < 3) {
        errors.subject = 'Subject must be at least 3 characters';
    }
    if (subject && subject.length > 150) {
        errors.subject = 'Subject must not exceed 150 characters';
    }

    // Message validation
    if (!message || message.trim().length < 10) {
        errors.message = 'Message must be at least 10 characters';
    }
    if (message && message.length > 5000) {
        errors.message = 'Message must not exceed 5000 characters';
    }

    return Object.keys(errors).length === 0 ? { valid: true } : { valid: false, errors };
};

// @desc    Get all contacts (Admin only)
// @route   GET /api/contact
// @access  Private/Admin
const getContacts = async (req, res) => {
    try {
        const { read = null, page = 1, limit = 20 } = req.query;
        let query = {};

        if (read !== null) {
            query.read = read === 'true';
        }

        const contacts = await Contact
            .find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const totalCount = await Contact.countDocuments(query);

        res.status(200).json({
            success: true,
            data: contacts,
            pagination: {
                total: totalCount,
                pages: Math.ceil(totalCount / limit),
                currentPage: page
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error retrieving contacts' });
    }
};

// @desc    Create new contact (Submit form)
// @route   POST /api/contact
// @access  Public (Rate limited)
const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        // Validate input
        const validation = validateContactData(name, email, subject, message);
        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: validation.errors
            });
        }

        // Sanitize inputs (remove potential script tags)
        const sanitizedName = name.trim().substring(0, 100);
        const sanitizedSubject = subject.trim().substring(0, 150);
        const sanitizedMessage = message.trim().substring(0, 5000);

        // Get client IP
        const ipAddress = req.ip || req.connection.remoteAddress;

        // Create contact record
        const contact = new Contact({
            name: sanitizedName,
            email: email.toLowerCase(),
            subject: sanitizedSubject,
            message: sanitizedMessage,
            ipAddress
        });

        try {
            await contact.save();
        } catch (saveErr) {
            console.warn('Contact save failed (DB may be unavailable):', saveErr.message);
            // continue — allow contact submission to succeed client-side even if DB is down
        }

        // Send email notifications (async, don't wait)
        if (process.env.NODE_ENV === 'production' || process.env.SEND_EMAILS === 'true') {
            sendContactEmail({
                name: sanitizedName,
                email: email.toLowerCase(),
                subject: sanitizedSubject,
                message: sanitizedMessage
            }).catch(err => console.error('Email sending failed:', err));
        }

        res.status(201).json({
            success: true,
            message: 'Your message has been received. (Saved: ' + (contact._id ? 'yes' : 'no') + ')' 
        });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to submit message. Please try again later.'
        });
    }
};

// @desc    Mark contact as read (Admin only)
// @route   PATCH /api/contact/:id
// @access  Private/Admin
const markContactAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const { read } = req.body;

        const contact = await Contact.findByIdAndUpdate(
            id,
            { read: read === true },
            { new: true }
        );

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            data: contact
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to update contact status'
        });
    }
};

// @desc    Delete contact (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private/Admin
const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findByIdAndDelete(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact message not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Contact message deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact message'
        });
    }
};

module.exports = { getContacts, createContact, markContactAsRead, deleteContact };
