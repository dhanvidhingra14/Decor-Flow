const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Customer = require("../models/Customer");

// =====================================
// GET ALL BOOKINGS
// =====================================

router.get("/", async (req, res) => {

    try {

        const bookings = await Booking.find()
            .populate("customer").populate("assignedEmployees")
            .sort({ createdAt: -1 });

        res.json(bookings);

    } catch (error) {

        console.error("GET BOOKINGS ERROR:", error);

        res.status(500).json({
            message: "Failed to fetch bookings",
            error: error.message
        });

    }

});


// Client-only booking feed. The token determines the customer; no other bookings are sent.
router.get("/mine", async (req, res) => {
    try {
        const token = String(req.headers.authorization || "").replace("Bearer ", "");
        if (!token) return res.status(401).json({ message: "Sign in is required" });
        const payload = jwt.verify(token, process.env.JWT_SECRET || "decorflow_super_secret_2026");
        if (payload.role !== "client") return res.status(403).json({ message: "Client access only" });
        const user = await User.findById(payload.id);
        const customer = await Customer.findOne({ phone: user?.phone });
        if (!customer) return res.json([]);
        const bookings = await Booking.find({ customer: customer._id }).populate("customer").populate("assignedEmployees").sort({ eventDate: 1 });
        return res.json(bookings);
    } catch (error) { return res.status(401).json({ message: "Your session has expired. Please sign in again." }); }
});
// =====================================
// GET SINGLE BOOKING
// =====================================

router.get("/:id", async (req, res) => {

    try {

        const booking =
            await Booking.findById(req.params.id)
                .populate("customer").populate("assignedEmployees");

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        res.json(booking);

    } catch (error) {

        console.error(
            "GET SINGLE BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch booking",
            error: error.message
        });

    }

});


// =====================================
// CREATE BOOKING
// =====================================

router.post("/", async (req, res) => {

    try {

        console.log(
            "CREATE BOOKING DATA:",
            req.body
        );

        const booking =
            new Booking(req.body);

        const savedBooking =
            await booking.save();

        const populatedBooking =
            await Booking.findById(
                savedBooking._id
            ).populate("customer").populate("assignedEmployees");

        res.status(201).json(
            populatedBooking
        );

    } catch (error) {

        console.error(
            "CREATE BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to create booking",
            error: error.message
        });

    }

});


// =====================================
// UPDATE BOOKING
// =====================================

router.put("/:id", async (req, res) => {

    try {

        console.log(
            "UPDATE BOOKING:",
            req.params.id
        );

        console.log(
            "UPDATE DATA:",
            req.body
        );

        const updatedBooking =
            await Booking.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            ).populate("customer").populate("assignedEmployees");

        if (!updatedBooking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        res.json(
            updatedBooking
        );

    } catch (error) {

        console.error(
            "UPDATE BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to update booking",
            error: error.message
        });

    }

});


// =====================================
// DELETE BOOKING
// =====================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedBooking =
            await Booking.findByIdAndDelete(
                req.params.id
            );

        if (!deletedBooking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        res.json({
            message: "Booking deleted successfully"
        });

    } catch (error) {

        console.error(
            "DELETE BOOKING ERROR:",
            error
        );

        res.status(500).json({
            message: "Failed to delete booking",
            error: error.message
        });

    }

});


// =====================================
// EXPORT ROUTER
// =====================================

module.exports = router;

