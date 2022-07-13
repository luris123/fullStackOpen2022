import React from 'react';
import Blog from './Blog';

const BlogList = ({ blogs, setBlogs, user, handleDelete }) => {
  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes);
  return sortedBlogs.map((blog) => (
    <Blog
      key={blog.id}
      blog={blog}
      setBlogs={setBlogs}
      user={user}
    />
  ));
};

export default BlogList;