const {fetchTopics, fetchEndPoints} = require('../models/topics.models')

exports.getAllTopics = (req, res, next) => {
    fetchTopics()
    .then((topics) => {
        res.status(200).send({topics: topics})
    })
    .catch((err) => {
        next(err)
    })
}

