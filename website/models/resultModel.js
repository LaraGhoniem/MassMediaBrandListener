const mongoose = require("mongoose")

const resultSchema = new mongoose.Schema({
    result: {
        type: String,
        required: true,
    },
    listener_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "listeners",
        required: true
    },
    // created_at: {
    //     type: Date,
    //     default: Date.now
    // }
}, {timestamps: true})

module.exports = mongoose.model("Result", resultSchema)
