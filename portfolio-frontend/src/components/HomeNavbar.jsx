import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
];

const HomeNavbar = () => {
  return (
    <nav className="nav">
      <span className="nav-logo">TA</span>

      <div className="nav-links">
        {navLinks.map((link) => (
          <a key={link.label} href={link.href} className="nav-link">
            {link.label}
          </a>
        ))}
      </div>

      <div className="nav-actions">
        <ThemeToggle />
        <Link to="/login" className="nav-admin">🔒 Admin</Link>
      </div>
    </nav>
  );
};

export default HomeNavbar;
