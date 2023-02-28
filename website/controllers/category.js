const Category = require("../models/categoryModel")

exports.view_category_by_id = (req, res) => {
    Category.findById(req.params.id, (err, category) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            category
        })
    })
}

exports.get_all_categories = (req, res) => {
    Category.find({}, (err, category) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            category
        })
    })
}