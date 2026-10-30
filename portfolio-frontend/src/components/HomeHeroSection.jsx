import fallbackImage from '../assets/profilePic.jpeg';
import fallbackResume from '../assets/TowqeerAltaf.pdf';
import { assetUrl } from '../api/client';

const HomeHeroSection = ({ profile }) => {
  const image = assetUrl(profile.profileImageUrl) || fallbackImage;
  const resume = assetUrl(profile.resumeUrl) || fallbackResume;

  return (
    <section className="portfolio-hero" id="home">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot" /> Available for opportunities</p>
        <h1>{profile.name || 'Towqeer Altaf'}<span>.</span></h1>
        <p className="hero-title">{profile.title || 'ServiceNow Specialist & Software Engineer'}</p>
        {profile.bio && <p className="hero-bio">{profile.bio}</p>}
        <div className="hero-details">
          {[profile.location, profile.email, profile.phone].filter(Boolean).map((detail) => (
            <span key={detail}>{detail}</span>
          ))}
        </div>
        <div className="hero-actions">
          <a className="portfolio-button portfolio-button--primary" href="#contact">Get in touch</a>
          {resume && (
            <a className="portfolio-button" href={resume} target="_blank" rel="noreferrer" download>
              Download resume
            </a>
          )}
        </div>
        {profile.socialLinks?.length > 0 && (
          <div className="social-links">
            {profile.socialLinks.map((item) => (
              <a key={`${item.label}-${item.url}`} href={item.url} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </div>
        )}
      </div>
      <div className="hero-portrait">
        <img src={image} alt={profile.name ? `Portrait of ${profile.name}` : 'Profile portrait'} />
        <span>{profile.title || 'Software Engineer'}</span>
      </div>
    </section>
  );
};

export default HomeHeroSection;
