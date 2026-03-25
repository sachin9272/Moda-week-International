import TicketSale from '../models/ticketSaleModel.js';
import UpcomingEvent from '../models/upcomingEventModel.js';

// Get analytics for a specific event
export const getEventAnalytics = async (req, res) => {
    try {
        const { eventId } = req.params;

        // Check if event exists
        const event = await UpcomingEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        // 1. Total Tickets Sold & Revenue
        const salesStats = await TicketSale.aggregate([
            { $match: { eventId: event._id, status: 'completed' } },
            {
                $group: {
                    _id: null,
                    totalTickets: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        const totalTicketsSold = salesStats.length > 0 ? salesStats[0].totalTickets : 0;
        const totalRevenue = salesStats.length > 0 ? salesStats[0].totalRevenue : 0;

        // 2. Sales by Ticket Type (Detailed for Table)
        const aggregatedSales = await TicketSale.aggregate([
            { $match: { eventId: event._id, status: 'completed' } },
            {
                $group: {
                    _id: "$ticketName",
                    count: { $sum: "$quantity" },
                    revenue: { $sum: "$totalAmount" }
                }
            }
        ]);

        // Map aggregation results to defined ticket types to include price and limit
        const salesByTicketType = event.ticketTypes.map(type => {
            const saleStats = aggregatedSales.find(s => s._id === type.name);
            return {
                name: type.name,
                price: type.price,
                limit: type.limit || 100, // Default limit if not set
                count: saleStats ? saleStats.count : 0,
                revenue: saleStats ? saleStats.revenue : 0
            };
        });

        // 3. Recent Transactions
        const recentTransactions = await TicketSale.find({ eventId: event._id })
            .sort({ purchaseDate: -1 })
            .limit(10)
            .select('buyerName buyerEmail ticketName quantity totalAmount purchaseDate status');

        // 4. Daily Sales Trend (Last 7 days) (Optional enhancement)
        // For now, sticking to the requested basics but adding structure for it if needed.

        res.status(200).json({
            eventName: event.eventName || event.title,
            eventDate: event.eventDate,
            totalTicketsSold,
            totalRevenue,
            salesByTicketType,
            recentTransactions
        });

    } catch (error) {
        console.error("Error fetching event analytics:", error);
        res.status(500).json({ message: "Failed to fetch analytics", error: error.message });
    }
};

// Get all transactions for an event with filters and pagination
export const getEventTransactions = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { page = 1, limit = 10, search, status, ticketType } = req.query;

        const query = { eventId };

        // Search by buyer name or email
        if (search) {
            query.$or = [
                { buyerName: { $regex: search, $options: 'i' } },
                { buyerEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by status
        if (status) {
            query.status = status;
        }

        // Filter by ticket type
        if (ticketType) {
            query.ticketName = ticketType;
        }

        const skip = (page - 1) * limit;

        const transactions = await TicketSale.find(query)
            .sort({ purchaseDate: -1 })
            .skip(parseInt(skip))
            .limit(parseInt(limit));

        const totalCount = await TicketSale.countDocuments(query);

        res.status(200).json({
            transactions,
            totalCount,
            totalPages: Math.ceil(totalCount / limit),
            currentPage: parseInt(page)
        });

    } catch (error) {
        console.error("Error fetching event transactions:", error);
        res.status(500).json({ message: "Failed to fetch transactions", error: error.message });
    }
};

// Get global analytics for all events (Revenue & Ticket Sales comparison)
export const getGlobalAnalytics = async (req, res) => {
    try {
        const globalStats = await TicketSale.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: "$eventId",
                    totalTickets: { $sum: "$quantity" },
                    totalRevenue: { $sum: "$totalAmount" }
                }
            },
            {
                $lookup: {
                    from: "upcomingevents", // Ensure this matches your collection name (usually lowercase plural)
                    localField: "_id",
                    foreignField: "_id",
                    as: "eventConfig"
                }
            },
            {
                $unwind: "$eventConfig"
            },
            {
                $project: {
                    _id: 0,
                    eventId: "$_id",
                    eventName: { $ifNull: ["$eventConfig.eventName", "$eventConfig.title"] },
                    totalTickets: 1,
                    totalRevenue: 1
                }
            },
            { $sort: { totalRevenue: -1 } } // Sort by highest revenue
        ]);

        res.status(200).json(globalStats);
    } catch (error) {
        console.error("Error fetching global analytics:", error);
        res.status(500).json({ message: "Failed to fetch global analytics", error: error.message });
    }
};

// Get Top 5 Customers by Ticket Purchases
export const getTopCustomers = async (req, res) => {
    try {
        const topCustomers = await TicketSale.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: "$buyerEmail",
                    buyerName: { $first: "$buyerName" },
                    totalTickets: { $sum: "$quantity" },
                    totalSpent: { $sum: "$totalAmount" }
                }
            },
            { $sort: { totalTickets: -1, totalSpent: -1 } },
            { $limit: 5 },
            {
                $project: {
                    _id: 0,
                    email: "$_id",
                    name: "$buyerName",
                    totalTickets: 1,
                    totalSpent: 1
                }
            }
        ]);

        res.status(200).json(topCustomers);
    } catch (error) {
        console.error("Error fetching top customers:", error);
        res.status(500).json({ message: "Failed to fetch top customers", error: error.message });
    }
};

// Get Global Recent Transactions
export const getGlobalRecentTransactions = async (req, res) => {
    try {
        const recentTransactions = await TicketSale.aggregate([
            { $sort: { purchaseDate: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "upcomingevents",
                    localField: "eventId",
                    foreignField: "_id",
                    as: "event"
                }
            },
            { $unwind: "$event" },
            {
                $project: {
                    _id: 1,
                    buyerName: 1,
                    buyerEmail: 1,
                    ticketName: 1,
                    quantity: 1,
                    totalAmount: 1,
                    purchaseDate: 1,
                    eventName: { $ifNull: ["$event.eventName", "$event.title"] }
                }
            }
        ]);

        res.status(200).json(recentTransactions);
    } catch (error) {
        console.error("Error fetching global recent transactions:", error);
        res.status(500).json({ message: "Failed to fetch recent transactions", error: error.message });
    }
};

// Get Global Ticket Type Stats
export const getGlobalTicketTypeStats = async (req, res) => {
    try {
        const ticketStats = await TicketSale.aggregate([
            { $match: { status: 'completed' } },
            {
                $group: {
                    _id: "$ticketName",
                    value: { $sum: "$quantity" }
                }
            },
            {
                $project: {
                    _id: 0,
                    name: "$_id",
                    value: 1
                }
            },
            { $sort: { value: -1 } }
        ]);

        res.status(200).json(ticketStats);
    } catch (error) {
        console.error("Error fetching global ticket stats:", error);
        res.status(500).json({ message: "Failed to fetch ticket stats", error: error.message });
    }
};

