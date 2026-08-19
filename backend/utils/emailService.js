import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { generateQRCode } from './qrCodeService.js';
import { generatePdfFromHtml } from './pdfService.js';
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
        const safeBuyerName = escapeHtml(t.buyerName || 'Customer');
        const price = Number(t.price) || 0;
        const quantity = Number(t.quantity) || 0;

        const qrCodeDataUrl = await generateQRCode(ticketId);

        return `
    <main class="ticket" aria-label="Moda Week VIP ticket">
      <section class="ticket-main">
        <div class="skyline" aria-hidden="true"></div>
        <header class="brand">
          <div class="brand-name">MODA</div>
          <div class="brand-subtitle">WEEK INTERNATIONAL</div>
        </header>
        <div class="show-title">
          <span></span>${safeTitle}<span></span>
        </div>
        <div class="ticket-kind">${safeTicketName}</div>

        <div class="details">
          <article class="detail-row">
            <div class="icon">●</div>
            <div><small>CUSTOMER NAME</small><strong>${safeBuyerName}</strong></div>
          </article>
          <article class="detail-row">
            <div class="icon pin">●</div>
            <div>
              <small>ADDRESS</small><strong>${safeLocation}</strong>
            </div>
          </article>
          <article class="date-time">
            <div class="detail-row">
              <div class="icon calendar">▣</div>
              <div><small>DATE</small><strong>${formattedDate}</strong></div>
            </div>
            <div class="detail-row">
              <div class="icon clock">◷</div>
              <div><small>TIME</small><strong>TBA</strong></div>
            </div>
          </article>
        </div>
        ${coverImage?.url ? `<img class="model" src="${coverImage.url}" alt="Model" aria-hidden="true">` : ''}
        <footer>
          ${formattedDate} @ ${safeLocation}
        </footer>
      </section>

      <div class="perforation" aria-hidden="true"></div>

      <aside class="ticket-stub">
        <header class="stub-brand">
          <b>MODA</b><span>WEEK INTERNATIONAL</span>
        </header>
        <div class="stub-label">TICKET TYPE</div>
        <div class="vip">${safeTicketName.substring(0, 5)}</div>
        <div class="ornament">— ✦ —</div>
        <div class="qr" aria-label="Ticket QR code">
          <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>
        <small class="id-label">TICKET ID</small>
        <strong class="id" style="font-size: 13px; word-break: break-all;">${safeTicketDisplayId}</strong>
        <div class="admit">✦ &nbsp; ADMIT ONE &nbsp; ✦</div>
      </aside>
    </main>
        `;
    }));

    const totalAmount = tickets.reduce((sum, t) => sum + (t.price * t.quantity), 0);

    const message = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Moda Week International — Tickets</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />
    <style>
      :root { --gold: #ad7311; --dark: #121212; --paper: #fffefa; }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #f3f3f1; font-family: Montserrat, Arial, sans-serif; }
      .ticket-wrapper { width: 1220px; height: 765px; display: flex; align-items: center; justify-content: center; page-break-after: always; }
      .ticket { width: 1200px; height: 735px; display: grid; grid-template-columns: minmax(0, 2.05fr) 44px minmax(320px, 0.84fr); filter: drop-shadow(0 3px 5px #7778); zoom: 1; margin: 0; }
      .ticket-main, .ticket-stub { position: relative; overflow: hidden; background: var(--paper); border: 2px solid #c18a2a; }
      .ticket-main { padding: 58px 62px 38px; border-radius: 24px 0 0 24px; }
      .ticket-main:before, .ticket-stub:before { content: ""; position: absolute; inset: 10px; border: 1px solid #d6a54e; pointer-events: none; }
      .ticket-main:after { content: ""; position: absolute; width: 115px; height: 115px; right: -58px; top: -58px; background: #f3f3f1; border-radius: 50%; box-shadow: 0 0 5px #5558 inset; }
      .skyline { position: absolute; left: 0; bottom: 0; width: 100%; height: 63%; opacity: 0.15; background: linear-gradient(90deg, transparent 7%, #b5b8b7 7% 10%, transparent 10% 13%, #c8c9c8 13% 16%, transparent 16% 18%, #aeb2b2 18% 22%, transparent 22% 26%, #c4c4c1 26% 29%, transparent 29%), repeating-linear-gradient(90deg, transparent 0 53px, #aeb2b2 54px 65px, transparent 66px 91px); clip-path: polygon(0 100%, 0 48%, 5% 48%, 7% 26%, 9% 48%, 13% 48%, 15% 15%, 17% 48%, 22% 48%, 26% 37%, 29% 48%, 35% 48%, 39% 25%, 42% 48%, 49% 48%, 54% 32%, 58% 48%, 66% 48%, 70% 21%, 73% 48%, 82% 48%, 88% 35%, 91% 48%, 100% 48%, 100% 100%); }
      .brand { position: relative; text-align: center; color: var(--gold); }
      .brand-name { font-size: clamp(68px, 10vw, 130px); font-weight: 500; letter-spacing: -10px; line-height: 0.72; font-family: "Playfair Display", serif; }
      .brand-subtitle { margin-top: 18px; font: 500 clamp(20px, 3vw, 36px)/1 "Playfair Display", serif; letter-spacing: 2px; }
      .show-title { position: relative; display: flex; align-items: center; justify-content: center; gap: 14px; font-size: 21px; font-weight: 800; letter-spacing: 1.4px; margin: 27px 0 28px; text-transform: uppercase; }
      .show-title span { width: 60px; height: 2px; background: #c99132; }
      .ticket-kind { position: relative; background: linear-gradient(100deg, #9a6004, #d49b32); color: white; font-size: 21px; font-weight: 700; letter-spacing: 4px; width: max-content; margin: 0 auto 42px; padding: 13px 28px; text-transform: uppercase; }
      .details { position: relative; width: 69%; z-index: 1; }
      .detail-row { display: flex; align-items: center; gap: 18px; min-height: 92px; border-bottom: 1px solid #d7c9ad; }
      .icon { flex: none; display: grid; place-items: center; width: 48px; height: 48px; border-radius: 50%; background: var(--gold); color: #fff; font-size: 28px; border: 1px solid #e0b24e; }
      .icon.pin { font-size: 0; }
      .icon.pin:after { content: "♦"; font-size: 29px; transform: rotate(45deg); }
      .icon.calendar { font-size: 28px; }
      .icon.clock { font-size: 38px; }
      small { display: block; color: #9e6711; font-weight: 600; letter-spacing: 2px; font-size: 15px; margin-bottom: 8px; }
      strong { display: block; letter-spacing: 1.3px; font-size: 22px; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
      p { margin: 5px 0 0; font-size: 17px; }
      .date-time { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
      .date-time .detail-row { gap: 13px; }
      .date-time strong { font-size: 20px; }
      .model { position: absolute; z-index: 2; bottom: -4px; right: 4%; height: 430px; width: auto; object-fit: contain; pointer-events: none; }
      footer { position: absolute; z-index: 3; bottom: 35px; left: 62px; right: 25px; font-size: 12px; font-weight: 800; letter-spacing: 2.2px; white-space: nowrap; text-transform: uppercase; }
      .perforation { position: relative; background: #fffefa; }
      .perforation:after { content: ""; position: absolute; left: 50%; top: 36px; bottom: 36px; border-left: 4px dashed #ad7311; }
      .ticket-stub { border-radius: 0 24px 24px 0; text-align: center; padding: 60px 42px 40px; background: radial-gradient(ellipse at 115% 0, #e9d5a7 0 2%, transparent 2.5% 5%, #e9d5a7 5.5% 6%, transparent 6.5%) 100% 0/130px 130px, #fffdf7; }
      .stub-brand { position: relative; color: var(--gold); font-family: "Playfair Display", serif; }
      .stub-brand b { display: block; letter-spacing: -5px; font-size: 50px; line-height: 0.8; }
      .stub-brand span { font-size: 13px; }
      .stub-label { position: relative; margin: 20px auto 45px; padding: 10px 15px; background: var(--gold); color: #fff; font-size: 19px; letter-spacing: 2px; }
      .vip { position: relative; color: var(--gold); font: 600 52px/1 "Playfair Display", serif; text-transform: uppercase; }
      .ornament { position: relative; margin: 22px 0 34px; color: #bd8123; font-size: 22px; letter-spacing: 10px; }
      .qr { position: relative; width: 205px; aspect-ratio: 1; margin: auto; border: 4px solid var(--gold); background: #fff; padding: 14px; }
      .id-label { position: relative; margin-top: 44px; }
      .id { position: relative; font-size: 17px; }
      .admit { position: absolute; bottom: 53px; left: 0; width: 100%; color: #111; font-size: 17px; font-weight: 500; letter-spacing: 2px; }
      @media (max-width: 800px) {
        body { padding: 16px; }
        .ticket { grid-template-columns: 1fr; max-width: 520px; zoom: 1; }
        .ticket-main { min-height: 690px; padding: 52px 34px 82px; border-radius: 22px 22px 0 0; }
        .perforation { height: 30px; }
        .perforation:after { left: 30px; right: 30px; top: 50%; bottom: auto; border-left: 0; border-top: 4px dashed #ad7311; }
        .ticket-stub { min-height: 620px; border-radius: 0 0 22px 22px; }
        .details { width: 100%; }
        .model { opacity: 0.22; right: -38px; }
        .brand-name { font-size: 78px; }
        .brand-subtitle { font-size: 23px; }
        .show-title { font-size: 14px; }
        .ticket-kind { font-size: 15px; letter-spacing: 2px; }
        footer { left: 34px; white-space: normal; }
        .date-time strong { font-size: 16px; }
      }
    </style>
  </head>
  <body>
    ${ticketRows.map(row => `<div class="ticket-wrapper">${row}</div>`).join('')}
  </body>
</html>
    `;

    const pdfBuffer = await generatePdfFromHtml(message);

    const simpleMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p style="font-size: 16px;">Hi there,</p>
            <p style="font-size: 16px;">Thank you for your purchase. Your tickets for <strong>${safeTitle}</strong> are attached to this email as a PDF document.</p>
            <p style="font-size: 16px;">Please present the attached PDF at the venue entrance for scanning.</p>
            <p style="font-size: 18px; font-weight: bold;">Total Paid: $${totalAmount.toFixed(2)}</p>
        </div>
    `;

    attachments.push({
        filename: 'tickets.pdf',
        content: pdfBuffer,
        contentType: 'application/pdf'
    });

    await sendEmail({
        email: to,
        subject: `Your Tickets for ${title}`,
        message: `Your tickets for ${title} are attached. Total: $${totalAmount}`, // Fallback text
        html: simpleMessage,
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
