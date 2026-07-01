import React from 'react';

const services = [
  {
    tag: '<WebDev />',
    title: 'Web development',
    description: 'Building fast, responsive MERN-stack applications with scalable data models and tuned performance.',
  },
  {
    tag: '<Freelance />',
    title: 'Freelancing',
    description: 'Shipping complete, production-ready systems independently, with clean architecture and fast turnarounds.',
  },
  {
    tag: '<Design />',
    title: 'Creative editing',
    description: 'Refining visual assets and content to match clean, considered branding across every touchpoint.',
  },
];

const HomeServicesSection = () => {
  return (
    <section className="section section--alt">
      <div className="section-inner">
        <p className="eyebrow">// capabilities</p>
        <h2 className="section-title">What I build</h2>
        <div className="services-grid">
          {services.map((service) => (
            <div className="service-card" key={service.title}>
              <span className="tag service-tag">{service.tag}</span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeServicesSection;
