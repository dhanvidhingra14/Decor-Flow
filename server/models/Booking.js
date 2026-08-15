const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
    {
        customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Customer",
            required: true
        },

        eventType: {
            type: String,
            required: true
        },

        eventDate: {
            type: Date,
            required: true
        },

        // =========================================
        // VENUE
        // =========================================

        venueType: {
            type: String,
            enum: ["Registered", "Customer"],
            default: "Customer"
        },

        venue: {
            type: String,
            required: true
        },

        venueAddress: {
            type: String,
            default: ""
        },

        venueContact: {
            type: String,
            default: ""
        },

        // =========================================
        // PACKAGE
        // =========================================

        packageName: {
            type: String,
            required: true
        },

        // =========================================
        // MONEY
        // =========================================

budget: {
    type: Number,
    required: true
},

paidAmount: {
    type: Number,
    default: 0
},

paymentStatus: {
    type: String,
    enum: [
        "Unpaid",
        "Partially Paid",
        "Paid"
    ],
    default: "Unpaid"
},

status: {
    type: String,
    default: "Pending"
},
        // =========================================
        // BOOKING STATUS
        // =========================================

        status: {
            type: String,
            enum: [
                "Pending",
                "Confirmed",
                "Completed",
                "Cancelled"
            ],
            default: "Pending"
        },

        assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Employee" }],

        notes: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Booking", bookingSchema);
