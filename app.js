const express = require('express')
const app = express()
const {getAllTopics} = require('./controllers/topics.controllers')
const {getAllArticles, getArticle, patchAnArticle} = require('./controllers/articles.controllers')
const {getArticleComments, postAComment} =require('./controllers/comments.controllers')
const endPoints = require('./endpoints.json')

app.use(express.json())

app.get('/api', (req, res, next) => {
    res.status(200).send(endPoints)
})

app.get('/api/topics', getAllTopics)

app.get('/api/articles', getAllArticles)

app.get('/api/articles/:article_id', getArticle)

app.get('/api/articles/:article_id/comments', getArticleComments)

app.post('/api/articles/:article_id/comments', postAComment)

app.patch('/api/articles/:article_id', patchAnArticle)

app.use((err, req, res, next) => {
    if(err.code === '22P02'){
        res.status(400).send({msg: 'bad request'})
    }
    next(err)
})
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