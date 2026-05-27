const mongoose = require('mongoose');
const fs = require('fs');

const siteConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, default: 'string' }
}, { timestamps: true });

const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);

async function restoreAndSplit() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yaa-clarence-portfolio');
    const config = await SiteConfig.findOne({ key: 'about' });
    
    // The current profilePhoto is the transparent one
    const transparentPhoto = config.value.profilePhoto;
    
    // Read the original from temp file
    let originalPhotoBase64 = null;
    if (fs.existsSync('temp_photo_in.jpg')) {
        const fileData = fs.readFileSync('temp_photo_in.jpg', 'base64');
        originalPhotoBase64 = `data:image/jpeg;base64,${fileData}`;
    }
    
    if (originalPhotoBase64) {
        config.value.heroPhoto = transparentPhoto; // Keep the transparent one for Hero
        config.value.profilePhoto = originalPhotoBase64; // Restore original for About
        config.markModified('value');
        await config.save();
        console.log('Database updated: split heroPhoto and profilePhoto');
    } else {
        console.log('No temp_photo_in.jpg found to restore.');
    }
  } catch(e) {
    console.error(e);
  } finally {
    process.exit(0);
  }
}
restoreAndSplit();
