const express = require('express')
const app = express()
require('dotenv').config()
const cors = require('cors')

app.use(express.json())
app.use(cors())

const agentRouter = require('./router')
app.use('/api', agentRouter)

app.listen(9000, ()=>{
    console.log('Everything looks good!');
})