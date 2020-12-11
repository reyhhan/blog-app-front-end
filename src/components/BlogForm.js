import React, { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const handleChangeTitle = (event) => {
    setTitle(event.target.value)
  }
  const handleChangeAuthor = (event) => {
    setAuthor(event.target.value)
  }
  const handleChangeUrl = (event) => {
    setUrl(event.target.value)
  }

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({
      title: title,
      author: author,
      url: url,
    })
    setTitle('')
    setAuthor('')
    setUrl('')
  }
  return (
    <div className="formDiv">
      <h3>Create new Blog</h3>
      <form onSubmit={addBlog}>
        <div>title : <input type="text" id='txtTitle' value={title} onChange={handleChangeTitle} /></div>
        <div>author : <input type="text" id='txtAuthor' value={author} onChange={handleChangeAuthor} /></div>
        <div>url : <input type="text" id='txtUrl' value={url} onChange={handleChangeUrl} /></div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default BlogForm