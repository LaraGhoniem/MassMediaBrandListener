const express = require('express')
const { signup,signin,signout,editProfile,get_all_users } = require('../controllers/user')
const {check} = require("express-validator")
const router = express.Router()



router.post("/signup", [
    check("name", "Name should be at least 3 characters").isLength({min: 3}),
    check("email", "Email is invalid").isEmail(),
    check("password", "Password should be at least 8 and a maximum of 32 characters").isLength({min: 8, max: 32}),
    check("job_title", "Job title is required").isLength({min: 1})
] ,signup)

router.post("/signin" , signin)

router.get("/signout", signout)

router.post('/editProfile', editProfile);

router.get("/getAllUsers", get_all_users )

module.exports = router