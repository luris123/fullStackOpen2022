import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({blog, setBlogs}) => {
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const [visible, setVisible] = useState(false)
  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const handleLike = async (event) => {
    event.preventDefault()

    const blogObject = {
      user: blog.user.id,
      likes: blog.likes + 1,
      author: blog.author,
      title: blog.title,
      url: blog.url
  }
    await blogService.update(blog.id, blogObject)
    const updatedBlogs = await blogService.getAll()
    setBlogs(updatedBlogs)
  }



  return (
    <div style={blogStyle}>
      <div>
        {blog.title} <b>by</b> {blog.author} <button onClick={toggleVisibility}>{visible ? 'hide' : 'view'}</button>
      </div>
      <div>
          {visible ? <><b>url:</b> {blog.url}</> : null}
      </div>
      <div>
          {visible ? <><b>likes:</b> {blog.likes}</> : null} {visible ? <button onClick={handleLike}>like</button> : null}
      </div>
      <div>
         {visible ? <><b>user:</b> {blog.user.username}</> : null}
      </div>

      
    </div>
  )
}
export default Blog