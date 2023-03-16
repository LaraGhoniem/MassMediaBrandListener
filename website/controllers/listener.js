const Listener = require('../models/listenerModel')

exports.addListener = (req, res) => {
    const listener = new Listener(req.body)
    listener.save((err, listener) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }

        return res.json({
            message: "Listener created successfully",
            listener
        })
    })
}

exports.view_listener_by_id = (req, res) => {
Listener.find({"user_id":req.params.id}, (err, listener) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            listener
        })
    })
}

exports.get_all_listeners = (req, res) => {
    Listener.find((err, listeners) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            listeners
        })
    })
}

exports.view_listener_by_company_id = (req, res) => {
    Listener.find({company_id: req.params.id}, (err, listeners) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            listeners
        })
    })
}

exports.update_listener_by_id = (req, res) => {
    Listener.updateOne({"_id": req.params.id}, req.params.set, (err, listener) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            message: "Listener updated successfully",
            listener
        })
    })
}
