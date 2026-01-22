import Buyer from '../models/buyerModel.js';
import Designer from '../models/designerModel.js';
import Sponsor from '../models/sponsorModel.js';
import Service from '../models/serviceModel.js';
import sendEmail from '../utils/emailService.js';
import { generateUserConfirmationEmail, generateAdminNotificationEmail } from '../utils/emailTemplates.js';

const ADMIN_EMAIL = 'info@modaweekinternational.com';

// Create Buyer Application
export const createBuyerApplication = async (req, res) => {
    try {
        const buyer = new Buyer(req.body);
        await buyer.save();

        // Send Beautiful Email to User
        await sendEmail({
            email: buyer.email,
            subject: '🎉 Application Received - Moda Week International',
            message: `Dear ${buyer.contactName}, Thank you for applying to become a buyer. We have received your application and will review it shortly.`,
            html: generateUserConfirmationEmail('buyer', buyer)
        });

        // Send Notification Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: '🔔 New Buyer Application - Moda Week',
            message: `New Buyer Application: ${buyer.companyName} - ${buyer.contactName}`,
            html: generateAdminNotificationEmail('buyer', buyer)
        });

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

        // Send Beautiful Email to User
        await sendEmail({
            email: designer.email,
            subject: '✨ Application Received - Moda Week International',
            message: `Dear ${designer.designerName}, Thank you for applying as a designer. We have received your application and will review it shortly.`,
            html: generateUserConfirmationEmail('designer', designer)
        });

        // Send Notification Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: '🔔 New Designer Application - Moda Week',
            message: `New Designer Application: ${designer.brandName} - ${designer.designerName}`,
            html: generateAdminNotificationEmail('designer', designer)
        });

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

        // Send Beautiful Email to User
        await sendEmail({
            email: sponsor.email,
            subject: '🤝 Application Received - Moda Week International',
            message: `Dear ${sponsor.contactName}, Thank you for your interest in sponsoring Moda Week International. We have received your application and will be in touch.`,
            html: generateUserConfirmationEmail('sponsor', sponsor)
        });

        // Send Notification Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: '🔔 New Sponsor Application - Moda Week',
            message: `New Sponsor Application: ${sponsor.companyName} - ${sponsor.contactName}`,
            html: generateAdminNotificationEmail('sponsor', sponsor)
        });

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

        // Send Beautiful Email to User
        await sendEmail({
            email: service.email,
            subject: '📋 Inquiry Received - Moda Week International',
            message: `Dear ${service.fullName}, Thank you for your interest in our services. We have received your inquiry and will contact you shortly.`,
            html: generateUserConfirmationEmail('service', service)
        });

        // Send Notification Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: '🔔 New Service Inquiry - Moda Week',
            message: `New Service Inquiry: ${service.fullName} - ${service.email}`,
            html: generateAdminNotificationEmail('service', service)
        });

        res.status(201).json({ success: true, message: 'Service application submitted successfully', data: service });
    } catch (error) {
        console.error("Error creating service application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
