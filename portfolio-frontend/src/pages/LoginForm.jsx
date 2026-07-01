import React from 'react';

export default function LoginForm({
  username,
  password,
  onUsernameChange,
  onPasswordChange,
  onSubmit,
  loading,
}) {
  return (
    <form onSubmit={onSubmit} className="login-form" noValidate>
      <div className="login-field">
        <label htmlFor="username" className="login-label">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => onUsernameChange(e.target.value)}
          className="login-input"
          placeholder="admin"
          autoComplete="username"
          required
        />
      </div>

      <div className="login-field">
        <label htmlFor="password" className="login-label">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="login-input"
          placeholder="••••••••"
          autoComplete="current-password"
          required
        />
      </div>

      <button type="submit" disabled={loading} className="login-button">
        {loading && <span className="login-spinner" aria-hidden="true" />}
        {loading ? 'Signing in…' : 'Sign In'}
      </button>
    </form>
  );
}
