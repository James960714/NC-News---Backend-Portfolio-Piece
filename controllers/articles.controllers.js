const {fetchArticle} = require('../models/articles.models')

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