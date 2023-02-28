const mongoose = require("mongoose")

const companySchema = new mongoose.Schema({
    company_name: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    company_address: {
        type: String,
    },
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("Company", companySchema)