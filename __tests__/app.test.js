const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')
const {convertTimestampToDate, createRef, formatComments} = require('../db/seeds/utils')
const { fetchArticle } = require('../models/articles.models')


beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/not_a_path', () => {
    test('GET 404: Returns a not found error when a non existent path is requested', () => {
        return request(app)
        .get('/api/not_a_path')
        .expect(404)
        .then(({body}) => {
            const error = body
            expect(error.msg).toBe('not found')
        })
    })
})
describe('GET /api/topics', () => {
    test('GET 200: Returns an array of topic with a correct length of 3', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=> {
            const topics = body
            expect(topics.length).toBe(3)
        })
    })
    test('GET 200: Returns an array of topic objects each with properties of slug and description that are the correct data type', () => {
        return request(app)
        .get('/api/topics')
        .expect(200)
        .then(({body})=> {
            const topics = body
            topics.forEach((topic) => {
                expect(typeof topic.slug).toBe('string')
                expect(typeof topic.description).toBe('string')
            })
        })
    })
})
describe('GET: /api', ()=> {
    test('GET: Responds with an object that lists and describes the functionality of all the endpoints in this API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(body).toEqual(endpoints)
        })
    })
})
describe('GET /api/articles/:article_id', () => {
    test('GET 200: returns a single article object', () => {
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body}) => {
            const article = body
            expect(typeof article).toBe('object')
            expect(Array.isArray(article)).toBe(false)
        })
    })
    test('GET 200: returns a single article object, corresponding to the correct id with all the correct properties and data types', () => {
        return request(app)
        .get('/api/articles/4')
        .expect(200)
        .then(({body}) => {
            const article = body
            expect(article.article_id).toEqual(4)
            expect(typeof article.author).toBe('string')
            expect(typeof article.title).toBe('string')
            expect(typeof article.body).toBe('string')
            expect(typeof article.topic).toBe('string')
            expect(typeof article.created_at).toBe('string')
            expect(typeof article.votes).toBe('number')
            expect(typeof article.article_img_url).toBe('string')
        })
    })
    test('GET 404: Returns a not found error when passed a valid but non-existent id', () => {
        return request(app)
        .get('/api/articles/999')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('GET 400: Returns a bad request error when passed an invalid id',() => {
        return request(app)
        .get('/api/articles/invalidID')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe('GET: /api/articles', () => {
    test('GET 200: should respond with an array of article objects, each with the correct properties and data types for each property', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            const articles = body
            articles.forEach((article) => {
                expect(typeof article.article_id).toBe('number')
                expect(typeof article.author).toBe('string')
                expect(typeof article.title).toBe('string')
                expect(typeof article.topic).toBe('string')
                expect(typeof article.created_at).toBe('string')
                expect(typeof article.votes).toBe('number')
                expect(typeof article.article_img_url).toBe('string')
                expect(typeof article.comment_count).toBe('number')
                expect(article.body).toBe(undefined)
            })
        })
    })
    test('GET 200: Articles should be sorted by descending date order', () => {
        return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
            body.forEach((article) => {
                const regex = /[^0-9]/g
                const stringCreated = article.created_at.replace(regex, "")
                article.created_at = stringCreated
            })
            expect(body).toBeSortedBy('created_at', {descending: true})
        })
    })
})
describe('GET: /api/articles/:article_id/comments',() => {
    test('GET 200: Returns an array of comment objects with the correct properties', () => {
        return request(app)
        .get('/api/articles/5/comments')
        .expect(200)
        .then(({body}) => {
            body.forEach((comment) => {
                expect.objectContaining({
                    comment_id: expect.any(Number),
                    body: expect.any(String),
                    votes: expect.any(Number),
                    author: expect.any(String),
                    article_id: expect.any(Number),
                    created_at: expect.any(String),
                })
            })
        })
    })
    test('GET 200: Returns comments in ascending order (most recent first)', () => {
        return request(app)
        .get('/api/articles/1/comments')
        .expect(200)
        .then(({body}) => {
            body.forEach((comment) => {
                const regex = /[^0-9]/g
                const stringCreated = comment.created_at.replace(regex, "")
                comment.created_at = stringCreated
            })
            expect(body).toBeSortedBy('created_at')
        })
    })
    test('GET 404: Returns a not found error when passed a valid but non-existent id',() => {
        return request(app)
        .get('/api/articles/999/comments')
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('GET 400: Returns a bad request error when passed an invalid id',() => {
        return request(app)
        .get('/api/articles/invalidID/comments')
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
})
describe('POST: /api/articles/:article_id/comments', () => {
    test('POST 201: Adds the correct property and body to the comments database', () => {
        const commentBody = {
            username: "butter_bridge",
            body: "what an article! I sure hope this text is the correct data type and my comment will be seen"
        }
        return request(app)
        .post('/api/articles/6/comments')
        .send(commentBody)
        .expect(201)
        .then(({body}) => {
            const comment = body
            expect(comment.author).toBe(commentBody.username)
            expect(comment.body)
        })
    })
    test('POST 201: Returns an object with all the correct properties and data types', () => {
        const commentBody = {
            username: "butter_bridge",
            body: "what an article! I sure hope this text is the correct data type and my comment will be seen"
        }
        return request(app)
        .post('/api/articles/6/comments')
        .send(commentBody)
        .expect(201)
        .then(({body}) => {
            expect.objectContaining({
                comment_id: expect.any(Number),
                body: expect.any(String),
                votes: expect.any(Number),
                author: expect.any(String),
                article_id: expect.any(Number),
                created_at: expect.any(String),
            
            })
        })
    })
    test('POST 404: Returns not found when passed a valid but non-existent id', () => {
        const commentBody = {
            username: "butter_bridge",
            body: "what an article! I sure hope this text is the correct data type and my comment will be seen"
        }
        return request(app)
        .post('/api/articles/999/comments')
        .send(commentBody)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
        })
    })
    test('POST 400: Returns bad request when passed an invalid id', () => {
        const commentBody = {
            username: "butter_bridge",
            body: "what an article! I sure hope this text is the correct data type and my comment will be seen"
        }
        return request(app)
        .post('/api/articles/invalidID/comments')
        .send(commentBody)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
        })
    })
    test('POST 404: Returns not found when passed a valid but non-existent username', () => {
        const commentBody = {
            username: "northcoder1",
            body: "what an article! I sure hope this text is the correct data type and my comment will be seen"
        }
        return request(app)
        .post('/api/articles/6/comments')
        .send(commentBody)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
        })
    })
})
describe('PATCH: /api/articles/:article_id', () => {
    test('PATCH 200: updates an aticle with a new vote count based a positive incrementation from the body of the request', () => {
        const voteIncrement = {inc_votes: 100 }
        const exampleArticle =   {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .patch('/api/articles/1')
        .send(voteIncrement)
        .expect(200)
        .then(({body}) => {
            const newVoteCount = exampleArticle.votes + 100
            expect(body.votes).toEqual((newVoteCount))
        })
    })
    test('PATCH 200: updates an aticle with a new vote count based negative incrementation from the body of the request', () => {
        const voteIncrement = {inc_votes: -100 }
        const exampleArticle =   {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .patch('/api/articles/1')
        .send(voteIncrement)
        .expect(200)
        .then(({body}) => {
            const newVoteCount = exampleArticle.votes - 100
            expect(body.votes).toEqual((newVoteCount))
        })
    })
    test('POST 404: Returns not found when passed a valid but non-existent id', () => {
        const voteIncrement = {inc_votes: -100 }
        const exampleArticle =   {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .patch('/api/articles/999')
        .send(voteIncrement)
        .expect(404)
        .then(({body}) => {
            expect(body.msg).toBe('not found')
    })
    })
    test('POST 400: Returns not found when passed an invalid id', () => {
        const voteIncrement = {inc_votes: -100 }
        const exampleArticle =   {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .patch('/api/articles/not_validID')
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
    })
    })
    test('POST 400: Returns vote count outside of vote property parametres', () => {
        const voteIncrement = {inc_votes: 10000000 }
        const exampleArticle =   {
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: 1594329060000,
            votes: 100,
            article_img_url:
              "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          }
        return request(app)
        .patch('/api/articles/not_validID')
        .send(voteIncrement)
        .expect(400)
        .then(({body}) => {
            expect(body.msg).toBe('bad request')
    })
    })

})