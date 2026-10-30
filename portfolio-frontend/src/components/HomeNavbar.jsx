import { Link } from 'react-router-dom';

const links = [
  ['About', '#about'],
  ['Services', '#services'],
  ['Projects', '#projects'],
  ['Experience', '#experience'],
  ['Education', '#education'],
  ['Certificates', '#certificates'],
  ['Contact', '#contact'],
];

const HomeNavbar = ({ name }) => (
  <header className="portfolio-nav">
    <a className="portfolio-brand" href="#home">
      {name || 'Portfolio'}<span>.</span>
    </a>
    <nav aria-label="Portfolio sections">
      {links.map(([label, href]) => (
        <a key={href} href={href}>{label}</a>
      ))}
      <Link className="portfolio-admin-link" to="/login">Admin sign in</Link>
    </nav>
  </header>
);

export default HomeNavbar;
