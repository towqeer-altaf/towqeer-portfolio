import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api, { authHeader } from '../api/client';

const RequireAdmin = ({ children }) => {
  const [status, setStatus] = useState(() => localStorage.getItem('adminToken') ? 'checking' : 'unauthenticated');

  useEffect(() => {
    let active = true;
    if (!localStorage.getItem('adminToken')) return () => { active = false; };

    api.get('/auth/me', { headers: authHeader() })
      .then(() => { if (active) setStatus('authenticated'); })
      .catch(() => {
        if (!active) return;
        localStorage.removeItem('adminToken');
        setStatus('unauthenticated');
      });

    return () => { active = false; };
  }, []);

  if (status === 'checking') {
    return <main className="admin-auth-check" role="status">Checking admin access…</main>;
  }
  if (status === 'unauthenticated') return <Navigate to="/login" replace />;
  return children;
};

export default RequireAdmin;
