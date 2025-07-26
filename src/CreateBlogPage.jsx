import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

function CreateBlogPage({ onAddBlog }) {
  const [heading, setHeading] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!heading.trim() || !content.trim()) return;
    onAddBlog({ heading, description, image, content });
    navigate('/');
  };

  return (
    <div className="create-blog-page">
      <h2>Create a New Blog</h2>
      <form className="create-blog-page-form" onSubmit={handleSubmit}>
        <input type="text" placeholder="Blog Title / Heading" value={heading} onChange={(e) => setHeading(e.target.value)} required />
        <input type="text" placeholder="Short Description (Excerpt)" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input type="text" placeholder="Cover Image URL (optional)" value={image} onChange={(e) => setImage(e.target.value)} />
        <div className="quill-label">Full Content</div>
        <ReactQuill value={content} onChange={setContent} theme="snow" className="quill-editor" placeholder='Write your amazing blog post here...' />
        <button type="submit" className="create-btn" style={{ marginTop: '1.5rem', width: '100%' }}>Publish Blog</button>
      </form>
    </div>
  );
}

export default CreateBlogPage;