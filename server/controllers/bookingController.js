const Booking = require("../models/Booking");

// GET all bookings
exports.getBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate("customer")
            .sort({ createdAt: -1 });

        res.status(200).json(bookings);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET one booking
exports.getBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate("customer");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE booking
exports.createBooking = async (req, res) => {
    try {
        const {
            customer,
            eventType,
            eventDate,
            venue,
            packageName,
            budget,
            status,
            notes
        } = req.body;

        if (
            !customer ||
            !eventType ||
            !eventDate ||
            !venue ||
            !packageName ||
            budget === undefined
        ) {
            return res.status(400).json({
                message: "Please provide all required booking details"
            });
        }

        const booking = await Booking.create({
            customer,
            eventType,
            eventDate,
            venue,
            packageName,
            budget,
            status: status || "Pending",
            notes
        });

        const populatedBooking = await booking.populate("customer");

        res.status(201).json(populatedBooking);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE booking
exports.updateBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        ).populate("customer");

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json(booking);

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE booking
exports.deleteBooking = async (req, res) => {
    try {
        const booking = await Booking.findByIdAndDelete(req.params.id);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        res.status(200).json({
            message: "Booking deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};