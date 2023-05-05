const express = require('express')
const { addKeyword, view_keywords_by_listener_id } = require('../controllers/keyword')

const router = express.Router()

router.post("/add", addKeyword)

router.get("/view/:id", view_keywords_by_listener_id)

module.exports = router