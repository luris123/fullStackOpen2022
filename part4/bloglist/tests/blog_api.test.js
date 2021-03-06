const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()
    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

const api = supertest(app)
describe('GET requests', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
    test('all blogs are returned', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body).toHaveLength(helper.initialBlogs.length)
    })
    test('blog has unique id', async () => {
        const response = await api.get('/api/blogs')
        expect(response.body[0].id).toBeDefined()
    })
})

describe('POST requests', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Testi Teppo',
            url: 'http://testi.teppo.com',
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

        const content = blogsAtEnd.map(o => o.title)
        expect(content).toContain('Test blog')     
    })
    test('if likes is missing, it is set to 0', async () => {
        const newBlog = {
            title: 'Test blog',
            author: 'Testi Teppo',
            url: 'http://testi.teppo.com',

        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBeDefined()
        expect(blogsAtEnd[blogsAtEnd.length - 1].likes).toBe(0)
    })
    test('if title and url are missing, the request is rejected', async () => {
        const newBlog = {
            author: "Testi Teppo",
            likes: 0,
        }
        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)
    })
})
describe('DELETE requests', () => {
    test('a blog can be deleted', async () => {
        const notesAtStart = await helper.blogsInDb()
        const blogToDelete = notesAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .expect(204)

        const notesAtEnd = await helper.blogsInDb()

        expect(notesAtEnd).toHaveLength(helper.initialBlogs.length - 1)

        const content = notesAtEnd.map(n => n.title)
        expect(content).not.toContain(blogToDelete.title)

    })
})
describe('when there is initially one user at db', () => {
    beforeEach(async () => {
      await User.deleteMany({})
  
      const passwordHash = await bcrypt.hash('sekret', 10)
      const user = new User({ username: 'root', passwordHash })
  
      await user.save()
    })
  
    test('creation succeeds with a fresh username', async () => {
      const usersAtStart = await helper.usersInDb()
  
      const newUser = {
        username: 'mluukkai',
        name: 'Matti Luukkainen',
        password: 'salainen',
      }
  
      await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)
  
      const usersAtEnd = await helper.usersInDb()
      expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
      const usernames = usersAtEnd.map(u => u.username)
      expect(usernames).toContain(newUser.username)
    })
    test('creation fails with proper statuscode and message if username already taken', async () => {
        const usersAtStart = await helper.usersInDb()
    
        const newUser = {
          username: 'root',
          name: 'Superuser',
          password: 'salainen',
        }
    
        const result = await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/)
    
        expect(result.body.error).toContain('username must be unique')
    
        const usersAtEnd = await helper.usersInDb()
        expect(usersAtEnd).toHaveLength(usersAtStart.length)
      })
  })

afterAll(() => {
  mongoose.connection.close()
})