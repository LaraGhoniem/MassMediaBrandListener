const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true,
        maxlength: 32,
    },
    category_description: {
        type: String,
        required: true,
        maxlength: 2000,
    }
}, {timestamps: true})

module.exports = mongoose.model("Category", categorySchema)