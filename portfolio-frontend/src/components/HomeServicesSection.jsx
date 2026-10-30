const HomeServicesSection = ({ services = [] }) => (
  <section className="portfolio-section section-muted" id="services">
    <div className="section-heading">
      <p className="eyebrow">What I do</p>
      <h2>Services & capabilities</h2>
    </div>
    {services.length ? (
      <div className="portfolio-grid">
        {services.map((service) => (
          <article className="portfolio-card" key={`${service.title}-${service.description}`}>
            <span className="card-mark" aria-hidden="true">↗</span>
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </article>
        ))}
      </div>
    ) : <p className="section-copy">Services will appear here when added to the profile.</p>}
  </section>
);

export default HomeServicesSection;
