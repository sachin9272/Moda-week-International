import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
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
    };

    // Send email
    await transporter.sendMail(mailOptions);
};

export const sendTicketEmail = async (to, ticketDetails, eventDetails) => {
    const { title, date, location, coverImage } = eventDetails;
    const tickets = JSON.parse(ticketDetails);

    const ticketRows = tickets.map(t => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px;">${t.ticketName}</td>
            <td style="padding: 10px; text-align: center;">${t.quantity}</td>
            <td style="padding: 10px; text-align: right;">$${t.price}</td>
        </tr>
    `).join('');

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0);

    const message = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
            <div style="background-color: #000; color: #fff; padding: 20px; text-align: center;">
                <h1>Ticket Confirmation</h1>
            </div>
            <div style="padding: 20px;">
                <p>Hi there,</p>
                <p>Thank you for your purchase! Here are your tickets for <strong>${title}</strong>.</p>
                
                <div style="margin: 20px 0; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
                    <img src="${coverImage?.url || ''}" alt="${title}" style="width: 100%; height: 200px; object-cover: cover;" />
                    <div style="padding: 15px;">
                        <h3 style="margin-top: 0;">${title}</h3>
                        <p style="margin: 5px 0; color: #666;">📅 ${new Date(date).toDateString()}</p>
                        <p style="margin: 5px 0; color: #666;">📍 ${location}</p>
                    </div>
                </div>

                <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                    <thead>
                        <tr style="background-color: #f9f9f9; text-align: left;">
                            <th style="padding: 10px;">Ticket Type</th>
                            <th style="padding: 10px; text-align: center;">Qty</th>
                            <th style="padding: 10px; text-align: right;">Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${ticketRows}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="2" style="padding: 10px; text-align: right; font-weight: bold;">Total</td>
                            <td style="padding: 10px; text-align: right; font-weight: bold;">$${totalAmount.toFixed(2)}</td>
                        </tr>
                    </tfoot>
                </table>

                <p style="margin-top: 30px;">Present this email at the entrance.</p>
            </div>
            <div style="text-align: center; padding: 20px; color: #aaa; font-size: 12px;">
                &copy; ${new Date().getFullYear()} Moda Week International. All rights reserved.
            </div>
        </div>
    `;

    await sendEmail({
        email: to,
        subject: `Your Tickets for ${title}`,
        message: `Your tickets for ${title} are confirmed. Total: $${totalAmount}`, // Fallback text
        html: message
    });
};

export default sendEmail;