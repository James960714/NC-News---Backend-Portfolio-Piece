const express = require('express')
const app = express()
const {getTopics, getEndPoints} = require('./controllers/topics.controllers')
const endPoints = require('./endpoints.json')

app.use(express.json())

app.get('/api', (req, res, next) => {
    res.status(200).send(endPoints)
})

app.get('/api/topics', getTopics)

app.use((req, res, next) => {
    res.status(400).send({msg: 'bad request'})
})

module.exports = app 