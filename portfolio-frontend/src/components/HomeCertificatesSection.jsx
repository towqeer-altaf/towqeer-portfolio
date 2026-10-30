import { assetUrl } from '../api/client';

const HomeCertificatesSection = ({ certificates = [] }) => (
  <section className="portfolio-section section-muted" id="certificates">
    <div className="section-heading">
      <p className="eyebrow">Credentials & milestones</p>
      <h2>Certificates</h2>
    </div>
    {certificates.length ? (
      <div className="portfolio-grid">
        {certificates.map((certificate) => (
          <article className="portfolio-card certificate-card" key={certificate._id}>
            <span className="card-mark" aria-hidden="true">✦</span>
            <h3>{certificate.title}</h3>
            {certificate.issuer && <p>{certificate.issuer}</p>}
            {certificate.issuedAt && <p className="timeline-period">{certificate.issuedAt}</p>}
            {certificate.description && <p>{certificate.description}</p>}
            <div className="project-links">
              {certificate.credentialUrl && (
                <a href={certificate.credentialUrl} target="_blank" rel="noreferrer">Verify credential ↗</a>
              )}
              {certificate.fileUrl && (
                <a href={assetUrl(certificate.fileUrl)} target="_blank" rel="noreferrer">View certificate ↗</a>
              )}
            </div>
          </article>
        ))}
      </div>
    ) : <p className="section-copy">Certificates will appear here when published.</p>}
  </section>
);

export default HomeCertificatesSection;
