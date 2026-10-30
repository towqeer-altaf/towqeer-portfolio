import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequireAdmin from './components/RequireAdmin';

function App() {
  return (
    <Router>
      <Routes>
        {/* The clean public page everyone sees */}
        <Route path="/" element={<Home />} />

        {/* Your existing secure admin entry points */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin/dashboard" element={
          <RequireAdmin>
            <Dashboard />
          </RequireAdmin>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;