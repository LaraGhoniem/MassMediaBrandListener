const mongoose = require("mongoose")

const listenerSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    categories: {
        type: Array,
        required: true
    },
    listener_name: {
        type: String,
        required: true,
        maxlength: 32,
    },

}, {timestamps: true})

module.exports = mongoose.model("Listener", listenerSchema)