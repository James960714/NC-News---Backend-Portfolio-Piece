const {fetchArticle, fetchAllArticles, updateArticleVotes} = require('../models/articles.models')
const { checkTopicExists } = require('../models/topics.models')

exports.getAllArticles = (req, res, next) => {
    const {topic} = req.query
    if(topic === undefined){
        fetchAllArticles()
        .then((articles) => {
            res.status(200).send({articles: articles})
        })
        .catch((err) => {
            next(err)
        })
    }else{
        Promise.all([checkTopicExists(topic), fetchAllArticles(topic)])
        .then(([,articles]) => {
            res.status(200).send({articles: articles})
        })
        .catch((err) => {
            next(err)
        })
    }
}
exports.getArticle = (req, res, next) => {
    const {article_id} = req.params
    fetchArticle(article_id)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}

exports.patchAnArticle = (req, res, next) => {
    const {article_id} = req.params
    const {inc_votes} = req.body
    updateArticleVotes(article_id, inc_votes)
    .then(([updatedArticle]) => {
        res.status(200).send(updatedArticle)
    })
    .catch((err) => {
        next(err)
    })   
}