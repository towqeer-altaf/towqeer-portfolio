import { useEffect, useState } from 'react';
import api, { authHeader } from '../api/client';

const DocumentSection = () => {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({ fileName: '', category: 'Other', notes: '' });
  const [docFile, setDocFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [downloadingId, setDownloadingId] = useState('');

  const fetchDocs = async () => {
    const response = await api.get('/documents', { headers: authHeader() });
    setDocuments(response.data);
  };

  useEffect(() => {
    let active = true;
    api.get('/documents', { headers: authHeader() })
      .then(({ data }) => { if (active) setDocuments(data); })
      .catch((requestError) => {
        if (active) setError(requestError.response?.data?.message || 'Could not load documents.');
      });
    return () => { active = false; };
  }, []);

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    if (docFile) data.append('document', docFile);

    try {
      await api.post('/documents', data, { headers: authHeader() });
      setFormData({ fileName: '', category: 'Other', notes: '' });
      setDocFile(null);
      event.target.reset();
      await fetchDocs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Document upload failed.');
    } finally {
      setLoading(false);
    }
  };

  const downloadDocument = async (document) => {
    setError('');
    setDownloadingId(document._id);
    try {
      const { data } = await api.get(`/documents/${document._id}/file`, {
        headers: authHeader(),
        responseType: 'blob',
      });
      const objectUrl = URL.createObjectURL(data);
      const link = window.document.createElement('a');
      link.href = objectUrl;
      link.download = document.fileName || 'document';
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Document download failed.');
    } finally {
      setDownloadingId('');
    }
  };

  const deleteDoc = async (document) => {
    if (!window.confirm(`Delete "${document.fileName}"?`)) return;
    setError('');
    try {
      await api.delete(`/documents/${document._id}`, { headers: authHeader() });
      await fetchDocs();
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Document deletion failed.');
    }
  };

  return (
    <section className="documents-page">
      <h2 className="section-title">Private document vault</h2>
      <p className="admin-help">Documents are private to the admin account and are not displayed on the public portfolio.</p>
      {error && <p className="form-error" role="alert">{error}</p>}

      <form onSubmit={handleUpload} className="upload-card">
        <div className="form-row">
          <input
            type="text"
            placeholder="File name"
            value={formData.fileName}
            onChange={(event) => setFormData({ ...formData, fileName: event.target.value })}
            className="input"
            required
          />
          <select
            value={formData.category}
            onChange={(event) => setFormData({ ...formData, category: event.target.value })}
            className="select"
          >
            <option value="Certification">Certification</option>
            <option value="ID">ID</option>
            <option value="Resume">Resume</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <label className="field-label">
          Document file (JPEG, PNG, or PDF; up to 5 MB)
          <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={(event) => setDocFile(event.target.files?.[0] || null)} required className="file-input" />
        </label>
        <input
          type="text"
          placeholder="Notes (optional)"
          value={formData.notes}
          onChange={(event) => setFormData({ ...formData, notes: event.target.value })}
          className="input"
        />
        <button type="submit" disabled={loading} className="btn btn-primary btn-block">
          {loading ? 'UPLOADING…' : 'UPLOAD DOCUMENT'}
        </button>
      </form>

      <div className="document-list">
        {documents.length ? documents.map((document) => (
          <article key={document._id} className="document-row">
            <div>
              <span className="document-name">{document.fileName}</span>
              <span className="document-category">({document.category})</span>
              {document.notes && <p className="project-description">{document.notes}</p>}
            </div>
            <div className="document-actions">
              <button type="button" onClick={() => downloadDocument(document)} disabled={downloadingId === document._id} className="btn-link">
                {downloadingId === document._id ? 'DOWNLOADING…' : 'DOWNLOAD'}
              </button>
              <button type="button" onClick={() => deleteDoc(document)} className="btn-danger-outline">DELETE</button>
            </div>
          </article>
        )) : <p className="placeholder-text">No documents found.</p>}
      </div>
    </section>
  );
};

export default DocumentSection;
