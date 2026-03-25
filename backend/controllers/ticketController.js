
import TicketSale from '../models/ticketSaleModel.js';
import UpcomingEvent from '../models/upcomingEventModel.js';

// GET /api/tickets/verify/:id
export const verifyTicket = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the ticket
        const ticket = await TicketSale.findById(id).populate('eventId', 'title eventName eventDate location');

        if (!ticket) {
            return res.status(404).json({
                valid: false,
                message: "Ticket not found"
            });
        }

        // Check if ticket is valid (completed and not cancelled/refunded)
        if (ticket.status !== 'completed') {
            return res.status(200).json({
                valid: false,
                message: `Ticket is ${ticket.status}`,
                ticket: {
                    buyerName: ticket.buyerName,
                    ticketName: ticket.ticketName,
                    status: ticket.status
                }
            });
        }

        // Return valid ticket details
        res.status(200).json({
            valid: true,
            message: "Ticket is valid",
            ticket: {
                id: ticket._id,
                buyerName: ticket.buyerName,
                ticketName: ticket.ticketName,
                eventName: ticket.eventId?.eventName || ticket.eventId?.title || "Unknown Event",
                eventDate: ticket.eventId?.eventDate,
                quantity: ticket.quantity,
                status: ticket.status,
                purchaseDate: ticket.purchaseDate
            }
        });

    } catch (error) {
        console.error("Verification error:", error);
        res.status(500).json({
            valid: false,
            message: "Verification failed",
            error: error.message
        });
    }
};

// POST /api/tickets/scan/:id (Optional: Mark as used?)
// Usually scanning at gate might just verify, or verify AND mark as entered.
// For now, per request "scanned on the gate", verification is the first step.
// We can add "mark as used" later if requested.
