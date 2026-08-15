const mongoose = require("mongoose");

const packageSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        description: {
            type: String,
            default: ""
        },

        price: {
            type: Number,
            required: true
        },

        category: {
            type: String,
            default: "General"
        }
    },
    {
        timestamps: true
    }
);

module.exports =
    mongoose.model("Package", packageSchema);