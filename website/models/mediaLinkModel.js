const mongoose = require("mongoose")

const mediaLinkSchema = new mongoose.Schema({
    mediaLink_name: {
        type: String,
        required: true,
        maxlength: 32,
    },
    mediaLink: {
        type: String,
        required: true,
        maxlength: 2000,
    },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categories",
        required: true
    }
}, {timestamps: true})

module.exports = mongoose.model("MediaLink", mediaLinkSchema)
