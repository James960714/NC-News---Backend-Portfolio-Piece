const db = require('../db/connection')

exports.fetchArticleComments = (articleID) => {
    return db.query(`SELECT * FROM comments WHERE article_id = $1 ORDER BY created_at ASC`,[articleID])
    .then(({rows}) => {
        return rows
    })
}
exports.createNewComment = (articleID, body) => {
    if(!body.username || !body.body){
        return Promise.reject({status: 400, msg: 'bad request'})
    }

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

exports.removeComment = (commentID) => {
    return db.query('DELETE FROM comments WHERE comment_id=$1 RETURNING *', [commentID])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows[0]
    })


}