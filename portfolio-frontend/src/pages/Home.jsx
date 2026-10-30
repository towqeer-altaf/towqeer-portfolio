import { useEffect, useState } from 'react';
import api from '../api/client';
import HomeNavbar from '../components/HomeNavbar';
import HomeHeroSection from '../components/HomeHeroSection';
import HomeAboutSection from '../components/HomeAboutSection';
import HomeServicesSection from '../components/HomeServicesSection';
import HomeProjectsSection from '../components/HomeProjectsSection';
import HomeExperienceSection from '../components/HomeExperienceSection';
import HomeEducationSection from '../components/HomeEducationSection';
import HomeCertificatesSection from '../components/HomeCertificatesSection';
import HomeContactSection from '../components/HomeContactSection';
import './Home.css';

const emptyProfile = {
  name: 'Towqeer Altaf',
  title: 'ServiceNow Specialist & Software Engineer',
  bio: '',
  location: '',
  email: '',
  phone: '',
  profileImageUrl: '',
  resumeUrl: '',
  socialLinks: [],
  skills: [],
  languages: [],
  experience: [],
  education: [],
  services: [],
};

const Home = () => {
  const [profile, setProfile] = useState(emptyProfile);
  const [projects, setProjects] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    let active = true;
    const loadPortfolio = async () => {
      const results = await Promise.allSettled([
        api.get('/profile'),
        api.get('/projects'),
        api.get('/certificates'),
      ]);
      if (!active) return;

      const errors = [];
      if (results[0].status === 'fulfilled') setProfile({ ...emptyProfile, ...results[0].value.data });
      else errors.push('profile');
      if (results[1].status === 'fulfilled') setProjects(results[1].value.data);
      else errors.push('projects');
      if (results[2].status === 'fulfilled') setCertificates(results[2].value.data);
      else errors.push('certificates');

      if (errors.length) setLoadError(`Some portfolio content could not be loaded (${errors.join(', ')}).`);
      setLoading(false);
    };

    loadPortfolio();
    return () => { active = false; };
  }, []);

  return (
    <div className="portfolio-page">
      <HomeNavbar name={profile.name} />
      {loadError && <p className="portfolio-load-error" role="status">{loadError}</p>}
      {loading && <p className="portfolio-loading" role="status">Loading portfolio…</p>}
      <main className="portfolio-main">
        <HomeHeroSection profile={profile} />
        <HomeAboutSection profile={profile} />
        <HomeServicesSection services={profile.services} />
        <HomeProjectsSection projects={projects} />
        <HomeExperienceSection experience={profile.experience} />
        <HomeEducationSection education={profile.education} />
        <HomeCertificatesSection certificates={certificates} />
        <HomeContactSection profile={profile} />
      </main>
      <footer className="portfolio-footer">© {new Date().getFullYear()} {profile.name || 'Portfolio'}</footer>
    </div>
  );
};

export default Home;
