const Package = require("../models/Package");

// GET all packages
exports.getPackages = async (req, res) => {
    try {
        const packages = await Package.find().sort({ createdAt: -1 });

        res.status(200).json(packages);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET one package
exports.getPackage = async (req, res) => {
    try {
        const packageItem = await Package.findById(req.params.id);

        if (!packageItem) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json(packageItem);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE package
exports.createPackage = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            category,
            services,
            status
        } = req.body;

        if (
            !name ||
            !description ||
            price === undefined ||
            !category
        ) {
            return res.status(400).json({
                message: "Please provide name, description, price and category"
            });
        }

        const packageItem = await Package.create({
            name,
            description,
            price,
            category,
            services: services || [],
            status: status || "Active"
        });

        res.status(201).json(packageItem);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE package
exports.updatePackage = async (req, res) => {
    try {
        const packageItem = await Package.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!packageItem) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json(packageItem);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE package
exports.deletePackage = async (req, res) => {
    try {
        const packageItem = await Package.findByIdAndDelete(
            req.params.id
        );

        if (!packageItem) {
            return res.status(404).json({
                message: "Package not found"
            });
        }

        res.status(200).json({
            message: "Package deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};