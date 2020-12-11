import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'
import BlogForm from './BlogForm'

test('to have title and author by default', () => {
  const blog = {
    title: 'Typescript is funny',
    author: 'jane',
    url: 'www.edsdfs.lk',
    likes: 0
  }
  const component = render(
    <Blog blog={blog} />
  )
  expect(component.container).toHaveTextContent(
    'Typescript is funny-jane'
  )

  const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Typescript is funny-jane'
  )

  const divNot = component.container.querySelector('.blog')
  expect(divNot).not.toHaveTextContent(
    'https://fullstackopen.com/en/part5/login_in_frontend'
  )

  const toggleNot = component.container.querySelector('.notDisplayed')
  expect(toggleNot).toHaveStyle('display : none')

})

test('after clicking the view button, url and likes are shown', () => {
  const blog = {
    title: 'Typescript is funny',
    author: 'jane',
    url: 'www.edsdfs.lk',
    likes: 0
  }
  const component = render(
    <Blog blog={blog}  />
  )

  const button = component.getByText('view')
  fireEvent.click(button)

  const div = component.container.querySelector('.notDisplayed')
  expect(div).toHaveTextContent(
    'www.edsdfs.lk'
  )
  expect(div).toHaveTextContent(
    '0'
  )

})

test('clicking the like button twice,causes event handler to be called twice', () => {
  const blog = {
    title: 'Typescript is funny',
    author: 'jane',
    url: 'www.edsdfs.lk',
    likes: 0
  }
  const updateLikes = jest.fn()

  const component = render(
    <Blog blog={blog} updateLikes={updateLikes}  />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(updateLikes.mock.calls).toHaveLength(2)

})

test('<BlogForm/> creates new blog with the submitted details', () => {
  const createBlog = jest.fn()
  const blog = {
    title: 'Typescript is funny',
    author: 'jane',
    url: 'www.edsdfs.lk',
    likes: 0
  }
  const component = render (
    <BlogForm blog={blog} createBlog={createBlog} />
  )

  const inputTitle = component.container.querySelector('#txtTitle')
  const inputAuthor = component.container.querySelector('#txtAuthor')
  const inputUrl = component.container.querySelector('#txtUrl')
  const form = component.container.querySelector('form')

  fireEvent.change(inputTitle, {
    target: { value: 'Testing of forms could be easier' }
  })
  fireEvent.change(inputAuthor, {
    target: { value: 'Brown' }
  })
  fireEvent.change(inputUrl, {
    target: { value: 'www.example.com' }
  })
  fireEvent.submit(form)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('Testing of forms could be easier')
  expect(createBlog.mock.calls[0][0].author).toBe('Brown')
  expect(createBlog.mock.calls[0][0].url).toBe('www.example.com')
})
