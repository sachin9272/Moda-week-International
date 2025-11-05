import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  image: {
    url: { type: String },        // secure/public URL stored from Cloudinary
    public_id: { type: String }   // Cloudinary public_id used for deletion
  }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

export default News;