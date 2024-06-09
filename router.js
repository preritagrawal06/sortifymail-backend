const app = require("express")
const classifyEmail = require("./classifyEmail")
const router = app.Router()

router.post('/agent/classifyemail', classifyEmail)

module.exports = router