const {fetchArticleComments, createNewComment} = require('../models/comments.models')
const {checkArticleExists} = require('../models/articles.models')
const { checkUserExists } = require('../models/users.models')

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

exports.postAComment = (req, res, next) => {
    const {article_id} = req.params
    const {body} = req
    Promise.all([createNewComment(article_id, body), checkUserExists(body.username), checkArticleExists(article_id)])
    .then(([postedComment]) => {
        res.status(201).send(postedComment)
    })
    .catch((err) => {
        next(err)
    })
}


