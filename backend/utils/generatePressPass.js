import puppeteer from 'puppeteer-core';
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Downloads a remote image (e.g. an S3 URL) and inlines it as a base64 data URL,
// since Puppeteer's headless page has no session/credentials to fetch it live.
const fetchImageAsBase64 = async (url) => {
    if (!url) return '';
    try {
        const response = await axios.get(url, { responseType: 'arraybuffer', timeout: 15000 });
        const contentType = response.headers['content-type'] || 'image/jpeg';
        return `data:${contentType};base64,${Buffer.from(response.data).toString('base64')}`;
    } catch (e) {
        console.error("Error fetching applicant photo for press pass", e.message);
        return '';
    }
};

export const generatePressPass = async ({
    fullName,
    companyName,
    mediaName,
    location,
    qrData,
    photoUrl,
}) => {
    // Determine the primary name for the pass
    const passCompany = (mediaName || companyName || "COMPANY").toUpperCase();
    const passName = (fullName || "USERNAME").toUpperCase();
    const passLocation = (location || "ISTANBUL, TURKEY").toUpperCase();

    // Read Logo as base64
    const logoPath = path.join(__dirname, '../assets/logo.png');
    let logoBase64 = '';
    try {
        if (fs.existsSync(logoPath)) {
            const logoBuffer = fs.readFileSync(logoPath);
            logoBase64 = `data:image/png;base64,${logoBuffer.toString('base64')}`;
        }
    } catch (e) {
        console.error("Error loading logo for press pass", e);
    }

    // Inline the applicant's uploaded photo, if any
    const photoBase64 = await fetchImageAsBase64(photoUrl);

    // Generate QR Code base64
    const qrCodeDataUrl = await QRCode.toDataURL(qrData || 'Moda Week International', {
        margin: 1,
        width: 180,
        color: {
            dark: '#000000',
            light: '#ffffff'
        }
    });

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Press Pass</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Inter', sans-serif;
            background-color: white;
            width: 600px;
            height: 1080px;
            position: relative;
            border: 1px solid #e5e5e5;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }

        /* Top Strip */
        .top-strip {
            height: 22px;
            background-color: #B28247;
            width: 100%;
            flex-shrink: 0;
        }

        /* Top Border Area for Hole */
        .top-lanyard {
            width: 100%;
            height: 60px;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-top: 10px;
        }

        .lanyard-hole {
            width: 120px;
            height: 25px;
            border: 2px solid #ddd;
            border-radius: 20px;
            background-color: transparent;
        }

        /* Logo */
        .logo-container {
            width: 100%;
            display: flex;
            justify-content: center;
            margin-top: 20px;
            margin-bottom: 20px;
        }

        .logo-container img {
            max-width: 380px;
            height: auto;
        }

        /* Press Pass Banner */
        .banner {
            background-color: #B28247;
            width: 80%;
            margin: 0 auto;
            text-align: center;
            padding: 15px 0;
            margin-bottom: 30px;
        }

        .banner h1 {
            color: white;
            font-size: 34px;
            letter-spacing: 6px;
            font-weight: 800;
        }

        /* Decorative Line */
        .divider {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 80%;
            margin: 0 auto;
            margin-bottom: 40px;
        }
        
        .divider::before, .divider::after {
            content: '';
            flex: 1;
            border-bottom: 1px solid #B28247;
        }
        
        .divider-icon {
            color: #B28247;
            font-size: 20px;
            padding: 0 15px;
            line-height: 1;
        }

        /* Applicant Photo */
        .photo-container {
            display: flex;
            justify-content: center;
            margin-bottom: 30px;
        }

        .photo-circle {
            width: 240px;
            height: 240px;
            border-radius: 50%;
            border: 6px solid #B28247;
            overflow: hidden;
            background-color: #f2f2f2;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .photo-circle img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center;
            display: block;
        }

        .photo-circle svg {
            width: 45%;
            height: 45%;
            fill: #c9c9c9;
        }

        /* Content Area */
        .content-area {
            display: flex;
            flex-direction: column;
            padding: 0 50px;
            flex: 1;
        }

        .media-title {
            font-size: 38px;
            font-weight: 800;
            color: #000;
            margin-bottom: 30px;
            letter-spacing: -0.5px;
        }

        .info-qr-container {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }

        .info-list {
            display: flex;
            flex-direction: column;
            gap: 25px;
        }

        .info-item {
            display: flex;
            align-items: center;
            gap: 15px;
        }

        .info-icon {
            width: 40px;
            height: 40px;
            background-color: #B28247;
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
        }
        
        .info-icon svg {
            width: 20px;
            height: 20px;
            fill: white;
        }

        .info-text {
            display: flex;
            flex-direction: column;
        }

        .info-label {
            color: #B28247;
            font-size: 13px;
            font-weight: 700;
            letter-spacing: 1px;
            text-transform: uppercase;
        }

        .info-value {
            color: #000;
            font-size: 20px;
            font-weight: 700;
            text-transform: uppercase;
            margin-top: 2px;
        }

        .qr-container {
            border: 2px solid #B28247;
            padding: 5px;
            background: white;
        }

        .qr-container img {
            display: block;
            width: 170px;
            height: 170px;
        }

        /* Bottom Section */
        .bottom-divider {
            margin-top: auto;
            margin-bottom: 25px;
        }

        .bottom-strip {
            height: 60px;
            background-color: #B28247;
            width: 100%;
        }
    </style>
</head>
<body>

    <div class="top-strip"></div>

    <div class="top-lanyard">
        <div class="lanyard-hole"></div>
    </div>

    <div class="logo-container">
        ${logoBase64 ? `<img src="${logoBase64}" alt="Moda Week International" />` : `<h2 style="color:#B28247;">MODA WEEK INTERNATIONAL</h2>`}
    </div>

    <div class="banner">
        <h1>PRESS PASS</h1>
    </div>

    <div class="photo-container">
        <div class="photo-circle">
            ${photoBase64
            ? `<img src="${photoBase64}" alt="${passName}" />`
            : `<svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>`
        }
        </div>
    </div>

    <div class="content-area">
        <div class="media-title">${passCompany}</div>

        <div class="info-qr-container">
            <div class="info-list">
                
                <div class="info-item">
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
                    </div>
                    <div class="info-text">
                        <span class="info-label">Name</span>
                        <span class="info-value">${passName}</span>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                    </div>
                    <div class="info-text">
                        <span class="info-label">Location</span>
                        <span class="info-value">${passLocation}</span>
                    </div>
                </div>

                <div class="info-item">
                    <div class="info-icon">
                        <svg viewBox="0 0 24 24"><path d="M20 6h-4V4c0-1.11-.89-2-2-2h-4c-1.11 0-2 .89-2 2v2H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-6 0h-4V4h4v2z"/></svg>
                    </div>
                    <div class="info-text">
                        <span class="info-label">Company</span>
                        <span class="info-value">${passCompany}</span>
                    </div>
                </div>

            </div>

            <div class="qr-container">
                <img src="${qrCodeDataUrl}" alt="QR Code" />
            </div>
        </div>
    </div>

    <div class="divider bottom-divider">
        <div class="divider-icon">✦</div>
    </div>

    <div class="bottom-strip"></div>

</body>
</html>
    `;

    // Find local browser executable (same detection order as pdfService.js)
    const paths = [
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
        "/usr/bin/google-chrome",
        "/usr/bin/chromium-browser",
        "/usr/bin/chromium"
    ];
    let executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || process.env.CHROME_BIN || '';
    if (!executablePath) {
        for (const p of paths) {
            if (fs.existsSync(p)) {
                executablePath = p;
                break;
            }
        }
    }

    if (!executablePath) {
        throw new Error("Could not find Chrome or Edge executable on this system for press pass generation.");
    }

    // Launch puppeteer to generate image
    const browser = await puppeteer.launch({
        executablePath,
        headless: 'new', // new headless mode
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set viewport to exact dimensions
    await page.setViewport({
        width: 600,
        height: 1080,
        deviceScaleFactor: 2 // High resolution
    });

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
    // Take screenshot as PNG
    const buffer = await page.screenshot({ type: 'png' });
    
    await browser.close();

    return buffer;
};
