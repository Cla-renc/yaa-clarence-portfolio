const mongoose = require('mongoose');
const fs = require('fs');

const siteConfigSchema = new mongoose.Schema({
    key: { type: String, required: true, unique: true },
    value: { type: mongoose.Schema.Types.Mixed, required: true },
    type: { type: String, default: 'string' }
}, { timestamps: true });

const SiteConfig = mongoose.models.SiteConfig || mongoose.model('SiteConfig', siteConfigSchema);

async function run() {
  try {
    await mongoose.connect('mongodb://localhost:27017/yaa-clarence-portfolio');
    const config = await SiteConfig.findOne({ key: 'about' });
    const photoBase64 = config.value.profilePhoto;
    
    if (photoBase64 && !photoBase64.includes('photo_no_bg_processed')) {
      console.log('Found photo in DB. Processing background removal...');
      
      const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
      fs.writeFileSync('temp_photo_in.jpg', base64Data, 'base64');
      
      const { removeBackground } = await import('@imgly/background-removal-node');
      
      console.log('Running imgly background removal... (this may take a minute)');
      // pass file URI
      const blob = await removeBackground('file://' + __dirname + '/temp_photo_in.jpg');
      const arrayBuffer = await blob.arrayBuffer();
      const newBuffer = Buffer.from(arrayBuffer);
      
      const newBase64 = newBuffer.toString('base64');
      const dataUri = `data:image/png;base64,${newBase64}#photo_no_bg_processed`;
      
      config.value.profilePhoto = dataUri;
      config.markModified('value');
      await config.save();
      console.log('Photo background removed and updated in DB successfully.');
    } else {
        console.log('No photo found or already processed.');
    }
  } catch(e) {
    console.error('Error during processing:', e);
  } finally {
    process.exit(0);
  }
}
run();
