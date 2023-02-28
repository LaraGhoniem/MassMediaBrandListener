const MediaLink = require("../models/mediaLinkModel")

exports.view_media_link_by_category_id = (req, res) => {
    MediaLink.findById(req.params.id, (err, mediaLink) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            mediaLink
        })
    })
}