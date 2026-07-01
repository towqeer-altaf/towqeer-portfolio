import React, { useState, useEffect } from 'react';
import axios from 'axios';

const HomeProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/projects');
        setProjects(res.data.projects || res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section className="section" id="projects">
      <div className="section-inner">
        <p className="eyebrow">// portfolio</p>
        <h2 className="section-title">Selected projects</h2>

        {loading ? (
          <p className="projects-status">// loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="projects-status">// no projects deployed yet</p>
        ) : (
          <div className="projects-grid">
            {projects.map((project) => (
              <article className="project-card" key={project._id}>
                <div className="project-media">
                  <img
                    src={`http://localhost:5000/uploads/${project.imageUrl?.split('/').pop()}`}
                    alt={project.title}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/400x220?text=No+Image+Found'; }}
                  />
                </div>
                <div className="project-body">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="project-links">
                    {project.liveLink && (
                      <a href={project.liveLink} target="_blank" rel="noreferrer" className="tag">
                        &lt;LiveDemo /&gt;
                      </a>
                    )}
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noreferrer" className="tag tag--ghost">
                        &lt;Source /&gt;
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default HomeProjectsSection;
