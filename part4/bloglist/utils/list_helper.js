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

  module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
  }