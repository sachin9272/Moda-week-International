import { sendTicketEmail } from './utils/emailService.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const run = async () => {
    try {
        const toEmail = process.env.SMPT_MAIL;
        if (!toEmail) {
            throw new Error("No SMPT_MAIL found in .env");
        }
        
        // We convert the local image to a base64 data URL so Puppeteer can render it reliably
        const ladyImagePath = path.join(__dirname, 'public', 'lady image.png');
        const ladyImageBase64 = fs.readFileSync(ladyImagePath).toString('base64');
        const coverImageDataUrl = `data:image/png;base64,${ladyImageBase64}`;

        const eventDetails = {
            title: "Moda Week Fashion Show 2026",
            date: new Date().toISOString(),
            location: "Istanbul Expo Center, Turkey",
            coverImage: { url: coverImageDataUrl } 
        };

        const tickets = [
            {
                _id: "test-ticket-xyz-123",
                ticketName: "VIP Front Row",
                buyerName: "John Doe",
                quantity: 1,
                price: 250.00
            }
        ];

        console.log(`Generating PDF ticket and sending test email to ${toEmail}...`);
        await sendTicketEmail(toEmail, tickets, eventDetails);
        console.log("Email sent successfully! Please check your inbox.");
        
        // Exit process
        process.exit(0);
    } catch (error) {
        console.error("Test failed:", error);
        process.exit(1);
    }
};

run();
