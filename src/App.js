import React, { useState, useEffect, useRef } from 'react'
import LoginForm from './components/Login'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Togglable'
import Footer from './components/Footer'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {

  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedInUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }
    fetchData()
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedInUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')

    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedInUser')
    setUser(null)
  }

  const addBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      await blogService
        .create(blogObject)
      const blogs = await blogService.getAll()
      setBlogs(blogs)

      setErrorMessage('Successfully Added Blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch (exception) {
      setErrorMessage('Failed to add blog')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addLikes = async (id) => {
    const blog = blogs.find(n => n.id === id)
    const changedBlog = { ...blog, likes: blog.likes + 1 }

    try {
      await blogService
        .update(id, changedBlog)
      setBlogs(blogs.map(note => note.id !== id ? note : changedBlog))

    } catch (exception) {
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
      setBlogs(blogs.map(note => note.id !== id ? note : changedBlog))
    }
  }

  const removeBlog = async (id) => {
    const blog = blogs.find(n => n.id === id)
    try {
      if (window.confirm(`Remove blog ${blog.title}?`)) {
        await blogService
          .remove(id)
        setBlogs(blogs.filter(note => note.id !== id))
      }
    } catch (exception) {
      setErrorMessage('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleSubmit={handleLogin}
        />
      </div>
    )
  }

  const sortedList = blogs.sort((a, b) => b.likes - a.likes)

  const blogList = () => (
    <div>
      <h3>Tech Blogs</h3>
      <br />
      {sortedList.map((blog,i) =>
        <Blog key={i} blog={blog}
          updateLikes={() => addLikes(blog.id)}
          loggedUser={user}
          removeBlog={() => removeBlog(blog.id)} />
      )}
    </div>
  )

  const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={addBlog} />
    </Togglable>
  )

  return (
    <div>
      <h2>Blog App</h2>
      <Notification message={errorMessage} />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged in  <button onClick={handleLogout}>log out</button></p>
          {blogForm()}
          {blogList()}
        </div>
      }
      <Footer />
    </div>
  )
}

export default App