import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQRCode } from './qrCodeService.js';
import { generatePdfFromHtml } from './pdfService.js';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

export const buildTicketsPdf = async (ticketsWithIds, eventDetails) => {
  const { title, date, location } = eventDetails;

  // Read the golden logo, background image, and lady image and convert to base64 data URLs for Puppeteer rendering
  const logoPath = path.join(__dirname, '..', 'assets', 'glodenlogo.png');
  const logoBase64 = fs.readFileSync(logoPath).toString('base64');
  const logoDataUrl = `data:image/png;base64,${logoBase64}`;

  const bgPath = path.join(__dirname, '..', 'assets', 'bg.png');
  const bgBase64 = fs.readFileSync(bgPath).toString('base64');
  const bgDataUrl = `data:image/png;base64,${bgBase64}`;

  const ladyPath = path.join(__dirname, '..', 'assets', 'lady_image.png');
  let ladyDataUrl = '';
  if (fs.existsSync(ladyPath)) {
    const ladyBase64 = fs.readFileSync(ladyPath).toString('base64');
    ladyDataUrl = `data:image/png;base64,${ladyBase64}`;
  }

  const coverImageDataUrl = eventDetails?.coverImage?.url || (typeof eventDetails?.coverImage === 'string' ? eventDetails.coverImage : ladyDataUrl);

  // ticketsWithIds should be an array of TicketSale objects (or objects containing _id, ticketName, quantity, price)
  // If it's a string, we parse it (backwards compatibility or error handling)
  let tickets = [];
  if (typeof ticketsWithIds === 'string') {
    tickets = JSON.parse(ticketsWithIds);
  } else {
    tickets = ticketsWithIds;
  }

  const safeTitle = escapeHtml(title);
  const safeLocation = escapeHtml(location);
  const formattedDate = date ? new Date(date).toDateString() : 'Date to be announced';

  // Generate QR Codes and prepare attachments
  const ticketRows = await Promise.all(tickets.map(async (t) => {
    // Safety check for _id
    const ticketId = t._id ? t._id.toString() : 'unknown-id';
    const safeTicketName = escapeHtml(t.ticketName || 'VIP Ticket');
    const safeTicketDisplayId = escapeHtml(ticketId);
    const safeBuyerName = escapeHtml(t.buyerName || 'Customer');
    const price = Number(t.price) || 0;
    const quantity = Number(t.quantity) || 0;

    const qrCodeDataUrl = await generateQRCode(ticketId);

    return `
    <main class="ticket-card" aria-label="Moda Week VIP ticket">
      <section class="ticket-main">
        <header class="brand">
          <img src="${logoDataUrl}" alt="Moda Week International" class="brand-logo" />
        </header>

        <div class="show-title">
          <span class="title-line"></span>
          <span class="show-title-text">${safeTitle}</span>
          <span class="title-line"></span>
        </div>

        <div class="category-badge-container">
          <span class="star-accent">✦</span>
          <div class="ticket-kind">${safeTicketName}</div>
          <span class="star-accent">✦</span>
        </div>

        ${coverImageDataUrl ? `<img src="${coverImageDataUrl}" class="lady-image" alt="Model" />` : ''}

        <div class="details">
          <article class="detail-row">
            <div class="icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>
            <div>
              <small>CUSTOMER NAME</small>
              <strong>${safeBuyerName}</strong>
            </div>
          </article>

          <article class="detail-row">
            <div class="icon-circle">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <div>
              <small>ADDRESS</small>
              <strong>${safeLocation}</strong>
            </div>
          </article>

          <article class="date-time-container">
            <div class="detail-row dt-half">
              <div class="icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z"/></svg>
              </div>
              <div>
                <small>DATE</small>
                <strong>${formattedDate}</strong>
              </div>
            </div>

            <div class="detail-row dt-half">
              <div class="icon-circle">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
              </div>
              <div>
                <small>TIME</small>
                <strong>04:00 PM</strong>
              </div>
            </div>
          </article>
        </div>

        <footer>
          <div class="footer-line">
            <span class="f-line"></span>
            <span class="star-accent">✦</span>
            <span class="f-line"></span>
          </div>
          <div class="footer-text">${formattedDate} @ ${safeLocation}</div>
        </footer>
      </section>

      <div class="perforation-divider" aria-hidden="true"></div>

      <aside class="ticket-stub">
        <header class="stub-brand">
          <img src="${logoDataUrl}" alt="Moda Week International" class="stub-logo" />
        </header>

        <div class="stub-badge">TICKET TYPE</div>
        <div class="vip-text">${escapeHtml((t.ticketName || 'VIP').split(' ')[0])}</div>
        <div class="stub-ornament">✦</div>

        <div class="qr-container" aria-label="Ticket QR code">
          <img src="${qrCodeDataUrl}" alt="QR Code" style="width: 100%; height: 100%; object-fit: contain;" />
        </div>

        <div class="id-section">
          <small class="id-label">TICKET ID</small>
          <strong class="id-code">${safeTicketDisplayId}</strong>
        </div>

        <div class="dotted-sep">...................................</div>

        <div class="admit-text">✦ &nbsp; ADMIT ONE &nbsp; ✦</div>
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
    <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&display=swap" rel="stylesheet" />
    <style>
      :root {
        --gold-primary: #a47027;
        --gold-light: #dfb368;
        --gold-dark: #805315;
        --dark-text: #1a1a1a;
      }
      * { box-sizing: border-box; }
      body { margin: 0; padding: 0; background: #eef0f2; font-family: 'Montserrat', Arial, sans-serif; }
      
      .ticket-wrapper {
        width: 1220px;
        height: 765px;
        display: flex;
        align-items: center;
        justify-content: center;
        page-break-after: always;
      }

      .ticket-card {
        position: relative;
        width: 1200px;
        height: 735px;
        display: grid;
        grid-template-columns: minmax(0, 2.05fr) 40px minmax(320px, 0.84fr);
        background: url('${bgDataUrl}') no-repeat center center;
        background-size: 100% 100%;
        overflow: hidden;
      }

      /* Main Left Section */
      .ticket-main {
        position: relative;
        padding: 50px 50px 30px;
        background: transparent;
      }

      /* Header Brand */
      .brand {
        position: relative;
        text-align: center;
        margin-bottom: 10px;
      }
      .brand-logo {
        max-width: 450px;
        width: 100%;
        height: auto;
        display: block;
        margin: 25px auto;
      }

      /* Show Title */
      .show-title {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 16px;
        margin: 12px 0 18px;
      }
      .title-line {
        flex: 1;
        max-width: 90px;
        height: 1.5px;
        background: linear-gradient(90deg, transparent, var(--gold-primary), transparent);
      }
      .show-title-text {
        font-size: 18px;
        font-weight: 800;
        letter-spacing: 3px;
        color: var(--dark-text);
        text-transform: uppercase;
      }

      /* Category Badge */
      .category-badge-container {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 24px;
      }
      .star-accent {
        color: var(--gold-primary);
        font-size: 18px;
      }
      .ticket-kind {
        background: linear-gradient(135deg, #a47027 0%, #d8a553 50%, #805315 100%);
        color: #ffffff;
        font-size: 17px;
        font-weight: 800;
        letter-spacing: 3px;
        padding: 9px 30px;
        border-radius: 6px;
        text-transform: uppercase;
        box-shadow: 0 3px 8px rgba(164, 112, 39, 0.3);
      }

      /* Lady Model Image Overlay */
      .lady-image {
        position: absolute;
        right: 15px;
        bottom: 25px;
        height: 480px;
        max-width: 360px;
        object-fit: contain;
        z-index: 3;
        pointer-events: none;
      }

      /* Details Section */
      .details {
        position: relative;
        width: 420px;
        z-index: 4;
        margin-top: 70px;
        margin-left: 60px;
      }
      .detail-row {
        display: flex;
        align-items: center;
        gap: 16px;
        padding: 12px 0;
        border-bottom: 1.5px dotted #e5c898;
      }
      .icon-circle {
        flex: none;
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: linear-gradient(135deg, #a47027, #805315);
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1.5px solid var(--gold-light);
        box-shadow: 0 2px 5px rgba(0,0,0,0.15);
      }
      small {
        display: block;
        color: var(--gold-primary);
        font-weight: 700;
        letter-spacing: 1.8px;
        font-size: 13px;
        margin-bottom: 3px;
      }
      strong {
        display: block;
        color: var(--dark-text);
        font-weight: 700;
        font-size: 18px;
        letter-spacing: 1px;
        line-height: 1.25;
      }

      .date-time-container {
        display: flex;
        gap: 20px;
      }
      .dt-half {
        flex: 1;
        border-bottom: none;
      }

      /* Main Footer */
      footer {
        position: absolute;
        bottom: 25px;
        left: 50px;
        right: 50px;
        z-index: 4;
        text-align: center;
      }
      .footer-line {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 8px;
      }
      .f-line {
        flex: 1;
        height: 1px;
        background: var(--gold-light);
      }
      .footer-text {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        color: var(--dark-text);
        text-transform: uppercase;
      }

      /* Perforation Divider */
      .perforation-divider {
        position: relative;
        background: transparent;
      }
      .perforation-divider::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 40px;
        bottom: 40px;
        border-left: 3px dashed #a47027;
        transform: translateX(-50%);
      }

      /* Ticket Stub Right */
      .ticket-stub {
        position: relative;
        padding: 50px 10px 30px 0px;
        margin-left: -20px;
        background: transparent;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        width: calc(100% + 20px);
      }

      .stub-brand {
        margin-bottom: 16px;
      }
      .stub-logo {
        max-width: 170px;
        width: 100%;
        height: auto;
        display: block;
      }

      .stub-badge {
        background: linear-gradient(135deg, #a47027, #805315);
        color: #ffffff;
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 2px;
        padding: 6px 20px;
        border-radius: 4px;
        margin-bottom: 14px;
      }

      .vip-text {
        font-family: 'Playfair Display', serif;
        font-size: 54px;
        font-weight: 700;
        color: var(--gold-primary);
        letter-spacing: 4px;
        line-height: 1;
        margin-bottom: 6px;
      }

      .stub-ornament {
        color: var(--gold-primary);
        font-size: 18px;
        margin-bottom: 16px;
      }

      .qr-container {
        width: 175px;
        height: 175px;
        border: 3px solid var(--gold-primary);
        border-radius: 10px;
        padding: 10px;
        background: #ffffff;
        box-shadow: 0 3px 10px rgba(0,0,0,0.08);
        margin-bottom: 18px;
      }

      .id-section {
        margin-bottom: 10px;
      }
      .id-label {
        display: block;
        color: var(--gold-primary);
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 2px;
        margin-bottom: 4px;
      }
      .id-code {
        font-size: 15px;
        font-weight: 800;
        color: var(--dark-text);
        letter-spacing: 1.5px;
      }

      .dotted-sep {
        color: var(--gold-light);
        letter-spacing: 3px;
        font-size: 14px;
        margin-bottom: 12px;
      }

      .admit-text {
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 2px;
        color: var(--dark-text);
        text-transform: uppercase;
      }
    </style>
  </head>
  <body>
    ${ticketRows.map(row => `<div class="ticket-wrapper">${row}</div>`).join('')}
  </body>
</html>
    `;

  const pdfBuffer = await generatePdfFromHtml(message);

  return { pdfBuffer, totalAmount, safeTitle };
};

export const sendTicketEmail = async (to, ticketsWithIds, eventDetails) => {
  const { title } = eventDetails;
  const { pdfBuffer, totalAmount, safeTitle } = await buildTicketsPdf(ticketsWithIds, eventDetails);

  const simpleMessage = `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <p style="font-size: 16px;">Hi there,</p>
            <p style="font-size: 16px;">Thank you for your purchase. Your tickets for <strong>${safeTitle}</strong> are attached to this email as a PDF document.</p>
            <p style="font-size: 16px;">Please present the attached PDF at the venue entrance for scanning.</p>
            <p style="font-size: 18px; font-weight: bold;">Total Paid: $${totalAmount.toFixed(2)}</p>
        </div>
    `;

  const attachments = [{
    filename: 'tickets.pdf',
    content: pdfBuffer,
    contentType: 'application/pdf'
  }];

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
