const request = require('supertest')
const app = require('../app')
const testData = require('../db/data/test-data/index')
const db = require('../db/connection')
const seed = require('../db/seeds/seed')
const endpoints = require('../endpoints.json')

beforeEach(() => seed(testData))
afterAll(() => db.end())

describe('GET /api/not_a_path', () => {
    test('GET 400: Returns a bad request error when a non existent path is requested', () => {
        return request(app)
        .get('/api/not_a_path')
        .expect(400)
        .then(({body}) => {
            const error = body
            expect(error.msg).toBe('bad request')
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
describe('GET: /api', ()=> {
    test('GET: Responds with an object that lists and describes the functionality of all the endpoints in this API', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            console.log(body, 'test')
            expect(body).toEqual(endpoints)
        })
    })
})
})