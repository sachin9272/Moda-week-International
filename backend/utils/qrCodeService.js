
import QRCode from 'qrcode';
import { Jimp } from 'jimp'; // Updated import for Jimp v1.0+ or compatible
import path from 'path';

export const generateQRCode = async (text, logoPath) => {
    try {
        // 1. Generate QR Code with high error correction
        const qrBuffer = await QRCode.toBuffer(text, {
            errorCorrectionLevel: 'H', // Allows 30% damage/coverage
            width: 300,
            margin: 1
        });

        // 2. Load QR Code into Jimp
        const qrImage = await Jimp.read(qrBuffer);

        // 3. Load Logo if provided
        // Default logo path if not provided
        const defaultLogoPath = path.resolve('public/logo.png');
        const finalLogoPath = logoPath || defaultLogoPath;

        try {
            const logo = await Jimp.read(finalLogoPath);

            // 4. Resize Logo to 20% of QR width
            const logoSize = qrImage.bitmap.width * 0.2;
            logo.resize({ w: logoSize, h: logoSize }); // Using object syntax for resize in newer Jimp

            // 5. Create White Background for Logo
            // Make background 10% larger than logo for padding
            const bgSize = logoSize * 1.1;
            const bg = new Jimp({ width: bgSize, height: bgSize, color: 0xFFFFFFFF });

            // 6. Composite Logo onto White Background (Centered)
            const logoX = (bgSize - logoSize) / 2;
            const logoY = (bgSize - logoSize) / 2;
            bg.composite(logo, logoX, logoY);

            // 7. Composite Background (with Logo) onto Center of QR
            const x = (qrImage.bitmap.width - bgSize) / 2;
            const y = (qrImage.bitmap.height - bgSize) / 2;

            qrImage.composite(bg, x, y);
        } catch (logoErr) {
            console.warn("Could not load logo for QR code:", logoErr.message);
            // Continue without logo if it fails
        }

        // 6. Return as Data URI (Base64)
        const mime = 'image/png';
        const buffer = await qrImage.getBuffer(mime);
        return `data:${mime};base64,${buffer.toString('base64')}`;

    } catch (err) {
        console.error("Error generating QR code:", err);
        return null;
    }
};
