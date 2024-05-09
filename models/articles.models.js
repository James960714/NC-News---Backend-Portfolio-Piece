const db = require('../db/connection')

exports.fetchAllArticles = (topicVal) => {
    let sqlString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) AS comment_count 
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id `
    const queryVals = []
    if(topicVal){
        sqlString += `WHERE topic=$1 `
        queryVals.push(topicVal)
    }
    sqlString += `GROUP BY articles.article_id ORDER BY created_at DESC`
    
    return db.query(sqlString, queryVals)
    .then(({rows}) => {
        rows.forEach((row) => {
            row.comment_count = Number(row.comment_count)  
        })
        return (rows)
    })
    .catch((err)=> {
        return (err)
    })
}

exports.fetchArticle = (articleID) => {
    return db.query(
        `SELECT articles.author, articles.title, articles.article_id, articles.body, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(articles.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments ON articles.article_id = comments.article_id
        WHERE articles.article_id=$1
        GROUP BY articles.article_id;`,[articleID])
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