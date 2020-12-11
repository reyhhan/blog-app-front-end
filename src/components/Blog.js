import React,{ useState } from 'react'
const Blog = ({ blog, updateLikes,loggedUser, removeBlog }) => {
  const [visibleBlog, setVisibility] = useState(false)

  const blogStyle = {
    paddingTop: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }
  const hide = { display : visibleBlog ? 'none' : '' }
  const show = { display : visibleBlog ? '' : 'none' }

  const handleVisibility = () => {
    setVisibility(!visibleBlog)
  }

  return (
    <div style={blogStyle}>

      <div style={hide} className='blog'>
        {blog.title}-{blog.author}<button onClick={handleVisibility}>view</button>
      </div>

      <div style={show} className='notDisplayed'>
        <p>{blog.title} <button onClick={handleVisibility}>hide</button></p>
        <p><i>{blog.author}</i></p>
        <p>{blog.url}</p>
        <p id='like'>{blog.likes}<button onClick={updateLikes}>like</button></p>
        { blog.user
          ? blog.user.username===loggedUser.username
            ?<p><button onClick={removeBlog}>remove</button></p>
            : ''
          : ''
        }
      </div>
    </div>
  )
}

export default Blog
