const Result = require("../models/resultModel")

exports.addResult = (req, res) => {
    const result = new Result(req.body)
    result.save((err, result) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            result
        })
    })
}

exports.view_result_by_id = (req, res) => {
    Result.find({"listener_id":req.params.id}, (err, result) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            result
        })
    })
}