const HomeEducationSection = ({ education = [] }) => (
  <section className="portfolio-section" id="education">
    <div className="section-heading">
      <p className="eyebrow">Learning journey</p>
      <h2>Education</h2>
    </div>
    {education.length ? (
      <div className="portfolio-grid">
        {education.map((item, index) => (
          <article className="portfolio-card" key={`${item.institution}-${item.degree}-${index}`}>
            <p className="timeline-period">{item.period}</p>
            <h3>{item.degree}</h3>
            <p>{item.institution}</p>
            {item.details && <p>{item.details}</p>}
          </article>
        ))}
      </div>
    ) : <p className="section-copy">Education will appear here when added to the profile.</p>}
  </section>
);

export default HomeEducationSection;
