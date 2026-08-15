const express = require("express");

const router = express.Router();

const Package = require("../models/Package");


// =====================================
// GET ALL PACKAGES
// =====================================

router.get("/", async (req, res) => {

    try {

        const packages =
            await Package.find()
                .sort({ createdAt: -1 });

        res.json(packages);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to fetch packages"
        });

    }

});


// =====================================
// CREATE PACKAGE
// =====================================

router.post("/", async (req, res) => {

    try {

        const packageData =
            new Package(req.body);

        const savedPackage =
            await packageData.save();

        res.status(201).json(savedPackage);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to create package"
        });

    }

});


// =====================================
// UPDATE PACKAGE
// =====================================

router.put("/:id", async (req, res) => {

    try {

        const updatedPackage =
            await Package.findByIdAndUpdate(
                req.params.id,
                req.body,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedPackage) {

            return res.status(404).json({
                message: "Package not found"
            });

        }

        res.json(updatedPackage);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to update package"
        });

    }

});


// =====================================
// DELETE PACKAGE
// =====================================

router.delete("/:id", async (req, res) => {

    try {

        const deletedPackage =
            await Package.findByIdAndDelete(
                req.params.id
            );

        if (!deletedPackage) {

            return res.status(404).json({
                message: "Package not found"
            });

        }

        res.json({
            message: "Package deleted successfully"
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: "Failed to delete package"
        });

    }

});


module.exports = router;