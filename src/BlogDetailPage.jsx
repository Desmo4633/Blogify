import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function BlogDetailPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blogs/${id}`);
        if (!response.ok) throw new Error('Blog not found');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [id]);

  if (loading) return <h2>Loading Blog...</h2>;
  
  if (!blog) {
    return (
      <div className="blog-detail-container">
        <h2>Blog not found</h2>
        <Link to="/" className="back-btn">Go back to Home</Link>
      </div>
    );
  }

  const createMarkup = (htmlContent) => ({ __html: htmlContent });

  return (
    <div className="blog-detail-container">
      <Link to="/" className="back-btn">← Back to All Blogs</Link>
      <h1 className="blog-detail-heading">{blog.heading}</h1>
      {blog.image && <img src={blog.image} alt={blog.heading} className="blog-detail-image" />}
      {blog.description && <p className="blog-detail-description">{blog.description}</p>}
      <div 
        className="blog-detail-content" 
        dangerouslySetInnerHTML={createMarkup(blog.content)} 
      />
    </div>
  );
}

export default BlogDetailPage;