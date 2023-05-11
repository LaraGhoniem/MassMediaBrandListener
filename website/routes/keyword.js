const express = require('express')
const { addKeyword, view_keywords_by_listener_id,deleteKeyword,editKeyword } = require('../controllers/keyword')

const router = express.Router()

router.post("/add", addKeyword)

router.get("/view/:id", view_keywords_by_listener_id)
router.delete("/delete/:id", deleteKeyword)
router.put('/:id/:set', editKeyword)
// router.post('/keywords', keywordController.addKeyword);
module.exports = router