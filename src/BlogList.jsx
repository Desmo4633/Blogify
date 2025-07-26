import React from 'react';
import { Link } from 'react-router-dom';

function BlogList({ blogs, loading, userInfo, onDeleteBlog }) {
  if (loading) {
    return <h2>Loading Blogs...</h2>;
  }

  return (
    <>
      <div className="blog-list-grid">
        {blogs.map((blog) => (
          <div className="blog-card" key={blog._id}>
            <div className="blog-card-body">
              <h3>{blog.heading}</h3>
              <p>{blog.description}</p>
              <Link to={`/blog/${blog._id}`} className="read-more-btn">Read More</Link>
            </div>
            {userInfo && (
              <button className="delete-btn" onClick={() => onDeleteBlog(blog._id)}>Delete</button>
            )}
          </div>
        ))}
      </div>
      
      {userInfo && (
        <div className="create-blog-action-container">
          <Link to="/create" className="create-btn large">
            + Create New Blog
          </Link>
        </div>
      )}
    </>
  );
}

export default BlogList;