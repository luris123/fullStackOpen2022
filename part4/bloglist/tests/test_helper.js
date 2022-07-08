const Blog = require('../models/blog')

const initialBlogs = [
    {
        title: 'MongoDB is fun',
        author: 'Michael',
        url: 'https://www.mongodb.com/',
        likes: 0
    },
    {
        title: 'GraphQL is fun',
        author: 'Miquel',
        url: 'https://graphql.org/',
        likes: 0
    },
]

const nonExistingId = async () => {
    const blog = new Blog({ title: 'willremovethissoon', url: 'http://example.com/' })
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

module.exports = {
    initialBlogs, nonExistingId, blogsInDb
}