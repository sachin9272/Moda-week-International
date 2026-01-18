import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateQRCode } from './qrCodeService.js';
dotenv.config();
const sendEmail = async (options) => {
    // Create a transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail', // or your email service
        auth: {
            user: process.env.SMPT_MAIL,
            pass: process.env.SMPT_PASSWORD,
        },
    });

    // Define email options
    const mailOptions = {
        from: process.env.SMPT_MAIL,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html, // Optional: if you want to send HTML email
        attachments: options.attachments // Include attachments if any
    };

    // Send email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.response}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw error; // Re-throw to be caught by controller
    }
};

export const sendTicketEmail = async (to, ticketsWithIds, eventDetails) => {
    const { title, date, location, coverImage } = eventDetails;

    // ticketsWithIds should be an array of TicketSale objects (or objects containing _id, ticketName, quantity, price)
    // If it's a string, we parse it (backwards compatibility or error handling)
    let tickets = [];
    if (typeof ticketsWithIds === 'string') {
        tickets = JSON.parse(ticketsWithIds);
    } else {
        tickets = ticketsWithIds;
    }

    // Attachments array for Nodemailer
    const attachments = [];

    // Generate QR Codes and prepare attachments
    const ticketRows = await Promise.all(tickets.map(async (t) => {
        // Safety check for _id
        const ticketId = t._id ? t._id.toString() : 'unknown-id';

        const qrCodeDataUrl = await generateQRCode(ticketId);
        const cid = `qr-${ticketId}@modaweek`; // Unique Data CID

        // Add to attachments if valid
        if (qrCodeDataUrl) {
            attachments.push({
                filename: `qr-${t._id}.png`,
                path: qrCodeDataUrl,
                cid: cid // same cid value as in the html img src
            });
        }

        return `
        <div style="border: 1px solid #ddd; border-radius: 8px; margin-bottom: 15px; overflow: hidden; display: flex; flex-direction: row; background: #fff;">
            <div style="padding: 15px; flex: 1;">
                <h3 style="margin: 0 0 5px 0; color: #d97706;">${t.ticketName}</h3>
                <p style="margin: 5px 0; font-size: 14px; color: #666;">Ticket ID: ${t._id}</p>
                <p style="margin: 5px 0; font-weight: bold;">$${t.price}</p>
                <p style="margin: 5px 0; font-size: 12px; color: #999;">Qty: ${t.quantity}</p> 
            </div>
            <div style="padding: 10px; background: #f9f9f9; display: flex; align-items: center; justify-content: center;">
                <img src="cid:${cid}" alt="QR Code" style="width: 100px; height: 100px; display: block;" />
            </div>
        </div>
        `;
    }));

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0);

    const message = `
        <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333; background-color: #f4f4f4; padding: 20px;">
            <div style="background-color: #000; color: #d97706; padding: 30px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="margin: 0; font-family: serif; letter-spacing: 1px;">MODA WEEK</h1>
                <p style="margin: 10px 0 0 0; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; color: #fff;">Ticket Confirmation</p>
            </div>
            
            <div style="background-color: #fff; padding: 30px; border-radius: 0 0 8px 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                <p style="font-size: 16px; line-height: 1.5;">Hi there,</p>
                <p style="font-size: 16px; line-height: 1.5;">Thank you for your purchase. Here are your tickets for <strong>${title}</strong>.</p>
                
                <div style="margin: 25px 0; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                    <img src="${coverImage?.url || ''}" alt="${title}" style="width: 100%; height: 200px; object-fit: cover;" />
                    <div style="padding: 20px; background: #111; color: #fff;">
                        <h2 style="margin: 0 0 10px 0; font-size: 20px;">${title}</h2>
                        <p style="margin: 5px 0; color: #ccc;">📅 ${new Date(date).toDateString()}</p>
                        <p style="margin: 5px 0; color: #ccc;">📍 ${location}</p>
                    </div>
                </div>

                <div style="margin-top: 30px;">
                    <h3 style="border-bottom: 2px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Your Tickets</h3>
                    ${ticketRows.join('')}
                </div>

                <div style="margin-top: 30px; text-align: right; border-top: 2px solid #eee; padding-top: 15px;">
                    <p style="font-size: 18px; font-weight: bold; margin: 0;">Total Paid: $${totalAmount.toFixed(2)}</p>
                </div>

                <div style="margin-top: 40px; background-color: #fffbeb; border: 1px solid #fcd34d; padding: 15px; border-radius: 8px; font-size: 14px; color: #92400e;">
                    <strong>Important:</strong> Please simply present the QR code(s) above at the venue entrance for scanning.
                </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Moda Week International. All rights reserved.
            </div>
        </div>
    `;

    await sendEmail({
        email: to,
        subject: `Your Tickets for ${title}`,
        message: `Your tickets for ${title} are confirmed. Total: $${totalAmount}`, // Fallback text
        html: message,
        attachments: attachments
    });
};

export default sendEmail;