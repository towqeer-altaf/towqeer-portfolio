import React, { useState, useEffect, useCallback } from 'react';
import api, { authHeader } from '../api/client';

/**
 * Document Vault: upload, list, share-link, and delete documents.
 * Mirrors ProjectSection's pattern — fetch on mount, manual refetch after
 * any mutation.
 */
const DocumentSection = () => {
  const [documents, setDocuments] = useState([]);
  const [docFormData, setDocFormData] = useState({ fileName: '', category: 'Other', notes: '' });
  const [docFile, setDocFile] = useState(null);

  const fetchDocs = useCallback(async () => {
    try {
      const res = await api.get('/documents', { headers: authHeader() });
      setDocuments(res.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    }
  }, []);

  useEffect(() => {
    fetchDocs();
  }, [fetchDocs]);

  const handleDocSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('fileName', docFormData.fileName);
    data.append('category', docFormData.category);
    data.append('notes', docFormData.notes);
    data.append('document', docFile);

    try {
      await api.post('/documents', data, { headers: authHeader() });
      await fetchDocs();
      setDocFormData({ fileName: '', category: 'Other', notes: '' });
      setDocFile(null);
    } catch (err) {
      console.error('Upload failed:', err);
    }
  };

  const deleteDoc = async (id) => {
    try {
      await api.delete(`/documents/${id}`, { headers: authHeader() });
      fetchDocs();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  };

  return (
    <div className="documents-page">
      <h2 className="section-title">Document Vault</h2>

      <form onSubmit={handleDocSubmit} className="upload-card">
        <div className="form-row">
          <input
            type="text"
            placeholder="File Name"
            value={docFormData.fileName}
            onChange={(e) => setDocFormData({ ...docFormData, fileName: e.target.value })}
            className="input"
          />
          <select
            value={docFormData.category}
            onChange={(e) => setDocFormData({ ...docFormData, category: e.target.value })}
            className="select"
          >
            <option value="Certification">Certification</option>
            <option value="ID">ID</option>
            <option value="Resume">Resume</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <input type="file" onChange={(e) => setDocFile(e.target.files[0])} className="file-input" />
        <button type="submit" className="btn btn-primary btn-block">
          UPLOAD DOCUMENT
        </button>
      </form>

      <div className="document-list">
        {documents && documents.length > 0 ? (
          documents.map((doc) => {
            const fileUrl = `http://localhost:5000${doc.fileUrl}`;
            return (
              <div key={doc._id} className="document-row">
                <div>
                  <span className="document-name">{doc.fileName}</span>
                  <span className="document-category">({doc.category})</span>
                </div>

                <div className="document-actions">
                  <a href={fileUrl} target="_blank" rel="noreferrer" className="btn-link">
                    VIEW
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(fileUrl);
                      alert('Link copied to clipboard!');
                    }}
                    className="btn-ghost"
                  >
                    SHARE
                  </button>
                  <button onClick={() => deleteDoc(doc._id)} className="btn-danger-outline">
                    DELETE
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <p className="placeholder-text">No documents found.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentSection;
