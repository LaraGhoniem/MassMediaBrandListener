const keyword = require("../models/keywordModel");

exports.addKeyword = (req, res) => {
    const Keyword = new keyword(req.body);
    Keyword.save((err, keyword) => {
    if (err) {
        return res.status(400).json({
        err: err.toString(),
        });
    }
    return res.json({
        message: "Keyword created successfully",
        keyword,
    });

    });
};



    exports.view_keywords_by_listener_id = (req, res) => {
    Keyword.find({ listener_id: req.params.id }, (err, keywords) => {
        if (err) {
        return res.status(400).json({
            err: err.toString(),
        });
        }
        return res.json({
        keywords,
        });
    });
    };


