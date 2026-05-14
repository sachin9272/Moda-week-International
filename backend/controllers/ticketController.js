
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
                purchaseDate: ticket.purchaseDate,
                isUsed: ticket.isUsed,
                scannedAt: ticket.scannedAt
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

// POST /api/tickets/scan/:id
export const scanTicket = async (req, res) => {
    try {
        const { id } = req.params;

        // Find the ticket
        const ticket = await TicketSale.findById(id).populate('eventId', 'title eventName');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Check if ticket is valid
        if (ticket.status !== 'completed') {
            return res.status(400).json({
                success: false,
                message: `Ticket is ${ticket.status}`
            });
        }

        // Check if already used
        if (ticket.isUsed) {
            return res.status(400).json({
                success: false,
                message: "Ticket already used",
                scannedAt: ticket.scannedAt
            });
        }

        // Mark as used
        ticket.isUsed = true;
        ticket.scannedAt = Date.now();
        
        // Track who scanned the ticket
        if (req.admin) {
            ticket.scannedBy = `Admin (${req.admin.email})`;
        } else if (req.scannerOperator) {
            ticket.scannedBy = `${req.scannerOperator.name} (${req.scannerOperator.email})`;
        } else {
            ticket.scannedBy = "Unknown System Process";
        }

        await ticket.save();

        res.status(200).json({
            success: true,
            message: "Ticket scanned successfully",
            ticket: {
                id: ticket._id,
                buyerName: ticket.buyerName,
                isUsed: ticket.isUsed,
                scannedAt: ticket.scannedAt,
                scannedBy: ticket.scannedBy
            }
        });

    } catch (error) {
        console.error("Scan error:", error);
        res.status(500).json({
            success: false,
            message: "Scan failed",
            error: error.message
        });
    }
};
