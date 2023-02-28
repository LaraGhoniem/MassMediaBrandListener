const express = require('express')
const { view_category_by_id, get_all_categories } = require('../controllers/category')
const { view_media_link_by_category_id } = require('../controllers/media_link')
const router = express.Router()

router.get("/id/:id", view_category_by_id)
router.get("/all", get_all_categories)
router.get("/mediaLink/:id", view_media_link_by_category_id)

module.exports = router