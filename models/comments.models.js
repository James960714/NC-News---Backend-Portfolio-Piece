const db = require('../db/connection')

exports.fetchArticleComments = (articleID) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,[articleID])
    .then(({rows}) => {
        return rows
    })
}