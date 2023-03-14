const mongoose = require("mongoose")

const listenerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    listener_status: {
        type: String,
        required: true,
        maxlength: 32,
        trim: true
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    listener_name: {
        type: String,
        required: true,
        maxlength: 32,
    },
    result: {
        type: String,
    },

}, {timestamps: true})

module.exports = mongoose.model("Listener", listenerSchema)