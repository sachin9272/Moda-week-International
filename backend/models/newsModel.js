import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['COSMETICS', 'EDUCATION', 'FASHION', 'FINE ART', 'PEFORMANCES', 'PAST EVENTS', 'TRAVEL']
  },
  date: { type: String }, // Custom display date
  image: {
    url: { type: String },        // secure/public URL stored from Cloudinary
    public_id: { type: String }   // Cloudinary public_id used for deletion
  },
  status: {
    type: String,
    enum: ['live', 'hidden', 'pending'],
    default: 'live'
  },
  submittedBy: {
    name: { type: String },
    email: { type: String }
  }
}, { timestamps: true });

const News = mongoose.model('News', newsSchema);

export default News;