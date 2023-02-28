const express = require('express')
const { addCompany,get_company_by_user_id } = require('../controllers/company')
const {check} = require("express-validator")
const router = express.Router()

router.post("/add", addCompany)

router.get("/getCompany/:user_id", get_company_by_user_id)


module.exports = router