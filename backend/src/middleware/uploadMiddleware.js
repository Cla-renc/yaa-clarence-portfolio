const multer = require('multer');

let storage;

if (!process.env.CLOUDINARY_API_KEY || process.env.CLOUDINARY_API_KEY === 'your-api-key') {
    // Fallback to prevent crash when Cloudinary keys are missing in local dev
    storage = multer.memoryStorage();
} else {
    const cloudinary = require('../config/cloudinary');
    const { CloudinaryStorage } = require('multer-storage-cloudinary');
    storage = new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: 'yaa_clarence_portfolio',
            resource_type: 'auto',
            allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'mp4', 'mov', 'webm', 'avi'],
            transformation: [{ width: 1000, height: 1000, crop: 'limit' }]
        }
    });
}


const upload = multer({ storage });
module.exports = upload;
