const db = require('../db/connection')

exports.fetchTopics = () => {
    // console.log('landed models')
    return db.query('SELECT * FROM topics;')
    .then(({rows}) => {
        // console.log(rows)
        return rows
    })
}