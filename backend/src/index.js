const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const connectDB = require("./config/database");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const { apiLimiter, authLimiter, contactFormLimiter } = require("./middleware/rateLimitMiddleware");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const blogRoutes = require("./routes/blogRoutes");
const contactRoutes = require("./routes/contactRoutes");
const bookRoutes = require("./routes/bookRoutes");
const socialMetricsRoutes = require("./routes/socialMetricsRoutes");
const siteConfigRoutes = require("./routes/siteConfigRoutes");
const searchRoutes = require("./routes/searchRoutes");

dotenv.config();

const allowedClientOrigins = [
    process.env.CLIENT_URL || 'http://localhost:5173',
    'http://127.0.0.1:5173'
];

// Connect to database
connectDB();

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
            styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            imgSrc: ["'self'", "data:", "https:"],
            connectSrc: ["'self'", ...allowedClientOrigins],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: []
        }
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" }
}));

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedClientOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS policy does not allow access from origin ${origin}`));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(mongoSanitize());
app.use(xss());

// Health check endpoint (no rate limiting)
app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Apply rate limiting to API routes
app.use("/api/", apiLimiter);

// Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/contact", contactFormLimiter, contactRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/social-metrics", socialMetricsRoutes);
app.use("/api/site-config", siteConfigRoutes);
app.use("/api/search", searchRoutes);

// Main API info
app.get("/api", (req, res) => {
    res.json({
        service: "Yaa Clarence Portfolio API",
        version: "1.0.0",
        environment: process.env.NODE_ENV || "development",
        timestamp: new Date().toISOString()
    });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// 404 catch-all
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Endpoint not found"
    });
});

const PORT = process.env.PORT || 5000;

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`✓ Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
        console.log(`✓ Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}`);
        console.log(`✓ CORS enabled for: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
    });
}

module.exports = app;
