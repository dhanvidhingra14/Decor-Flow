const express = require("express");

const router = express.Router();

const Venue = require("../models/Venue");

// ==========================================
// GET ALL VENUES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const venues = await Venue.find()
            .sort({
                createdAt: -1
            });

        res.json(venues);

    } catch (error) {

        console.error(
            "Get venues error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get venues",
            error:
                error.message
        });

    }

});

// ==========================================
// GET SINGLE VENUE
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const venue =
            await Venue.findById(
                req.params.id
            );

        if (!venue) {

            return res.status(404).json({
                message:
                    "Venue not found"
            });

        }

        res.json(venue);

    } catch (error) {

        console.error(
            "Get venue error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to get venue",
            error:
                error.message
        });

    }

});

// ==========================================
// CREATE VENUE
// ==========================================

router.post("/", async (req, res) => {

    try {

        console.log(
            "Venue request:",
            req.body
        );

        if (!req.body.name) {

            return res.status(400).json({
                message:
                    "Venue name is required"
            });

        }

        const venue =
            new Venue({
                name:
                    req.body.name,

                address:
                    req.body.address || "",

                phone:
                    req.body.phone || ""
            });

        const savedVenue =
            await venue.save();

        res.status(201).json(
            savedVenue
        );

    } catch (error) {

        console.error(
            "Create venue error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to create venue",
            error:
                error.message
        });

    }

});

// ==========================================
// UPDATE VENUE
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        const updatedVenue =
            await Venue.findByIdAndUpdate(
                req.params.id,

                {
                    name:
                        req.body.name,

                    address:
                        req.body.address || "",

                    phone:
                        req.body.phone || ""
                },

                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedVenue) {

            return res.status(404).json({
                message:
                    "Venue not found"
            });

        }

        res.json(
            updatedVenue
        );

    } catch (error) {

        console.error(
            "Update venue error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to update venue",
            error:
                error.message
        });

    }

});

// ==========================================
// DELETE VENUE
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedVenue =
            await Venue.findByIdAndDelete(
                req.params.id
            );

        if (!deletedVenue) {

            return res.status(404).json({
                message:
                    "Venue not found"
            });

        }

        res.json({
            message:
                "Venue deleted successfully"
        });

    } catch (error) {

        console.error(
            "Delete venue error:",
            error
        );

        res.status(500).json({
            message:
                "Failed to delete venue",
            error:
                error.message
        });

    }

});

module.exports = router;