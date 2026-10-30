import { useCallback, useEffect, useState } from 'react';
import api, { assetUrl, authHeader } from '../api/client';

const emptyForm = { title: '', issuer: '', issuedAt: '', description: '', credentialUrl: '' };

const CertificateSection = () => {
  const [certificates, setCertificates] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCertificates = useCallback(async () => {
    const { data } = await api.get('/certificates');
    setCertificates(data);
  }, []);

  useEffect(() => {
    let active = true;
    api.get('/certificates')
      .then(({ data }) => { if (active) setCertificates(data); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load certificates.');
      });
    return () => { active = false; };
  }, [fetchCertificates]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    if (file) data.append('file', file);

    try {
      if (editingId) {
        await api.put(`/certificates/${editingId}`, data, { headers: authHeader() });
      } else {
        await api.post('/certificates', data, { headers: authHeader() });
      }
      setForm(emptyForm);
      setFile(null);
      setEditingId('');
      event.target.reset();
      await fetchCertificates();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not save certificate.');
    } finally {
      setLoading(false);
    }
  };

  const editCertificate = (certificate) => {
    setEditingId(certificate._id);
    setForm({
      title: certificate.title || '',
      issuer: certificate.issuer || '',
      issuedAt: certificate.issuedAt || '',
      description: certificate.description || '',
      credentialUrl: certificate.credentialUrl || '',
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const deleteCertificate = async (certificate) => {
    if (!window.confirm(`Delete "${certificate.title}"?`)) return;
    setError('');
    try {
      await api.delete(`/certificates/${certificate._id}`, { headers: authHeader() });
      await fetchCertificates();
      if (editingId === certificate._id) {
        setEditingId('');
        setForm(emptyForm);
      }
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Could not delete certificate.');
    }
  };

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  return (
    <section className="admin-section">
      <h2 className="section-title">{editingId ? 'Update certificate' : 'Add certificate'}</h2>
      {error && <p className="form-error" role="alert">{error}</p>}
      <form className="admin-form card" onSubmit={handleSubmit}>
        <div className="admin-form-grid">
          <label className="admin-field">
            <span>Certificate name</span>
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label className="admin-field">
            <span>Issuing organization</span>
            <input name="issuer" value={form.issuer} onChange={handleChange} />
          </label>
          <label className="admin-field">
            <span>Issue date</span>
            <input name="issuedAt" value={form.issuedAt} onChange={handleChange} placeholder="Month YYYY" />
          </label>
          <label className="admin-field">
            <span>Credential verification URL</span>
            <input name="credentialUrl" type="url" value={form.credentialUrl} onChange={handleChange} />
          </label>
        </div>
        <label className="admin-field">
          <span>Description</span>
          <textarea name="description" rows="3" value={form.description} onChange={handleChange} />
        </label>
        <label className="admin-field">
          <span>Certificate file (JPEG, PNG, or PDF; up to 5 MB)</span>
          <input key={editingId || 'new-certificate'} type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setFile(event.target.files?.[0] || null)} />
        </label>
        <div className="admin-actions">
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'SAVING…' : editingId ? 'UPDATE CERTIFICATE' : 'SAVE CERTIFICATE'}
          </button>
          {editingId && <button type="button" className="btn btn-ghost" onClick={() => { setEditingId(''); setForm(emptyForm); setFile(null); }}>CANCEL</button>}
        </div>
      </form>

      <h2 className="section-title certificate-list-title">Published certificates</h2>
      <div className="project-list">
        {certificates.length ? certificates.map((certificate) => (
          <article className="project-card" key={certificate._id}>
            <div>
              <h3 className="project-title">{certificate.title}</h3>
              <p className="project-description">{[certificate.issuer, certificate.issuedAt].filter(Boolean).join(' · ')}</p>
              {certificate.fileUrl && <a href={assetUrl(certificate.fileUrl)} target="_blank" rel="noreferrer">View uploaded certificate</a>}
            </div>
            <div className="project-meta">
              <button type="button" className="btn btn-ghost" onClick={() => editCertificate(certificate)}>EDIT</button>
              <button type="button" className="btn-danger-outline" onClick={() => deleteCertificate(certificate)}>DELETE</button>
            </div>
          </article>
        )) : <p className="placeholder-text">No certificates published yet.</p>}
      </div>
    </section>
  );
};

export default CertificateSection;
