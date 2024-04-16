const {fetchArticleComments} = require('../models/comments.models')
const {checkArticleExists} = require('../models/articles.models')

exports.getArticleComments = (req, res, next) => {
    const {article_id} = req.params
    Promise.all([fetchArticleComments(article_id), checkArticleExists(article_id)])
    .then(([articleComments]) => {
        res.status(200).send(articleComments)
    })
    .catch((err) => {
        next(err)
    })
}