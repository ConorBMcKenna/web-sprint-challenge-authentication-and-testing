// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig')
const server = require('./server')

const userA = {username : "Captian America", password : "foobar"}
const userB = {username : "Captian America", password : "fooba"}
const userC = {username : "", password : "foobar"}


afterAll(async () => {
  await db.destroy()
})
beforeEach(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

describe("/api/auth/register",  ()=>{
  test('If username or password are missing a response should correct user', async ()=>{
    const res = await request(server).post('/api/auth/register').send(userC)
    expect(res.body.message).toBe("username and password required")
  })
  test('User should create a unique username', async ()=>{
   await request(server).post('/api/auth/register').send(userA)
  const res = await request(server).post('/api/auth/register').send(userA)
    expect(res.body.message).toBe("username taken")
  })
})

describe("/api/auth/login",  ()=>{
  test('If username or password are missing a response should correct user', async ()=>{
    const res = await request(server).post('/api/auth/login').send(userC)
    expect(res.body.message).toBe("username and password required")
  })
  test('When you login the password should be correct', async ()=>{
   await request(server).post('/api/auth/register').send(userA)
  const res = await request(server).post('/api/auth/login').send(userB)
    expect(res.body.message).toBe("invalid credentials")
  })
})

describe("/api/jokes",  ()=>{
  test('If there is no token a message should redirect the user', async ()=>{
    const res = await request(server).get('/api/jokes')
    expect(res.body.message).toBe("token required")
  })
  test('If a token is Valid you should get Dad Jokes', async ()=>{
   await request(server).post('/api/auth/register').send(userA)
  const loginRes = await request(server).post('/api/auth/login').send(userA)
  const res = await request(server).get('/api/jokes').set("Authorization", `${loginRes.body.token}`)
    expect(res.body.length).toBe(3)
  })
})