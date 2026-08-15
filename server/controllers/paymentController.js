const Payment = require("../models/Payment");

// GET all payments
exports.getPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate("booking")
            .populate("customer")
            .sort({ createdAt: -1 });

        res.status(200).json(payments);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET one payment
exports.getPayment = async (req, res) => {
    try {
        const payment = await Payment.findById(req.params.id)
            .populate("booking")
            .populate("customer");

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE payment
exports.createPayment = async (req, res) => {
    try {
        const {
            booking,
            customer,
            amount,
            paymentMethod,
            paymentStatus,
            transactionId,
            paymentDate,
            notes
        } = req.body;

        if (
            !booking ||
            !customer ||
            amount === undefined ||
            !paymentMethod
        ) {
            return res.status(400).json({
                message: "Please provide booking, customer, amount and payment method"
            });
        }

        const payment = await Payment.create({
            booking,
            customer,
            amount,
            paymentMethod,
            paymentStatus: paymentStatus || "Pending",
            transactionId: transactionId || "",
            paymentDate: paymentDate || Date.now(),
            notes: notes || ""
        });

        const populatedPayment = await payment
            .populate("booking")
            .then((result) => result.populate("customer"));

        res.status(201).json(populatedPayment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE payment
exports.updatePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        )
            .populate("booking")
            .populate("customer");

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json(payment);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE payment
exports.deletePayment = async (req, res) => {
    try {
        const payment = await Payment.findByIdAndDelete(
            req.params.id
        );

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        res.status(200).json({
            message: "Payment deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};