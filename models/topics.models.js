const db = require('../db/connection')

exports.fetchTopics = () => {
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        return rows
    })
}
exports.checkTopicExists = (topicVal) => {
    return db.query(`SELECT * FROM topics WHERE slug=$1`, [topicVal])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: 'not found'})
        }
    })
}