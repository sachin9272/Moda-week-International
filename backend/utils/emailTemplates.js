/**
 * Beautiful HTML Email Templates for Application Submissions
 * Moda Week International
 */

const baseStyles = `
    font-family: 'Helvetica Neue', Arial, sans-serif;
    max-width: 600px;
    margin: 0 auto;
    background-color: #f8fafc;
`;

const headerStyles = `
    background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
    padding: 40px 30px;
    text-align: center;
    border-radius: 12px 12px 0 0;
`;

const logoStyles = `
    font-family: serif;
    font-size: 28px;
    font-weight: bold;
    color: #c7913e;
    letter-spacing: 2px;
    margin: 0;
`;

const contentStyles = `
    background-color: #ffffff;
    padding: 40px 30px;
    border-radius: 0 0 12px 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
`;

const footerStyles = `
    text-align: center;
    padding: 30px;
    color: #64748b;
    font-size: 12px;
`;

const buttonStyles = `
    display: inline-block;
    background: linear-gradient(135deg, #c7913e 0%, #b07830 100%);
    color: #ffffff;
    padding: 14px 32px;
    text-decoration: none;
    border-radius: 8px;
    font-weight: bold;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
`;

/**
 * Generate User Confirmation Email
 */
export const generateUserConfirmationEmail = (type, data) => {
    const typeConfig = {
        buyer: {
            title: 'Buyer Application',
            icon: '🛍️',
            greeting: data.contactName,
            message: 'Thank you for your interest in becoming a buyer at Moda Week International. Your application has been successfully received and is now under review.',
            nextSteps: [
                'Our team will review your application within 3-5 business days',
                'You will receive an email notification about your application status',
                'If approved, you will receive exclusive access to our buyer platform'
            ]
        },
        designer: {
            title: 'Designer Application',
            icon: '✨',
            greeting: data.designerName,
            message: 'Thank you for applying to showcase your collection at Moda Week International. We are excited to review your portfolio and brand.',
            nextSteps: [
                'Our creative team will review your portfolio within 5-7 business days',
                'You may be contacted for additional materials or an interview',
                'Selected designers will receive runway scheduling information'
            ]
        },
        sponsor: {
            title: 'Sponsorship Application',
            icon: '🤝',
            greeting: data.contactName,
            message: 'Thank you for your interest in partnering with Moda Week International. We value your potential collaboration and will review your proposal carefully.',
            nextSteps: [
                'Our partnerships team will contact you within 2-3 business days',
                'We will discuss sponsorship packages tailored to your brand',
                'You will receive a detailed proposal with branding opportunities'
            ]
        },
        service: {
            title: 'Service Inquiry',
            icon: '📋',
            greeting: data.fullName,
            message: 'Thank you for reaching out to Moda Week International. We have received your service inquiry and appreciate your interest.',
            nextSteps: [
                'A member of our team will review your inquiry',
                'You will receive a response within 24-48 hours',
                'We will provide detailed information about our services'
            ]
        },
        rsvp: {
            title: 'VIP RSVP Profile',
            icon: '🥂',
            greeting: data.fullName,
            message: 'Thank you for submitting your confidential VIP RSVP profile to Moda Week International. Your request has been received and is now under review.',
            nextSteps: [
                'Our team will review your confidential profile',
                'Qualified guests may be contacted for a brief introductory call',
                'Approved guests will receive private RSVP access details'
            ]
        }
    };

    const config = typeConfig[type];

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
        <div style="${baseStyles}">
            <!-- Header -->
            <div style="${headerStyles}">
                <h1 style="${logoStyles}">MODA WEEK</h1>
                <p style="color: #94a3b8; margin: 10px 0 0 0; font-size: 14px; letter-spacing: 3px; text-transform: uppercase;">INTERNATIONAL</p>
            </div>
            
            <!-- Content -->
            <div style="${contentStyles}">
                <!-- Success Badge -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%); border-radius: 50%; width: 80px; height: 80px; line-height: 80px; font-size: 36px;">
                        ${config.icon}
                    </div>
                </div>
                
                <h2 style="color: #1e293b; text-align: center; margin: 0 0 10px 0; font-size: 24px;">
                    Application Received!
                </h2>
                <p style="color: #c7913e; text-align: center; margin: 0 0 30px 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">
                    ${config.title}
                </p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
                    Dear <strong>${config.greeting}</strong>,
                </p>
                
                <p style="color: #475569; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                    ${config.message}
                </p>
                
                <!-- Next Steps -->
                <div style="background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 12px; padding: 25px; margin-bottom: 30px;">
                    <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 16px;">
                        📌 What Happens Next?
                    </h3>
                    <ul style="color: #78350f; margin: 0; padding-left: 20px; line-height: 1.8;">
                        ${config.nextSteps.map(step => `<li>${step}</li>`).join('')}
                    </ul>
                </div>
                
                <!-- CTA Button -->
                <div style="text-align: center; margin: 30px 0;">
                    <a href="https://modaweekinternational.com" style="${buttonStyles}">
                        Visit Our Website
                    </a>
                </div>
                
                <!-- Contact Info -->
                <div style="border-top: 1px solid #e2e8f0; padding-top: 25px; margin-top: 30px;">
                    <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin: 0; text-align: center;">
                        Have questions? Contact us at<br>
                        <a href="mailto:info@modaweekinternational.com" style="color: #c7913e; text-decoration: none;">info@modaweekinternational.com</a>
                    </p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="${footerStyles}">
                <p style="margin: 0 0 10px 0;">
                    © ${new Date().getFullYear()} Moda Week International. All rights reserved.
                </p>
                <p style="margin: 0; color: #94a3b8;">
                    This is an automated message. Please do not reply directly to this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

/**
 * Generate Admin Notification Email
 */
export const generateAdminNotificationEmail = (type, data) => {
    const typeConfig = {
        buyer: {
            title: 'New Buyer Application',
            color: '#3b82f6',
            fields: [
                { label: 'Company Name', value: data.companyName },
                { label: 'Contact Name', value: data.contactName },
                { label: 'Email', value: data.email },
                { label: 'Phone', value: data.phoneNumber },
                { label: 'Country', value: data.country },
                { label: 'Business Type', value: data.businessType || 'Not specified' }
            ]
        },
        designer: {
            title: 'New Designer Application',
            color: '#8b5cf6',
            fields: [
                { label: 'Brand Name', value: data.brandName },
                { label: 'Designer Name', value: data.designerName },
                { label: 'Email', value: data.email },
                { label: 'Phone', value: data.phoneNumber },
                { label: 'Country', value: data.country },
                { label: 'Website/Portfolio', value: data.website || data.portfolioLink || 'Not provided' }
            ]
        },
        sponsor: {
            title: 'New Sponsor Application',
            color: '#10b981',
            fields: [
                { label: 'Company Name', value: data.companyName },
                { label: 'Contact Name', value: data.contactName },
                { label: 'Email', value: data.email },
                { label: 'Phone', value: data.phoneNumber },
                { label: 'Country', value: data.country },
                { label: 'Industry', value: data.industry || 'Not specified' }
            ]
        },
        service: {
            title: 'New Service Inquiry',
            color: '#f59e0b',
            fields: [
                { label: 'Full Name', value: data.fullName },
                { label: 'Email', value: data.email },
                { label: 'Phone', value: data.phoneNumber },
                { label: 'Country', value: data.country },
                { label: 'Service Type', value: data.requestParticipation || 'General Inquiry' },
                { label: 'Message', value: data.additionalInfo || 'No additional message' }
            ]
        },
        rsvp: {
            title: 'New VIP RSVP Submission',
            color: '#c7913e',
            fields: [
                { label: 'Full Name', value: data.fullName },
                { label: 'Private Email', value: data.privateEmail },
                { label: 'Direct Contact', value: data.directContact },
                { label: 'Nationality', value: data.nationality },
                { label: 'Organization / Brand', value: data.organization },
                { label: 'Role / Title', value: data.roleTitle }
            ]
        }
    };

    const config = typeConfig[type];

    const fieldsHtml = config.fields.map(field => `
        <tr>
            <td style="padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #64748b; font-size: 14px; width: 140px;">
                ${field.label}
            </td>
            <td style="padding: 12px 15px; border-bottom: 1px solid #f1f5f9; color: #1e293b; font-size: 14px; font-weight: 500;">
                ${field.value || 'N/A'}
            </td>
        </tr>
    `).join('');

    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; background-color: #f1f5f9;">
        <div style="${baseStyles}">
            <!-- Header -->
            <div style="background: ${config.color}; padding: 25px 30px; border-radius: 12px 12px 0 0;">
                <h1 style="color: #ffffff; margin: 0; font-size: 20px; font-weight: 600;">
                    🔔 ${config.title}
                </h1>
                <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0 0; font-size: 13px;">
                    Received on ${new Date().toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}
                </p>
            </div>
            
            <!-- Content -->
            <div style="${contentStyles}">
                <table style="width: 100%; border-collapse: collapse;">
                    ${fieldsHtml}
                </table>
                
                <!-- Action Button -->
                <div style="text-align: center; margin-top: 30px;">
                    <a href="https://admin.modaweekinternational.com" style="display: inline-block; background: ${config.color}; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px;">
                        View in Admin Panel
                    </a>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="${footerStyles}">
                <p style="margin: 0;">
                    Moda Week International - Admin Notification
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};
