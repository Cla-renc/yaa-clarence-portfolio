const rateLimit = require('express-rate-limit');

// Try to load optional Redis-backed store; fall back to in-memory store if unavailable
let RedisStore;
let redisClient;
try {
    RedisStore = require('rate-limit-redis');
    const redis = require('redis');
    redisClient = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379
    });
    // Connect but don't crash the server on failure
    redisClient.connect().catch(err => {
        console.warn('Redis connection failed, using in-memory store:', err.message);
        redisClient = null;
    });
} catch (err) {
    console.warn('Redis or rate-limit-redis not installed; using in-memory rate limiter store.');
    RedisStore = null;
    redisClient = null;
}

// Rate limiter for contact form: max 5 submissions per hour per IP
exports.contactFormLimiter = rateLimit({
    store: redisClient ? new RedisStore({
        client: redisClient,
        prefix: 'contact-form:'
    }) : undefined,
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // 5 requests per windowMs
    message: 'Too many contact form submissions from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    skip: (req) => {
        // Skip rate limiting for admin users
        return req.user && req.user.role === 'admin';
    }
});

// Rate limiter for API endpoints: max 30 requests per minute
exports.apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false
});

// Strict rate limiter for authentication: max 5 attempts per 15 minutes
exports.authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: 'Too many login attempts, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true // Don't count successful requests
});
