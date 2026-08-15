const Customer = require("../models/Customer");

// GET all customers
exports.getCustomers = async (req, res) => {
    try {
        const customers = await Customer.find().sort({ createdAt: -1 });

        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// GET one customer
exports.getCustomer = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// CREATE customer
exports.createCustomer = async (req, res) => {
    try {
        const { name, phone, email, address } = req.body;

        if (!name || !phone || !email || !address) {
            return res.status(400).json({
                message: "Please provide name, phone, email and address"
            });
        }

        const customer = await Customer.create({
            name,
            phone,
            email,
            address
        });

        res.status(201).json(customer);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// UPDATE customer
exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json(customer);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// DELETE customer
exports.deleteCustomer = async (req, res) => {
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);

        if (!customer) {
            return res.status(404).json({
                message: "Customer not found"
            });
        }

        res.status(200).json({
            message: "Customer deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};