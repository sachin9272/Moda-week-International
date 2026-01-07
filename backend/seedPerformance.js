
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FashionDesigner from './models/fashionDesignerModel.js';

dotenv.config();

const dummyData = [
    // Dancers
    {
        name: "Elena Rodriguez",
        country: "Spain",
        countryCode: "ES",
        category: "Dancer",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80" }
    },
    {
        name: "Kai Sato",
        country: "Japan",
        countryCode: "JP",
        category: "Dancer",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80" }
    },
    {
        name: "Mikhail Ivanov",
        country: "Russia",
        countryCode: "RU",
        category: "Dancer",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1518834107812-1492b124ac4e?auto=format&fit=crop&q=80" }
    },
    // Fine Artists
    {
        name: "Sophie Dubois",
        country: "France",
        countryCode: "FR",
        category: "Fine Artist",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80" }
    },
    {
        name: "Liam O'Connor",
        country: "Ireland",
        countryCode: "IE",
        category: "Fine Artist",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80" }
    },
    // Singers
    {
        name: "Aria Vance",
        country: "United Kingdom",
        countryCode: "GB",
        category: "Singer",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?auto=format&fit=crop&q=80" }
    },
    {
        name: "Mateo Silva",
        country: "Brazil",
        countryCode: "BR",
        category: "Singer",
        instagram: "https://instagram.com",
        image: { url: "https://images.unsplash.com/photo-1525994886773-080587e161c2?auto=format&fit=crop&q=80" }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to DB");

        for (const data of dummyData) {
            // Check if exists to avoid duplicates (by name)
            const exists = await FashionDesigner.findOne({ name: data.name, category: data.category });
            if (!exists) {
                await FashionDesigner.create(data);
                console.log(`Added: ${data.name} (${data.category})`);
            } else {
                console.log(`Skipped: ${data.name} (Already exists)`);
            }
        }

        console.log("Seeding complete!");
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
