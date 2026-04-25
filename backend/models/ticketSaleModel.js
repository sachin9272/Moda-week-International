import mongoose from 'mongoose';

const ticketSaleSchema = new mongoose.Schema({
    eventId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UpcomingEvent',
        required: true
    },
    buyerName: {
        type: String,
        required: true
    },
    buyerEmail: {
        type: String,
        required: true
    },
    ticketName: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    purchaseDate: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['completed', 'refunded', 'cancelled'],
        default: 'completed'
    },
    isUsed: {
        type: Boolean,
        default: false
    },
    scannedAt: {
        type: Date
    }
}, { timestamps: true });

const TicketSale = mongoose.model('TicketSale', ticketSaleSchema);

export default TicketSale;
