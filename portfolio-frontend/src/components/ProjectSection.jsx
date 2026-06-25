import React, { useState, useEffect, useCallback } from 'react';
import api, { authHeader } from '../api/client';

const RECORDS_PER_PAGE = 5;

/**
 * Owns everything related to projects: fetching the catalog, creating new
 * projects, deleting them, and client-side pagination. This is intentionally
 * self-contained — Dashboard.jsx doesn't need to know how projects work,
 * only that this section exists.
 */
const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    liveLink: '',
    githubLink: '',
    techStack: '',
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  }, []);

  // Projects are public data needed as soon as this section mounts.
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('liveLink', formData.liveLink);
    data.append('githubLink', formData.githubLink);

    // Convert comma-separated string to array before sending
    const techArray = formData.techStack.split(',').map((item) => item.trim());
    data.append('techStack', JSON.stringify(techArray));

    if (imageFile) data.append('image', imageFile);

    try {
      await api.post('/projects', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...authHeader(),
        },
      });

      setFormData({ title: '', description: '', liveLink: '', githubLink: '', techStack: '' });
      setImageFile(null);
      setCurrentPage(1);
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      await api.delete(`/projects/${id}`, { headers: authHeader() });
      fetchProjects();
    } catch (err) {
      alert('Failed to delete project');
    }
  };

  // Client-side pagination
  const indexOfLastRecord = currentPage * RECORDS_PER_PAGE;
  const indexOfFirstRecord = indexOfLastRecord - RECORDS_PER_PAGE;
  const currentRecords = projects.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(projects.length / RECORDS_PER_PAGE);

  return (
    <div className="projects-grid">
      {/* Left: Project Creation Form */}
      <div className="card">
        <h2 className="section-title">Add Project</h2>
        {error && <p className="form-error">{error}</p>}

        <form onSubmit={handleSubmit} className="form">
          <input
            type="text"
            name="title"
            placeholder="Project Title"
            value={formData.title}
            onChange={handleInputChange}
            required
            className="input"
          />
          <textarea
            name="description"
            placeholder="Project Description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="textarea"
          />
          <input
            type="text"
            name="techStack"
            placeholder="Tech Stack (comma separated: React, Node, Express)"
            value={formData.techStack}
            onChange={handleInputChange}
            required
            className="input"
          />
          <input
            type="url"
            name="liveLink"
            placeholder="Live URL"
            value={formData.liveLink}
            onChange={handleInputChange}
            className="input"
          />
          <input
            type="url"
            name="githubLink"
            placeholder="GitHub URL"
            value={formData.githubLink}
            onChange={handleInputChange}
            className="input"
          />
          <div>
            <label className="field-label">Project Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} required className="file-input" />
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary btn-block">
            {loading ? 'SAVING...' : 'SAVE PROJECT'}
          </button>
        </form>
      </div>

      {/* Right: Data Table Grid & Pagination */}
      <div>
        <h2 className="section-title">Project Catalog</h2>

        <div className="project-list">
          {currentRecords.length === 0 ? (
            <p className="placeholder-text">No projects found.</p>
          ) : (
            currentRecords.map((project) => (
              <div key={project._id} className="project-card">
                <div>
                  <h3 className="project-title">{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="tag-list">
                    {Array.isArray(project.techStack) &&
                      project.techStack.map((tech, i) => (
                        <span key={i} className="tag">{tech}</span>
                      ))}
                  </div>
                </div>

                <div className="project-meta">
                  <span className="project-date">
                    {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                  <button onClick={() => handleDelete(project._id)} className="btn-danger-outline">
                    DELETE
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
              className="pagination-btn"
            >
              ← PREV
            </button>
            <span className="pagination-status">
              PAGE {currentPage} OF {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
              className="pagination-btn"
            >
              NEXT →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectSection;
