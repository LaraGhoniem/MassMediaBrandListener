const Category = require("../models/categoryModel")
const Listener = require("../models/listenerModel")
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

exports.get_used_categories = (req, res) => {
    // search for listeners that contain unique categoryID in their category array.And return the unique categoryIDs
    Listener.find({}, (err, listeners) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        let used_categories = []
        listeners.forEach(listener => {
            listener.categories.forEach(category => {
                if(!used_categories.includes(category))
                    used_categories.push(category)
            })
        })
        return res.json({
            used_categories
        })
    })
}

exports.add_category = (req, res) => {
    const category = new Category(req.body)
    category.save((err, category) => {
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

exports.delete_category = (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err, category) => {
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

exports.edit_category = (req, res) => {
    Category.findByIdAndUpdate(req.params.id, req.body, (err, category) => {
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