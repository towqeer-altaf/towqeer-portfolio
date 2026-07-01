import React, { useState } from 'react';
import profileImg from '../assets/profilePic.jpeg';
import useTypewriter from '../hooks/useTypewriter';
import CvModal from './CvModal';
import { EyeIcon, DownloadIcon, InstagramIcon, LinkedinIcon, XIcon, GithubIcon } from './icons';

// TODO: swap these for the real details when ready
const PROFILE = {
  name: 'Towqeer Altaf',
  title: 'Software Engineer',
  location: 'Jammu & Kashmir, India',
  bio: "ServiceNow-certified Application Developer and Software Engineer with hands-on experience building enterprise-grade applications, automation workflows, and governance frameworks. I bridge the gap between technical complexity and business outcomes — specializing in ServiceNow development, project management, and platform implementation.",
  socials: [
    { icon: InstagramIcon, href: '#', label: 'Instagram' },
    { icon: LinkedinIcon, href: '#', label: 'LinkedIn' },
    { icon: XIcon, href: '#', label: 'X' },
    { icon: GithubIcon, href: '#', label: 'GitHub' },
  ],
};

const ROLES = ['ServiceNow Developer', 'ServiceNow Specialist-I', 'Front End Developer'];

const RESUME_FILE_PATH = '/resume.pdf'; // put the real file at public/resume.pdf

const HomeHeroSection = () => {
  const [cvOpen, setCvOpen] = useState(false);
  const typedRole = useTypewriter(ROLES);

  return (
    <section className="hero" id="home">
      <aside className="hero-profile">
        <div className="hero-photo-ring">
          <img src={profileImg} alt={`Portrait of ${PROFILE.name}`} />
        </div>
        <h2 className="hero-name">{PROFILE.name}</h2>
        <p className="hero-role">{PROFILE.title}</p>
        <p className="hero-location">{PROFILE.location}</p>
        <div className="hero-socials">
          {PROFILE.socials.map(({ icon: Icon, href, label }) => (
            <a key={label} href={href} className="hero-social-btn" aria-label={label}>
              <Icon size={16} />
            </a>
          ))}
        </div>
      </aside>

      <div className="hero-intro">
        <p className="hero-eyebrow">
          <span className="hero-eyebrow-dot" aria-hidden="true"></span>
          Hello there
        </p>

        <h1 className="hero-heading">
          I am <span className="hero-heading-accent">{PROFILE.name},</span>
          <br />
          a{' '}
          <span className="hero-typewriter">
            {typedRole}
            <span className="hero-cursor" aria-hidden="true">|</span>
          </span>
        </h1>

        <p className="hero-bio">{PROFILE.bio}</p>

        <div className="hero-actions">
          <button type="button" className="btn btn--primary" onClick={() => setCvOpen(true)}>
            <EyeIcon size={16} /> View CV
          </button>
          <a href={RESUME_FILE_PATH} download className="btn btn--outline">
            <DownloadIcon size={16} /> Download Resume
          </a>
        </div>
      </div>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </section>
  );
};

export default HomeHeroSection;
