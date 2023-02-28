const Company = require('../models/companyModel')
const { validationResult } = require("express-validator")

exports.addCompany = (req, res) => {
    const company = new Company(req.body)
    company.save((err, company) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            message: "Company created successfully",
            company
        })
    })
}

exports.get_company_by_user_id = (req, res) => {
    Company.find({user_id: req.params.user_id}, (err, data) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            message: "Company found",
            data
        })
    })
}

