const HomeExperienceSection = ({ experience = [] }) => (
  <section className="portfolio-section section-muted" id="experience">
    <div className="section-heading">
      <p className="eyebrow">Professional journey</p>
      <h2>Experience</h2>
    </div>
    {experience.length ? (
      <div className="timeline">
        {experience.map((item, index) => (
          <article className="timeline-item" key={`${item.company}-${item.role}-${index}`}>
            <p className="timeline-period">{item.duration}</p>
            <h3>{item.role}</h3>
            <p className="timeline-company">{item.company}</p>
            {item.responsibilities?.length > 0 && (
              <ul>{item.responsibilities.map((responsibility) => <li key={responsibility}>{responsibility}</li>)}</ul>
            )}
          </article>
        ))}
      </div>
    ) : <p className="section-copy">Experience will appear here when added to the profile.</p>}
  </section>
);

export default HomeExperienceSection;
