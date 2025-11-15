import nodemailer from 'nodemailer';

class EmailService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        });
    }

    async sendEmail(to, subject, html) {
        try {
            const mailOptions = {
                from: process.env.SMTP_FROM,
                to,
                subject,
                html
            };

            const info = await this.transporter.sendMail(mailOptions);
            return { success: true, messageId: info.messageId };
        } catch (error) {
            console.error('Email sending failed:', error);
            return { success: false, error: error.message };
        }
    }

    async sendWelcomeEmail(userEmail, userName) {
        const subject = 'Welcome to Moda Week International';
        const html = `
            <h1>Welcome ${userName}!</h1>
            <p>Thank you for joining Moda Week International. We're excited to have you on board.</p>
        `;
        return this.sendEmail(userEmail, subject, html);
    }
}

module.exports = new EmailService();