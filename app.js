const express = require('express')
const app = express()
const {getTopics, getEndPoints} = require('./controllers/topics.controllers')
const endPoints = require('./endpoints.json')

app.use(express.json())

app.get('/api', (req, res, next) => {
    console.log(endPoints, 'app')
    res.status(200).send(endPoints)
})

app.get('/api/topics', getTopics)

app.use((req, res, next) => {
    // console.log('error')
    res.status(400).send({msg: 'bad request'})
})

module.exports = app 