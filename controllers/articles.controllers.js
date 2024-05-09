const {fetchArticle, fetchAllArticles, updateArticleVotes, checkArticleExists} = require('../models/articles.models')

exports.getAllArticles = (req, res, next) => {
    const {topic} = req.query
    
    fetchAllArticles(topic)
    .then((articles) => {
        res.status(200).send({articles: articles})
    })
    .catch((err) => {
        next(err)
    })
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