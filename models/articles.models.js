const db = require('../db/connection')

exports.fetchAllArticles = (topicVal) => {
    let sqlString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url FROM articles `
    const queryVals = []
    if(topicVal){
        sqlString += `WHERE topic=$1 `
        queryVals.push(topicVal)
    }

    sqlString += `ORDER BY created_at DESC`
    const articles = db.query(sqlString, queryVals)
        .then(({rows}) => {
            return rows
        })
    const comments = db.query(
        'SELECT comments.article_id FROM comments')
        .then(({rows}) => {
            return rows
        }) 
    return Promise.all([articles, comments])
    .then(([articles, comments]) => {
        const articlesWithCommentCount = articles.map((article) => {
            let commentCount = 0
            comments.forEach((comment) => {
                if(comment.article_id === article.article_id)
                    commentCount++
            })
            article.comment_count = commentCount
            return article
        })
        return articlesWithCommentCount
    }).catch((err) => {
        return err
    })
}
exports.fetchArticle = (articleID) => {
    return db.query(
        `SELECT * FROM articles
        WHERE article_id=$1;`,[articleID])
        .then(({rows}) => {
            if(rows.length === 0){
                return Promise.reject(({status: 404, msg: 'not found'}))
            }
            return rows[0]
        })
        
}
exports.checkArticleExists = (articleID) => {
    return db.query(`SELECT * FROM articles WHERE article_id=$1`, [articleID])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'not found'})
        }
    })
}
exports.updateArticleVotes = (articleID, incrementValue) => {
    return db.query(`UPDATE articles SET votes = votes + $1 WHERE article_id = $2 RETURNING *`, [incrementValue, articleID])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'not found'})
        }
        return rows
    })
}