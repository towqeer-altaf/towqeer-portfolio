import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';
import LoginForm from './LoginForm';
import SocialLogin from './SocialLogin';
import './Login.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Sends 'username' and 'password' matching your backend schema
      const response = await API.post('/auth/login', { username, password });

      if (response.data.token) {
        localStorage.setItem('adminToken', response.data.token);
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid admin credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Point this at your backend's OAuth entry point.
    // Example: window.location.href = `${API_BASE_URL}/auth/google`;
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="login-page">
      <div className="login-page__glow login-page__glow--one" aria-hidden="true" />
      <div className="login-page__glow login-page__glow--two" aria-hidden="true" />

      <div className="login-card">
        <span className="login-card__badge">Admin Portal</span>
        <h1 className="login-card__title">Welcome back</h1>
        <p className="login-card__subtitle">
          Sign in to manage your portfolio's content and settings.
        </p>

        {error && (
          <div className="login-alert" role="alert">
            {error}
          </div>
        )}

        <LoginForm
          username={username}
          password={password}
          onUsernameChange={setUsername}
          onPasswordChange={setPassword}
          onSubmit={handleLogin}
          loading={loading}
        />

        <div className="login-divider">
          <span>or</span>
        </div>

        <SocialLogin onGoogleClick={handleGoogleLogin} />
      </div>
    </div>
  );
}
