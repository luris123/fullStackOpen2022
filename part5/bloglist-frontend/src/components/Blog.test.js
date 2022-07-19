import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'


test('render only the title and author by default', () => {
  const blog = {
    title: 'Testing a blog',
    author: 'Test author',
    url: 'www.test.com',
    likes: 0
  }

  render(<Blog blog={blog} />)
  const title = screen.getByText(blog.title, { exact: false })
  const author = screen.getByText(blog.author, { exact: false })
  const url = screen.queryByText(blog.url, { exact: false })
  const likes = screen.queryByText(blog.likes, { exact: false })
  expect(title).toBeInTheDocument()
  expect(author).toBeInTheDocument()
  expect(url).not.toBeInTheDocument()
  expect(likes).not.toBeInTheDocument()

})

test('render the full blog when the view button is clicked', async () => {
  const blog = {
    title: 'Testing a blog',
    author: 'Test author',
    url: 'www.test.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '5a422bc61b54a676234d17fc'
    }
  }

  const component = render(<Blog blog={blog} />)
  const button = component.getByText('view')
  await userEvent.click(button)
  const title = screen.getByText(blog.title, { exact: false })
  const author = screen.getByText(blog.author, { exact: false })
  const url = screen.getByText(blog.url, { exact: false })
  const likes = screen.getByText(blog.likes, { exact: false })
  expect(title).toBeInTheDocument()
  expect(author).toBeInTheDocument()
  expect(url).toBeInTheDocument()
  expect(likes).toBeInTheDocument()
})

test('when the like button is clicked twice, the event handler is called twice', async () => {
  const blog = {
    title: 'Testing a blog',
    author: 'Test author',
    url: 'www.test.com',
    likes: 0,
    user: {
      username: 'testuser',
      name: 'Test User',
      id: '5a422bc61b54a676234d17fc'
    }
  }

  const mockHandler = jest.fn()
  const component = render(<Blog blog={blog} handleLike={mockHandler} />)
  const button = component.getByText('view')
  await userEvent.click(button)
  const button2 = component.getByText('click to like')
  await userEvent.click(button2)
  await userEvent.click(button2)
  screen.debug(mockHandler.mock.calls)
  expect(mockHandler.mock.calls).toHaveLength(2)
})