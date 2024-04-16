const {fetchArticle, fetchAllArticles} = require('../models/articles.models')

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
    .then((response) => {
        res.status(200).send(response)
    })
    .catch((err) => {
        next(err)
    })
}
exports.getArticle = (req, res, next) => {
    const articleID = req.params.article_id
    fetchArticle(articleID)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)
    })
}