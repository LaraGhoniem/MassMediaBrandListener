const mongoose = require("mongoose")

const keywordSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
        maxlength: 32,
    },
    listener_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Listener",
        required: true
    },
}, {timestamps: true})

module.exports = mongoose.model("Keyword", keywordSchema)
