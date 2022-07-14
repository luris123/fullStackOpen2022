import { useState, useEffect, useRef } from 'react'
import BlogList from './components/BlogList'
import Notification from './components/Notification'
import Error from './components/Error'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  const blogFormRef = useRef()

  const createBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setMessage(`a new blog ${returnedBlog.title} by ${returnedBlog.author} added`)

    })
    .catch(error => {
      setErrorMessage(error.response.data.error)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    })
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }
    
  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }




  if (user === null ) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Error error={errorMessage} />

        
        <form onSubmit={handleLogin}>
        <div>
          username <input
            type="text"
            value={username}
            name="Username"
            onChange={({ target }) => setUsername(target.value)}
          />
        </div>
        <div>
          password <input
            type="password"
            value={password}
            name="Password"
            onChange={({ target }) => setPassword(target.value)}
          />
        </div>
        <button type="submit">login</button>
      </form>
      </div>
      
      )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={message} />
      <Error error={errorMessage} />
      <>
      logged in as {user.username} <button onClick={() => {window.localStorage.removeItem('loggedBloglistUser'); setUser(null)}}>logout</button>
      </>
        <div>

          <Togglable
            buttonLabel="new blog"
            cancelLabel="cancel"
            ref={blogFormRef}
          >
            <BlogForm createBlog={createBlog} />
          </Togglable>
          <BlogList
            blogs={blogs}
            setBlogs={setBlogs}
            user={user.username}
          />
        </div>
      
    </div>
  );
};

export default App;
