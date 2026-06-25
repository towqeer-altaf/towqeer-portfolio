import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/client';

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Admin Portal</h2>
        <p style={styles.subtitle}>Enter your credentials to manage your system.</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={styles.input} 
              placeholder="admin"
              required 
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={styles.input} 
              placeholder="••••••••"
              required 
            />
          </div>

          <button type="submit" disabled={loading} style={styles.button}>
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f9f9f9',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    background: '#ffffff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
    width: '100%',
    maxWidth: '400px',
    textAlign: 'center',
    border: '1px solid #eaeaea',
  },
  title: {
    margin: '0 0 8px 0',
    color: '#111111',
    fontSize: '24px',
    fontWeight: '600',
  },
  subtitle: {
    margin: '0 0 24px 0',
    color: '#666666',
    fontSize: '14px',
  },
  form: {
    textAlign: 'left',
  },
  inputGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: '500',
    color: '#444444',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#333333',
    boxSizing: 'border-box',
    outline: 'none',
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#111111',
    color: '#ffffff',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    marginTop: '10px',
  },
  error: {
    backgroundColor: '#fff5f5',
    color: '#e53e3e',
    padding: '10px',
    borderRadius: '6px',
    fontSize: '13px',
    marginBottom: '20px',
    border: '1px solid #fed7d7',
  }
};