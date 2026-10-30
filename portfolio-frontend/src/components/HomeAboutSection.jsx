const HomeAboutSection = ({ profile }) => (
  <section className="portfolio-section" id="about">
    <div className="section-heading">
      <p className="eyebrow">A little about me</p>
      <h2>Turning ideas into useful technology.</h2>
    </div>
    {profile.bio ? <p className="section-copy">{profile.bio}</p> : (
      <p className="section-copy">My profile is being updated. Please check back soon.</p>
    )}
    {profile.skills?.length > 0 && (
      <div className="skill-list" aria-label="Skills">
        {profile.skills.map((skill) => <span className="skill-chip" key={skill}>{skill}</span>)}
      </div>
    )}
    {profile.languages?.length > 0 && (
      <p className="language-list"><strong>Languages:</strong> {profile.languages.join(' · ')}</p>
    )}
  </section>
);

export default HomeAboutSection;
