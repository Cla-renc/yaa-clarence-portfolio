const User = require("../models/User");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const { sendNotificationEmail } = require("../utils/emailService");

const authUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Please provide all fields" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
        name,
        email,
        passwordHash: password,
        role: "user"
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user._id),
        });
    } else {
        res.status(400).json({ message: "Invalid user data" });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");

    user.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");

    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await user.save();

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    const resetUrl = `${clientUrl}/reset-password/${resetToken}`;

    const message = `
        <h2>You have requested a password reset</h2>
        <p>Please go to this link to reset your password:</p>
        <a href="${resetUrl}" clicktracking="off">${resetUrl}</a>
    `;

    try {
        const result = await sendNotificationEmail(user.email, "Password Reset", message);
        
        if (!result.success) {
            console.log("Email error (fallback to console):", resetUrl);
        } else {
            console.log("Reset email sent:", resetUrl);
        }

        res.status(200).json({ success: true, message: "Email sent" });
    } catch (err) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();
        res.status(500).json({ message: "Email could not be sent" });
    }
};

const resetPassword = async (req, res) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.resetToken)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.passwordHash = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
        success: true,
        message: "Password reset successful",
        token: generateToken(user._id)
    });
};

module.exports = { authUser, registerUser, forgotPassword, resetPassword };
