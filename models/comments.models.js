const db = require('../db/connection')

exports.fetchArticleComments = (articleID) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,[articleID])
    .then(({rows}) => {
        return rows
    })
}
exports.createNewComment = (articleID, body) => {
    return db.query(
        `INSERT INTO comments (article_id, author, body) 
        VALUES ($1, $2, $3) RETURNING *`,[articleID, body.username, body.body])
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject({status: 404, msg: 'not found'})
            }
            return rows[0]
        })
        .catch((err) => {
            return err
        })
}