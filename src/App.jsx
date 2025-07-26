import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Outlet } from 'react-router-dom';
import BlogList from './BlogList';
import CreateBlogPage from './CreateBlogPage';
import BlogDetailPage from './BlogDetailPage';
import AuthModal from './AuthModal';
import './App.css';

const AppLayout = ({ userInfo, onAuthClick, onLogout }) => {
  return (
    <div className="blog-app">
      <header className="blog-header">
        <Link to="/" className="blog-logo" style={{ textDecoration: 'none' }}>🖋 blogify</Link>
        <div className="auth-section">
          {userInfo ? (
            <>
              <span className="user-email">{userInfo.email}</span>
              <button className="auth-btn logout" onClick={onLogout}>Logout</button>
            </>
          ) : (
            <button className="auth-btn" onClick={() => onAuthClick('login')}>Login / Signup</button>
          )}
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authModalMode, setAuthModalMode] = useState(null);
  
  const [userInfo, setUserInfo] = useState(() => {
    const storedUserInfo = sessionStorage.getItem('userInfo');
    return storedUserInfo ? JSON.parse(storedUserInfo) : null;
  });

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/blogs');
        if (!response.ok) throw new Error('Failed to fetch blogs');
        const data = await response.json();
        setBlogs(data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const handleAddBlog = async (blogData) => {
    if (!userInfo) return alert('You must be logged in to create a blog.');
    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userInfo.token}`,
        },
        body: JSON.stringify(blogData),
      });
      if (!response.ok) throw new Error('Failed to create blog');
      const newBlog = await response.json();
      setBlogs([newBlog, ...blogs]);
    } catch (error) {
      console.error('Error creating blog:', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    if (!userInfo) return alert('You must be logged in to delete a blog.');
    try {
      const response = await fetch(`/api/blogs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${userInfo.token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete blog');
      setBlogs(blogs.filter((blog) => blog._id !== id));
    } catch (error) {
      console.error('Error deleting blog:', error);
    }
  };

  const handleAuthSuccess = (data) => {
    sessionStorage.setItem('userInfo', JSON.stringify(data));
    setUserInfo(data);
    setAuthModalMode(null);
  };
  
  const handleLogin = async ({ email, password }) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Login failed');
      handleAuthSuccess(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleSignup = async ({ email, password }) => {
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Signup failed');
      handleAuthSuccess(data);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('userInfo');
    setUserInfo(null);
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout userInfo={userInfo} onAuthClick={setAuthModalMode} onLogout={handleLogout} />}>
          <Route index element={<BlogList blogs={blogs} loading={loading} userInfo={userInfo} onDeleteBlog={handleDeleteBlog} />} />
          <Route path="create" element={<CreateBlogPage onAddBlog={handleAddBlog} />} />
          <Route path="blog/:id" element={<BlogDetailPage />} />
        </Route>
      </Routes>
      
      {authModalMode && (
        <AuthModal
          initialMode={authModalMode}
          onClose={() => setAuthModalMode(null)}
          onLogin={handleLogin}
          onSignup={handleSignup}
        />
      )}
    </Router>
  );
}

export default App;