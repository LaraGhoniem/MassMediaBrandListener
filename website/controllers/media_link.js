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

exports.get_all_media_links = (req, res) => {
    MediaLink.find({}, (err, mediaLinks) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            mediaLinks
        })
    })
}

exports.add_media_link = (req, res) => {
    const mediaLinks = req.body
    mediaLinks.forEach(mediaLink => {
        const media_link = new MediaLink(mediaLink)
        media_link.save((err, media_link) => {
            if(err) {
                return res.status(400).json({
                    err: err.toString()
                })
            }
        })
    })
    return res.json({
        mediaLinks
    })
}

exports.delete_media_link = (req, res) => {
    MediaLink.findByIdAndDelete(req.params.id, (err, mediaLink) => {
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

exports.edit_media_link = (req, res) => {
    MediaLink.findByIdAndUpdate(req.params.id, req.body, (err, mediaLink) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            mediaLink
        })
    })
    return res.json({
        mediaLink
    })
}
