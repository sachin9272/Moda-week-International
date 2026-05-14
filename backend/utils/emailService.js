import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateQRCode } from './qrCodeService.js';
dotenv.config();

const escapeHtml = (value = '') =>
    String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

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
    const safeTitle = escapeHtml(title);
    const safeLocation = escapeHtml(location);
    const formattedDate = date ? new Date(date).toDateString() : 'Date to be announced';

    // Generate QR Codes and prepare attachments
    const ticketRows = await Promise.all(tickets.map(async (t) => {
        // Safety check for _id
        const ticketId = t._id ? t._id.toString() : 'unknown-id';
        const safeTicketName = escapeHtml(t.ticketName || 'Ticket');
        const safeTicketDisplayId = escapeHtml(ticketId);
        const price = Number(t.price) || 0;
        const quantity = Number(t.quantity) || 0;

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
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; border: 1px solid #e5e7eb; border-radius: 16px; margin-bottom: 16px; overflow: hidden; background: #ffffff; border-collapse: separate;">
            <tr>
                <td class="ticket-stack ticket-copy" style="padding: 18px 18px 14px; vertical-align: top;">
                    <h3 style="margin: 0 0 8px 0; color: #d97706; font-size: 20px; line-height: 1.3;">${safeTicketName}</h3>
                    <p style="margin: 0 0 8px 0; font-size: 13px; line-height: 1.5; color: #6b7280; word-break: break-word;">Ticket ID: ${safeTicketDisplayId}</p>
                    <p style="margin: 0 0 6px 0; font-size: 18px; line-height: 1.4; font-weight: bold; color: #111827;">$${price.toFixed(2)}</p>
                    <p style="margin: 0; font-size: 13px; line-height: 1.5; color: #6b7280;">Quantity: ${quantity}</p>
                </td>
                <td class="ticket-stack ticket-qr" width="132" style="width: 132px; padding: 18px; background: #f9fafb; text-align: center; vertical-align: middle; border-left: 1px dashed #d1d5db;">
                    <img src="cid:${cid}" alt="QR Code" style="width: 96px; height: 96px; display: inline-block; margin: 0 auto;" />
                </td>
            </tr>
        </table>
        `;
    }));

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0);

    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <style>
                body, table, td, p, a { font-family: Helvetica, Arial, sans-serif; }
                img { border: 0; line-height: 100%; outline: none; text-decoration: none; }
                table { border-collapse: collapse; }
                @media only screen and (max-width: 600px) {
                    .email-shell { width: 100% !important; }
                    .email-body { padding: 20px !important; }
                    .hero-body { padding: 18px !important; }
                    .ticket-stack { display: block !important; width: 100% !important; box-sizing: border-box !important; }
                    .ticket-copy { padding-bottom: 8px !important; }
                    .ticket-qr { border-left: none !important; border-top: 1px dashed #d1d5db !important; padding-top: 14px !important; }
                    .event-image { height: auto !important; }
                    .summary-total { text-align: left !important; }
                }
            </style>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f3f4f6; color: #333333;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; background-color: #f3f4f6;">
                <tr>
                    <td align="center" style="padding: 20px 12px;">
                        <table role="presentation" class="email-shell" width="600" cellpadding="0" cellspacing="0" border="0" style="width: 100%; max-width: 600px;">
                            <tr>
                                <td style="background-color: #000000; color: #d97706; padding: 28px 20px; text-align: center; border-radius: 16px 16px 0 0;">
                                    <h1 style="margin: 0; font-family: Georgia, 'Times New Roman', serif; font-size: 32px; line-height: 1.2; letter-spacing: 1px;">MODA WEEK</h1>
                                    <p style="margin: 10px 0 0 0; font-size: 13px; line-height: 1.5; text-transform: uppercase; letter-spacing: 2px; color: #ffffff;">Ticket Confirmation</p>
                                </td>
                            </tr>
                            <tr>
                                <td class="email-body" style="background-color: #ffffff; padding: 30px; border-radius: 0 0 16px 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.05);">
                                    <p style="margin: 0 0 14px 0; font-size: 16px; line-height: 1.6;">Hi there,</p>
                                    <p style="margin: 0 0 22px 0; font-size: 16px; line-height: 1.6;">Thank you for your purchase. Here are your tickets for <strong>${safeTitle}</strong>.</p>

                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin: 0 0 26px 0; border-radius: 16px; overflow: hidden; background: #111111;">
                                        ${coverImage?.url ? `
                                        <tr>
                                            <td>
                                                <img class="event-image" src="${coverImage.url}" alt="${safeTitle}" style="width: 100%; height: 200px; display: block; object-fit: cover;" />
                                            </td>
                                        </tr>` : ''}
                                        <tr>
                                            <td class="hero-body" style="padding: 20px; color: #ffffff;">
                                                <h2 style="margin: 0 0 10px 0; font-size: 22px; line-height: 1.3;">${safeTitle}</h2>
                                                <p style="margin: 0 0 6px 0; font-size: 14px; line-height: 1.6; color: #d1d5db;">Date: ${formattedDate}</p>
                                                <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #d1d5db;">Location: ${safeLocation}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <div style="margin-top: 10px;">
                                        <h3 style="margin: 0 0 18px 0; padding-bottom: 10px; font-size: 20px; line-height: 1.4; border-bottom: 2px solid #eeeeee; color: #111827;">Your Tickets</h3>
                                        ${ticketRows.join('')}
                                    </div>

                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 26px; border-top: 2px solid #eeeeee;">
                                        <tr>
                                            <td class="summary-total" style="padding-top: 16px; text-align: right;">
                                                <p style="margin: 0; font-size: 18px; line-height: 1.5; font-weight: bold; color: #111827;">Total Paid: $${totalAmount.toFixed(2)}</p>
                                            </td>
                                        </tr>
                                    </table>

                                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width: 100%; margin-top: 32px; background-color: #fffbeb; border: 1px solid #fcd34d; border-radius: 12px;">
                                        <tr>
                                            <td style="padding: 16px; font-size: 14px; line-height: 1.6; color: #92400e;">
                                                <strong>Important:</strong> Please present the QR code(s) above at the venue entrance for scanning.
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 18px 8px 0; text-align: center; color: #888888; font-size: 12px; line-height: 1.6;">
                                    &copy; ${new Date().getFullYear()} Moda Week International. All rights reserved.
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

    await sendEmail({
        email: to,
        subject: `Your Tickets for ${title}`,
        message: `Your tickets for ${title} are confirmed. Total: $${totalAmount}`, // Fallback text
        html: message,
        attachments: attachments
    });
};

export const sendScannerInviteEmail = async (to, name, password, scannerUrl) => {
    const message = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
                body { font-family: Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; color: #333; }
                .container { max-width: 600px; margin: 20px auto; background-color: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
                .header { background-color: #000; padding: 28px 20px; text-align: center; color: #d97706; }
                .body { padding: 30px; }
                .credentials { background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 20px 0; }
                .button { display: inline-block; background-color: #d97706; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; margin-top: 10px; }
                .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-family: Georgia, serif; font-size: 28px;">MODA WEEK</h1>
                    <p style="margin:5px 0 0; color:#fff; text-transform:uppercase; letter-spacing:2px; font-size:12px;">Scanner Operator Invitation</p>
                </div>
                <div class="body">
                    <p>Hi <strong>${name}</strong>,</p>
                    <p>You have been invited to be a Ticket Scanner Operator for Moda Week International events.</p>
                    <p>Use the credentials below to log in to the web scanner tool from your Android or iPhone browser:</p>
                    
                    <div class="credentials">
                        <p style="margin: 0 0 8px;"><strong>Email:</strong> ${to}</p>
                        <p style="margin: 0;"><strong>Temporary Password:</strong> <code style="background:#fff; padding:3px 6px; border-radius:4px; border:1px solid #ccc; font-size:14px;">${password}</code></p>
                    </div>

                    <p style="margin-top: 25px;">Click the button below to open the scanner tool and log in:</p>
                    <center>
                        <a href="${scannerUrl}" class="button" style="color: #ffffff;">Open Web Scanner</a>
                    </center>

                    <p style="margin-top: 30px; font-size: 14px; color: #666;">
                        <em>Tip: Add this scanner page to your phone's home screen for easy access on the day of the event.</em>
                    </p>
                </div>
                <div class="footer">
                    &copy; ${new Date().getFullYear()} Moda Week International. All rights reserved.
                </div>
            </div>
        </body>
        </html>
    `;

    await sendEmail({
        email: to,
        subject: "📢 Ticket Scanner Access Granted - Moda Week International",
        message: `You have been added as a ticket scanner operator. Login URL: ${scannerUrl}\nEmail: ${to}\nPassword: ${password}`,
        html: message
    });
};

export default sendEmail;
