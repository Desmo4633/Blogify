import React, { useState } from 'react';

const LoginForm = ({ onLogin, switchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) return;
    onLogin({ email, password });
  };

  return (
    <>
      <h2>Login</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="login-email">Email</label>
          <input type="email" id="login-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="login-password">Password</label>
          <input type="password" id="login-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-btn submit">Login</button>
      </form>
      <p className="auth-switch">
        Don't have an account? <a href="#" onClick={switchToSignup}>Sign up</a>
      </p>
    </>
  );
};

const SignupForm = ({ onSignup, switchToLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) return alert('Passwords do not match!');
    if (!email || !password) return;
    onSignup({ email, password });
  };

  return (
    <>
      <h2>Create Account</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="signup-email">Email</label>
          <input type="email" id="signup-email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="signup-password">Password</label>
          <input type="password" id="signup-password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label htmlFor="signup-confirm-password">Confirm Password</label>
          <input type="password" id="signup-confirm-password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </div>
        <button type="submit" className="auth-btn submit">Sign Up</button>
      </form>
      <p className="auth-switch">
        Already have an account? <a href="#" onClick={switchToLogin}>Login</a>
      </p>
    </>
  );
};


function AuthModal({ onClose, onLogin, onSignup, initialMode = 'login' }) {
  const [mode, setMode] = useState(initialMode);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-modal" onClick={onClose}>×</button>
        {mode === 'login' ? (
          <LoginForm onLogin={onLogin} switchToSignup={() => setMode('signup')} />
        ) : (
          <SignupForm onSignup={onSignup} switchToLogin={() => setMode('login')} />
        )}
      </div>
    </div>
  );
}

export default AuthModal;