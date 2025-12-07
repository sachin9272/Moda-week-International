import Buyer from '../models/buyerModel.js';
import Designer from '../models/designerModel.js';
import Sponsor from '../models/sponsorModel.js';
import Service from '../models/serviceModel.js';
import sendEmail from '../utils/emailService.js';

const ADMIN_EMAIL = 'singhamsachin72@gmail.com';

// Create Buyer Application
export const createBuyerApplication = async (req, res) => {
    try {
        const buyer = new Buyer(req.body);
        await buyer.save();

        // Send Email to User
        await sendEmail({
            email: buyer.email,
            subject: 'Application Received - Moda Week International',
            message: `Dear ${buyer.contactName},\n\nThank you for applying to become a buyer. We have received your application and will review it shortly.\n\nBest regards,\nModa Week International Team`
        });

        // Send Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: 'New Buyer Application',
            message: `New Buyer Application Received:\n\nCompany: ${buyer.companyName}\nContact: ${buyer.contactName}\nEmail: ${buyer.email}\nPhone: ${buyer.phoneNumber}\nCountry: ${buyer.country}`
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

        // Send Email to User
        await sendEmail({
            email: designer.email,
            subject: 'Application Received - Moda Week International',
            message: `Dear ${designer.designerName},\n\nThank you for applying as a designer. We have received your application and will review it shortly.\n\nBest regards,\nModa Week International Team`
        });

        // Send Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: 'New Designer Application',
            message: `New Designer Application Received:\n\nBrand: ${designer.brandName}\nDesigner: ${designer.designerName}\nEmail: ${designer.email}\nPhone: ${designer.phoneNumber}\nCountry: ${designer.country}`
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

        // Send Email to User
        await sendEmail({
            email: sponsor.email,
            subject: 'Application Received - Moda Week International',
            message: `Dear ${sponsor.contactName},\n\nThank you for your interest in sponsoring Moda Week International. We have received your application and will be in touch.\n\nBest regards,\nModa Week International Team`
        });

        // Send Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: 'New Sponsor Application',
            message: `New Sponsor Application Received:\n\nCompany: ${sponsor.companyName}\nContact: ${sponsor.contactName}\nEmail: ${sponsor.email}\nPhone: ${sponsor.phoneNumber}\nCountry: ${sponsor.country}`
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

        // Send Email to User
        await sendEmail({
            email: service.email,
            subject: 'Service Inquiry Received - Moda Week International',
            message: `Dear ${service.fullName},\n\nThank you for your interest in our services. We have received your inquiry and will contact you shortly.\n\nBest regards,\nModa Week International Team`
        });

        // Send Email to Admin
        await sendEmail({
            email: ADMIN_EMAIL,
            subject: 'New Service Inquiry',
            message: `New Service Inquiry Received:\n\nName: ${service.fullName}\nEmail: ${service.email}\nPhone: ${service.phoneNumber}\nCountry: ${service.country}`
        });

        res.status(201).json({ success: true, message: 'Service application submitted successfully', data: service });
    } catch (error) {
        console.error("Error creating service application:", error);
        res.status(400).json({ success: false, message: error.message });
    }
};
