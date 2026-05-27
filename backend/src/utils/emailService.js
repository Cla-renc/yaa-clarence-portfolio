let nodemailer;
try {
    nodemailer = require('nodemailer');
} catch (err) {
    console.warn('nodemailer not installed — email sending disabled in this environment');
    nodemailer = null;
}

// Create transporter based on environment; return no-op transporter if nodemailer missing
const createTransporter = () => {
    if (!nodemailer) {
        return {
            sendMail: async (mailOptions) => {
                console.warn('sendMail skipped (nodemailer not available):', mailOptions && mailOptions.subject);
                return Promise.resolve({ accepted: [], rejected: [] });
            }
        };
    }

    if (process.env.NODE_ENV === 'production') {
        // Production: Use Sendgrid or Gmail
        return nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE || 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        });
    } else {
        // Development: Use test account or console logging
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'localhost',
            port: process.env.SMTP_PORT || 1025,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }
};

// Send contact form email to admin
exports.sendContactEmail = async (contactData) => {
    try {
        const transporter = createTransporter();

        // Email to admin
        const adminMailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@yaaclarence.com',
            to: process.env.ADMIN_EMAIL || 'admin@yaaclarence.com',
            subject: `New Contact Form Submission: ${contactData.subject}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${contactData.name}</p>
                <p><strong>Email:</strong> ${contactData.email}</p>
                <p><strong>Subject:</strong> ${contactData.subject}</p>
                <p><strong>Message:</strong></p>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p><small>Received: ${new Date().toLocaleString()}</small></p>
            `
        };

        // Confirmation email to user
        const userMailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@yaaclarence.com',
            to: contactData.email,
            subject: 'We received your message - Yaa Clarence',
            html: `
                <h2>Thank you for reaching out!</h2>
                <p>Hi ${contactData.name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <p><strong>Your message:</strong></p>
                <p>${contactData.message.replace(/\n/g, '<br>')}</p>
                <hr>
                <p>Best regards,<br>Yaa Clarence</p>
            `
        };

        // Send both emails
        await transporter.sendMail(adminMailOptions);
        await transporter.sendMail(userMailOptions);

        return { success: true, message: 'Emails sent successfully' };
    } catch (error) {
        console.error('Email service error:', error);
        return { success: false, message: error.message };
    }
};

// Send notification email (e.g., book updates)
exports.sendNotificationEmail = async (recipientEmail, subject, html) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || 'noreply@yaaclarence.com',
            to: recipientEmail,
            subject,
            html
        };

        await transporter.sendMail(mailOptions);
        return { success: true };
    } catch (error) {
        console.error('Email notification error:', error);
        return { success: false, message: error.message };
    }
};
