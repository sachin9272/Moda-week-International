
import Stripe from 'stripe';
import UpcomingEvent from '../models/upcomingEventModel.js';
import dotenv from 'dotenv';

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
    try {
        const { eventId, items, buyerName, buyerEmail } = req.body;

        if (!eventId || !items || items.length === 0) {
            return res.status(400).json({ message: "Invalid request data" });
        }

        const event = await UpcomingEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // Validate items and calculate line items
        const lineItems = [];
        const ticketDetails = []; // For metadata

        for (const item of items) {
            const ticketType = event.ticketTypes.find(t => t._id.toString() === item.ticketTypeId);
            if (!ticketType) {
                return res.status(400).json({ message: `Invalid ticket type ID: ${item.ticketTypeId}` });
            }

            // Check availability (basic check, more robust locking in production)
            // (Assuming we might add availability checking logic here later based on 'limit')

            lineItems.push({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${event.title} - ${ticketType.name}`,
                        description: ticketType.description || `Ticket for ${event.title}`,
                        images: event.coverImage?.url ? [event.coverImage.url] : [],
                    },
                    unit_amount: Math.round(ticketType.price * 100), // Stripe expects cents
                },
                quantity: item.quantity,
            });

            ticketDetails.push({
                ticketName: ticketType.name,
                price: ticketType.price,
                quantity: item.quantity
            });
        }

        const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${clientUrl}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${clientUrl}/payment/cancel`,
            customer_email: buyerEmail, // Pre-fill email
            metadata: {
                eventId,
                buyerName,
                buyerEmail,
                ticketDetails: JSON.stringify(ticketDetails) // Store details to reconstruct order in webhook
            }
        });

        res.status(200).json({ url: session.url });

    } catch (error) {
        console.error("Error creating checkout session:", error);
        res.status(500).json({ message: "Failed to create checkout session", error: error.message });
    }
};
