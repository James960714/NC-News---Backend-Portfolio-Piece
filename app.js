const express = require('express')
const app = express()
const {getAllTopics} = require('./controllers/topics.controllers')
const {getAllArticles, getArticle} = require('./controllers/articles.controllers')
const endPoints = require('./endpoints.json')


app.get('/api', (req, res, next) => {
    res.status(200).send(endPoints)
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
    if(err.status && err.msg){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((req, res, next) => {
    res.status(404).send({msg: 'not found'})
})

module.exports = app 