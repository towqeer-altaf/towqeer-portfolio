import { useCallback, useEffect, useState } from 'react';
import api, { assetUrl, authHeader } from '../api/client';

const emptyForm = { title: '', description: '', liveLink: '', githubLink: '', techStack: '' };

const ProjectSection = () => {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProjects = useCallback(async () => {
    const { data } = await api.get('/projects');
    setProjects(data);
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/projects')
      .then(({ data }) => { if (active) setProjects(data); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load projects.');
      });
    return () => { active = false; };
  }, []);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const resetForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData();
    data.append('title', form.title);
    data.append('description', form.description);
    data.append('liveLink', form.liveLink);
    data.append('githubLink', form.githubLink);
    data.append('techStack', JSON.stringify(form.techStack.split(',').map((item) => item.trim()).filter(Boolean)));
    if (imageFile) data.append('image', imageFile);

    try {
      if (editingId) {
        await api.put(`/projects/${editingId}`, data, { headers: authHeader() });
      } else {
        await api.post('/projects', data, { headers: authHeader() });
      }
      resetForm();
      event.target.reset();
      await fetchProjects();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save project.');
    } finally {
      setLoading(false);
    }
  };

  const editProject = (project) => {
    setEditingId(project._id);
    setForm({
      title: project.title || '',
      description: project.description || '',
      liveLink: project.liveLink || '',
      githubLink: project.githubLink || '',
      techStack: (project.techStack || []).join(', '),
    });
    setImageFile(null);
  };

  const deleteProject = async (project) => {
    if (!window.confirm(`Delete "${project.title}"?`)) return;
    setError('');
    try {
      await api.delete(`/projects/${project._id}`, { headers: authHeader() });
      await fetchProjects();
      if (editingId === project._id) resetForm();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete project.');
    }
  };

  return (
    <section className="admin-section">
      <h2 className="section-title">{editingId ? 'Edit project' : 'Add project'}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="admin-form card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Project title</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label className="admin-field">
            <span>Technologies (comma separated)</span>
            <input name="techStack" value={form.techStack} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>Live project URL</span>
            <input name="liveLink" type="url" value={form.liveLink} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>Source code URL</span>
            <input name="githubLink" type="url" value={form.githubLink} onChange={handleChange} />
          </label>
        </div>
        <label className="admin-field">
          <span>Description</span>
          <textarea name="description" rows="4" value={form.description} onChange={handleChange} required />
        </label>
        <label className="admin-field">
          <span>Project image (JPEG or PNG, up to 5 MB)</span>
          <input key={editingId || 'new-project'} type="file" accept="image/jpeg,image/png" onChange={(event) => setImageFile(event.target.files?.[0] || null)} />
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'SAVING…' : editingId ? 'UPDATE PROJECT' : 'SAVE PROJECT'}
          </button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={resetForm}>CANCEL</button>}
        </div>
      </form>

      <h2 className="section-title project-list-title">Published projects</h2>
      <div className="project-list">
        {projects.length ? projects.map((project) => (
          <article className="project-card" key={project._id}>
            <div>
              <h3 className="project-title">{project.title}</h3>
              <p className="project-description">{project.description}</p>
              {project.imageUrl && <a href={assetUrl(project.imageUrl)} target="_blank" rel="noreferrer">View image</a>}
              <div className="tag-list">
                {(project.techStack || []).map((technology) => <span className="tag" key={technology}>{technology}</span>)}
              </div>
            </div>
            <div className="project-meta">
              <button type="button" className="btn btn-ghost" onClick={() => editProject(project)}>EDIT</button>
              <button type="button" className="btn-danger-outline" onClick={() => deleteProject(project)}>DELETE</button>
            </div>
          </article>
        )) : <p className="placeholder-text">No projects published yet.</p>}
      </div>
    </section>
  );
};

export default ProjectSection;
