const User = require("../models/userModel")
const { validationResult } = require("express-validator")
const user = require("../models/userModel")
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

exports.signup = (req, res) => {
    const errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(422).json({
            error: errors.array()[0].msg
        })
    }


    const user = new User(req.body)
    user.save((err, user) => {
        if(err) {
            return res.status(400).json({
                err: err.toString()
            })
        }
        return res.json({
            message: "User created successfully",
            user
        })
    })
}

exports.signin = (req, res) => {
    const {email,password} = req.body
    User.findOne({email}, (err, user) => {
        if(err || !user) {
            return res.status(400).json({
                error: "User does not exist"
            })
        }
        if(!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email and password do not match"
            })
        }

        const token = jwt.sign({_id: user._id}, process.env.SECRET)
        res.cookie("token", token, {expire: new Date() + 1})
        req.session.user = user
        req.session.save()
        const { _id, name, email } = user
        return res.json({
            token,
            user: {_id, name, email},
        })
    })
}

exports.signout = (req, res) => {
    res.clearCookie("token")
    req.session.destroy()
    return res.json({
        message: "User signed out successfully"
    })
}
