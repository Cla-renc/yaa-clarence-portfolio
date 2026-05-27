const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    title: String,
    slug: String
});

schema.pre('validate', function(...args) {
    console.log('Args length:', args.length);
    console.log('Args:', typeof args[0]);
    if (this.title && !this.slug) {
        this.slug = this.title.toLowerCase();
    }
});

const Model = mongoose.model('Test2', schema);

async function run() {
    try {
        const doc = new Model({ title: 'Hello World' });
        await doc.validate();
        console.log('Success!');
    } catch (err) {
        console.error('Error:', err.message);
    }
}
run();
