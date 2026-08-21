import Buyer from '../models/buyerModel.js';
import Designer from '../models/designerModel.js';
import Sponsor from '../models/sponsorModel.js';
import Service from '../models/serviceModel.js';
import RsvpApplication from '../models/rsvpApplicationModel.js';
import sendEmail from '../utils/emailService.js';
import { generateUserConfirmationEmail, generateAdminNotificationEmail } from '../utils/emailTemplates.js';

const ADMIN_EMAIL = 'info@modaweekinternational.com';

// Email delivery (Gmail) can transiently fail without the application itself being invalid,
// so failures here are logged, not thrown - the record is already saved by the time we send.
const sendApplicationEmails = async (type, record, userEmail, notifySubject, notifyMessage) => {
    try {
        await sendEmail({
            email: userEmail,
            subject: notifySubject.user,
            message: notifyMessage.user,
            html: generateUserConfirmationEmail(type, record)
        });
    } catch (error) {
        console.error(`Failed to send user confirmation email for ${type} application:`, error);
    }

    try {
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: notifySubject.admin,
            message: notifyMessage.admin,
            html: generateAdminNotificationEmail(type, record)
        });
    } catch (error) {
        console.error(`Failed to send admin notification email for ${type} application:`, error);
    }
};

// Create Buyer Application
export const createBuyerApplication = async (req, res) => {
    try {
        const buyer = new Buyer(req.body);
        await buyer.save();

        await sendApplicationEmails(
            'buyer',
            buyer,
            buyer.email,
            { user: '🎉 Application Received - Moda Week International', admin: '🔔 New Buyer Application - Moda Week' },
            {
                user: `Dear ${buyer.contactName}, Thank you for applying to become a buyer. We have received your application and will review it shortly.`,
                admin: `New Buyer Application: ${buyer.companyName} - ${buyer.contactName}`
            }
        );

        res.status(201).json({ success: true, message: 'Buyer application submitted successfully', data: buyer });
    } catch (error) {
        console.error("Error creating buyer application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Create Designer Application
export const createDesignerApplication = async (req, res) => {
    try {
        const designer = new Designer(req.body);
        await designer.save();

        await sendApplicationEmails(
            'designer',
            designer,
            designer.email,
            { user: '✨ Application Received - Moda Week International', admin: '🔔 New Designer Application - Moda Week' },
            {
                user: `Dear ${designer.designerName}, Thank you for applying as a designer. We have received your application and will review it shortly.`,
                admin: `New Designer Application: ${designer.brandName} - ${designer.designerName}`
            }
        );

        res.status(201).json({ success: true, message: 'Designer application submitted successfully', data: designer });
    } catch (error) {
        console.error("Error creating designer application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Create Sponsor Application
export const createSponsorApplication = async (req, res) => {
    try {
        const sponsor = new Sponsor(req.body);
        await sponsor.save();

        await sendApplicationEmails(
            'sponsor',
            sponsor,
            sponsor.email,
            { user: '🤝 Application Received - Moda Week International', admin: '🔔 New Sponsor Application - Moda Week' },
            {
                user: `Dear ${sponsor.contactName}, Thank you for your interest in sponsoring Moda Week International. We have received your application and will be in touch.`,
                admin: `New Sponsor Application: ${sponsor.companyName} - ${sponsor.contactName}`
            }
        );

        res.status(201).json({ success: true, message: 'Sponsor application submitted successfully', data: sponsor });
    } catch (error) {
        console.error("Error creating sponsor application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Create Service Application
export const createServiceApplication = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();

        await sendApplicationEmails(
            'service',
            service,
            service.email,
            { user: '📋 Inquiry Received - Moda Week International', admin: '🔔 New Service Inquiry - Moda Week' },
            {
                user: `Dear ${service.fullName}, Thank you for your interest in our services. We have received your inquiry and will contact you shortly.`,
                admin: `New Service Inquiry: ${service.fullName} - ${service.email}`
            }
        );

        res.status(201).json({ success: true, message: 'Service application submitted successfully', data: service });
    } catch (error) {
        console.error("Error creating service application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};

// Create RSVP Application
export const createRsvpApplication = async (req, res) => {
    try {
        const rsvp = new RsvpApplication(req.body);
        await rsvp.save();

        await sendApplicationEmails(
            'rsvp',
            rsvp,
            rsvp.privateEmail,
            { user: 'VIP RSVP Received - Moda Week International', admin: 'New VIP RSVP Submission - Moda Week' },
            {
                user: `Dear ${rsvp.fullName}, thank you for submitting your VIP RSVP profile. We have received your request and will review it shortly.`,
                admin: `New VIP RSVP: ${rsvp.fullName} - ${rsvp.privateEmail}`
            }
        );

        res.status(201).json({ success: true, message: 'RSVP application submitted successfully', data: rsvp });
    } catch (error) {
        console.error("Error creating RSVP application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
