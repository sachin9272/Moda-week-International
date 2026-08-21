
import Stripe from 'stripe';
import TicketSale from '../models/ticketSaleModel.js';
import UpcomingEvent from '../models/upcomingEventModel.js';
import { sendTicketEmail } from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const handleStripeWebhook = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // req.body must be raw buffer here, handled by express.raw() in server.js
        event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
    } catch (err) {
        console.error(`Webhook Signature Verification Failed: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
            await fulfillOrder(session);
        } catch (err) {
            console.error("Error fulfilling order:", err);
            // Don't return error to Stripe to avoid retries if it's a logic error we can't fix automatically
            // But if it's transient, maybe we should. For now, logging.
        }
    }

    res.json({ received: true });
};

const fulfillOrder = async (session) => {
    const { metadata, amount_total, payment_status } = session;

    if (payment_status !== 'paid') {
        console.log("Payment not paid, skipping fulfillment.");
        return;
    }

    const { eventId, buyerName, buyerEmail, ticketDetails } = metadata;
    const tickets = JSON.parse(ticketDetails);

    console.log(`Processing order for ${buyerEmail} - Event: ${eventId}`);

    // Create a TicketSale record for each ticket type
    // Note: If a user bought 2 VIP and 1 General, we might want separate records or one combined.
    // The current dashboard expects one record per line? Or aggregated?
    // Looking at TicketSaleModel: it has `ticketName`, `quantity`, `totalAmount`.
    // So we should create separate records for each ticket TYPE purchased in this session.

    const savedSales = [];

    for (const ticket of tickets) {
        const sale = new TicketSale({
            eventId,
            buyerName,
            buyerEmail,
            ticketName: ticket.ticketName,
            price: ticket.price,
            quantity: ticket.quantity,
            totalAmount: ticket.price * ticket.quantity, // Calculate per type total
            status: 'completed'
        });

        const savedSale = await sale.save();
        savedSales.push(savedSale);
        console.log(`Saved ticket sale: ${ticket.quantity}x ${ticket.ticketName}`);
    }

    // specific Email Sending Logic
    try {
        const event = await UpcomingEvent.findById(eventId);
        if (event) {
            // Pass savedSales (not raw ticketDetails) so buyerName/_id are available for the email/QR code
            await sendTicketEmail(buyerEmail, savedSales, {
                title: event.title,
                date: event.eventDate,
                location: event.location,
                coverImage: event.coverImage
            });
            console.log(`Ticket email sent to ${buyerEmail}`);
        }
    } catch (emailError) {
        console.error("Failed to send ticket email:", emailError);
    }
};
