const express = require("express");
const router = express.Router();

const Payment = require("../models/Payment");
const Booking = require("../models/Booking");

// ============================================
// GET ALL PAYMENTS
// ============================================

router.get("/", async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("booking")
            .populate("customer")
            .sort({ createdAt: -1 });

        res.json(payments);

    } catch (error) {

        console.error("GET PAYMENTS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch payments"
        });
    }
});


// ============================================
// CREATE PAYMENT
// ============================================

router.post("/", async (req, res) => {

    try {

        const {
            booking,
            customer,
            amount,
            paymentMethod,
            notes
        } = req.body;


        // -----------------------------
        // VALIDATION
        // -----------------------------

        if (!booking) {

            return res.status(400).json({
                message: "Booking is required"
            });

        }

        if (!customer) {

            return res.status(400).json({
                message: "Customer is required"
            });

        }

        if (!amount || Number(amount) <= 0) {

            return res.status(400).json({
                message: "Enter a valid payment amount"
            });

        }


        // -----------------------------
        // FIND BOOKING
        // -----------------------------

        const bookingData =
            await Booking.findById(booking);

        if (!bookingData) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }


        // -----------------------------
        // CALCULATE PAYMENT
        // -----------------------------

        const totalAmount =
            Number(bookingData.budget || 0);

        const previousPaid =
            Number(bookingData.paidAmount || 0);

        const newPayment =
            Number(amount);

        const newPaidAmount =
            previousPaid + newPayment;


        // Don't allow overpayment

        if (newPaidAmount > totalAmount) {

            return res.status(400).json({

                message:
                    `Payment cannot exceed remaining amount. Remaining: ₹${(
                        totalAmount - previousPaid
                    ).toLocaleString("en-IN")}`

            });

        }


        // -----------------------------
        // GENERATE TRANSACTION ID
        // -----------------------------

        const transactionId =
            `TXN-${Date.now()}-${Math.floor(
                1000 + Math.random() * 9000
            )}`;


        // -----------------------------
        // CREATE PAYMENT
        // -----------------------------

        const payment =
            new Payment({

                booking: booking,

                customer: customer,

                amount: newPayment,

                paymentMethod:
                    paymentMethod || "Cash",

                paymentStatus: "Paid",

                transactionId:
                    transactionId,

                notes:
                    notes || ""

            });


        const savedPayment =
            await payment.save();


        // -----------------------------
        // UPDATE BOOKING
        // -----------------------------

        let paymentStatus;

        let bookingStatus;


        if (newPaidAmount >= totalAmount) {

            paymentStatus = "Paid";

            bookingStatus = "Completed";

        } else {

            paymentStatus = "Partially Paid";

            bookingStatus = "Confirmed";

        }


        bookingData.paidAmount =
            newPaidAmount;

        bookingData.paymentStatus =
            paymentStatus;

        bookingData.status =
            bookingStatus;


        await bookingData.save();


        // -----------------------------
        // RETURN EVERYTHING
        // -----------------------------

        const finalPayment =
            await Payment.findById(
                savedPayment._id
            )
            .populate("booking")
            .populate("customer");


        res.status(201).json({

            message:
                "Payment recorded successfully",

            payment:
                finalPayment,

            transactionId:
                transactionId,

            booking: {

                totalAmount:
                    totalAmount,

                paidAmount:
                    newPaidAmount,

                remainingAmount:
                    totalAmount - newPaidAmount,

                paymentStatus:
                    paymentStatus,

                status:
                    bookingStatus

            }

        });


    } catch (error) {

        console.error(
            "CREATE PAYMENT ERROR:",
            error
        );

        res.status(500).json({

            message:
                "Failed to record payment",

            error:
                error.message

        });

    }

});


// ============================================
// DELETE PAYMENT
// ============================================

router.delete("/:id", async (req, res) => {

    try {

        const payment =
            await Payment.findByIdAndDelete(
                req.params.id
            );

        if (!payment) {

            return res.status(404).json({
                message: "Payment not found"
            });

        }

        res.json({
            message: "Payment deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE PAYMENT ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to delete payment"
        });

    }

});


module.exports = router;