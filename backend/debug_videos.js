
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import LandingVideo from './models/LandingVideo.js';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

const checkVideos = async () => {
    await connectDB();
    const videos = await LandingVideo.find({});
    videos.forEach(v => {
        console.log(`Title: ${v.title}, URL: ${v.videoUrl}`);
    });
    process.exit();
};

checkVideos();
