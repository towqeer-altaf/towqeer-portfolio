import { assetUrl } from '../api/client';

const normalizeTechStack = (techStack = []) => techStack.flatMap((technology) => {
  if (typeof technology !== 'string') return [];
  try {
    const parsed = JSON.parse(technology);
    if (Array.isArray(parsed)) return parsed.filter((item) => typeof item === 'string');
  } catch {
    return [technology];
  }
  return [technology];
});

const HomeProjectsSection = ({ projects = [] }) => (
  <section className="portfolio-section" id="projects">
    <div className="section-heading">
      <p className="eyebrow">Selected work</p>
      <h2>Projects</h2>
    </div>
    {projects.length ? (
      <div className="portfolio-grid project-grid">
        {projects.map((project) => (
          <article className="portfolio-card project-card" key={project._id}>
            {project.imageUrl && (
              <img className="project-image" src={assetUrl(project.imageUrl)} alt="" loading="lazy" />
            )}
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            {normalizeTechStack(project.techStack).length > 0 && (
              <div className="skill-list">
                {normalizeTechStack(project.techStack).map((technology) => (
                  <span className="skill-chip" key={technology}>{technology}</span>
                ))}
              </div>
            )}
            <div className="project-links">
              {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer">Live project ↗</a>}
              {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer">Source code ↗</a>}
            </div>
          </article>
        ))}
      </div>
    ) : <p className="section-copy">Projects will appear here when published.</p>}
  </section>
);

export default HomeProjectsSection;
