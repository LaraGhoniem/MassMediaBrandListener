const express = require('express')
const { addKeyword } = require('../controllers/keyword')

const router = express.Router()

router.post("/add", addKeyword)

module.exports = router