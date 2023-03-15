const express = require('express')
const { addListener, view_listener_by_id, get_all_listeners, view_listener_by_company_id,update_listener_by_id } = require('../controllers/listener')
const { view_keywords_by_listener_id, addKeyword } = require('../controllers/keyword')
const { view_result_by_id } = require('../controllers/result')
const router = express.Router()

router.post("/add",addListener)

router.get("/id/:id", view_listener_by_id)

router.put("/:id/:set/", update_listener_by_id)

router.get("/all", get_all_listeners)

router.get("/company/:id", view_listener_by_company_id)

router.get("/result/:id", view_result_by_id)

module.exports = router