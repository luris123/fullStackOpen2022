const Blog = require('../models/blog');


const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.reduce((sum, blog) => {
        return sum + blog.likes
    }, 0)
}

const favoriteBlog = (blogs) => {
    const favorite = Math.max(...blogs.map(o => o.likes))
    return favorite
}

const mostBlogs = (blogs) => {
    const most = Math.max(...blogs.map(o => o.author))
        return most
    }




  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
  }