import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Assumes centralized instance or configured defaults

const Dashboard = () => {
const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'projects');
  const [projects, setProjects] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Form State
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

  //state for messages
  const [messages, setMessages] = useState([]);
  

  // Fetch messages on load
useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        
        // Always fetch projects
        const pRes = await axios.get('http://localhost:5000/api/projects');
        setProjects(pRes.data);

        // Only fetch messages if the tab is 'messages'
        if (activeTab === 'messages') {
          const mRes = await axios.get('http://localhost:5000/api/contact', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setMessages(mRes.data);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      }
    };

    fetchData();
  }, [activeTab]);

  // Fetch Projects
  const fetchProjects = async () => {
    try {
      // Adjust path if your centralized axios uses a different base URL
      const res = await axios.get('http://localhost:5000/api/projects');
      setProjects(res.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

useEffect(() => {
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const res = await axios.get('http://localhost:5000/api/contact', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("Fetched messages:", res.data); // LOG THIS TO SEE IF DATA IS ACTUALLY ARRIVING
      setMessages(res.data);
    } catch (err) {
      console.error('Full error details:', err.response || err);
    }
  };
  
  if (activeTab === 'messages') { // Only fetch when the tab is active
    fetchMessages();
  }
}, [activeTab]); // Trigger fetch when tab changes

  // Handle Client-Side Pagination Calculations
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = projects.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(projects.length / recordsPerPage);

  // Form Submission (Multipart/Form-Data for Multer)
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


  
  // FIX: Convert comma-separated string to array
  const techArray = formData.techStack.split(',').map(item => item.trim());
  data.append('techStack', JSON.stringify(techArray)); 

  if (imageFile) data.append('image', imageFile);

  // FIXED: Changed 'token' to 'adminToken' to match your storage schema
  const token = localStorage.getItem('adminToken'); 

  try {
    await axios.post('http://localhost:5000/api/projects', data, {
      headers: { 
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${token}` 
      },
    });
    
    // Clear form inputs and refresh dashboard catalog
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

// Add this function to your Dashboard component:
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to delete this project?')) {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.delete(`http://localhost:5000/api/projects/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Refresh the catalog
      fetchProjects(); 
    } catch (err) {
      alert('Failed to delete project');
    }
  }
};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111111', fontFamily: 'sans-serif' }}>
      {/* High-Contrast Minimalist Top Navigation */}
      <nav style={{ borderBottom: '1px solid #eeeeee', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontWeight: '700', letterSpacing: '1px' }}>ADMIN.PANEL</span>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['projects', 'messages', 'profile'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: 'none',
                border: 'none',
                textTransform: 'uppercase',
                fontSize: '0.8rem',
                letterSpacing: '1px',
                fontWeight: activeTab === tab ? '700' : '400',
                color: activeTab === tab ? '#000000' : '#888888',
                cursor: 'pointer',
                paddingBottom: '4px',
                borderBottom: activeTab === tab ? '2px solid #000000' : '2px solid transparent',
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Main Container */}
      <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '4rem' }}>
            
            {/* Left: Project Creation Form */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem', letterSpacing: '-0.5px' }}>Add Project</h2>
              {error && <p style={{ color: 'red', fontSize: '0.85rem', marginBottom: '1rem' }}>{error}</p>}
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <input
                  type="text"
                  name="title"
                  placeholder="Project Title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #cccccc', outline: 'none' }}
                />
                <textarea
                  name="description"
                  placeholder="Project Description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #cccccc', outline: 'none', minHeight: '80px', resize: 'vertical' }}
                />
                <input
                  type="text"
                  name="techStack"
                  placeholder="Tech Stack (comma separated: React, Node, Express)"
                  value={formData.techStack}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #cccccc', outline: 'none' }}
                />
                <input
                  type="url"
                  name="liveLink"
                  placeholder="Live URL"
                  value={formData.liveLink}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #cccccc', outline: 'none' }}
                />
                <input
                  type="url"
                  name="githubLink"
                  placeholder="GitHub URL"
                  value={formData.githubLink}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '0.75rem 0', border: 'none', borderBottom: '1px solid #cccccc', outline: 'none' }}
                />
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: '#666666', marginBottom: '0.5rem' }}>Project Image</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} required />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    border: 'none',
                    padding: '1rem',
                    cursor: 'pointer',
                    fontWeight: '600',
                    letterSpacing: '1px',
                    marginTop: '1rem',
                  }}
                >
                  {loading ? 'SAVING...' : 'SAVE PROJECT'}
                </button>
              </form>
            </div>

            {/* Right: Data Table Grid & Pagination */}
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '2rem', letterSpacing: '-0.5px' }}>Project Catalog</h2>
              
<div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', minHeight: '450px' }}>
  {currentRecords.length === 0 ? (
    <p style={{ color: '#888888', fontStyle: 'italic' }}>No projects found.</p>
  ) : (
    currentRecords.map((project) => (
      <div key={project._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #eeeeee' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.25rem 0' }}>{project.title}</h3>
          <p style={{ fontSize: '0.85rem', color: '#666666', margin: '0 0 0.5rem 0', maxWidth: '450px' }}>{project.description}</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {/* Ensure techStack is an array before mapping to avoid errors */}
            {Array.isArray(project.techStack) && project.techStack.map((tech, i) => (
              <span key={i} style={{ fontSize: '0.7rem', backgroundColor: '#f5f5f5', padding: '0.2rem 0.5rem', borderRadius: '2px' }}>{tech}</span>
            ))}
          </div>
        </div>
        
        {/* ADDED: Delete Button Container */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#888888' }}>
            {new Date(project.createdAt).toLocaleDateString()}
          </span>
          <button 
            onClick={() => handleDelete(project._id)} 
            style={{ 
              backgroundColor: '#fff', 
              color: '#ff4d4d', 
              border: '1px solid #ff4d4d', 
              padding: '0.4rem 0.8rem', 
              cursor: 'pointer', 
              fontSize: '0.7rem',
              fontWeight: 'bold'
            }}
          >
            DELETE
          </button>
        </div>
      </div>
    ))
  )}
</div>

              {/* Strict 5-Record Pagination Controls */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid #111111' }}>
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    style={{ background: 'none', border: 'none', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', fontWeight: '700', color: currentPage === 1 ? '#cccccc' : '#000000' }}
                  >
                    ← PREV
                  </button>
                  <span style={{ fontSize: '0.85rem', letterSpacing: '1px' }}>
                    PAGE {currentPage} OF {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    style={{ background: 'none', border: 'none', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', fontWeight: '700', color: currentPage === totalPages ? '#cccccc' : '#000000' }}
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'messages' && <div style={{ color: '#888888' }}>
            <section style={{ padding: '2rem' }}>
  <h3>Client Inquiries</h3>
  <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
    <thead>
      <tr style={{ background: '#f4f4f4' }}>
        <th style={tableHeaderStyle}>Name</th>
        <th style={tableHeaderStyle}>Email</th>
        <th style={tableHeaderStyle}>Subject</th>
        <th style={tableHeaderStyle}>Message</th>
        <th style={tableHeaderStyle}>Date</th>
      </tr>
    </thead>
    <tbody>
      {messages.map((msg) => (
        <tr key={msg._id} style={{ borderBottom: '1px solid #ddd' }}>
          <td style={tableCellStyle}>{msg.name}</td>
          <td style={tableCellStyle}>{msg.email}</td>
          <td style={tableCellStyle}>{msg.subject}</td>
          <td style={tableCellStyle}>{msg.message}</td>
          <td style={tableCellStyle}>{new Date(msg.createdAt).toLocaleDateString()}</td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
            </div>}


    
        {activeTab === 'profile' && <div style={{ color: '#888888' }}>Profile module placeholder...</div>}
        {activeTab === 'documents' && (
  <div>
    <h2>Manage Documents</h2>
    {/* Add a form here that sends data to /api/documents */}
    {/* Map through your documents array and render them */}
  </div>
)}
      </main>
    </div>
  );
};
const tableHeaderStyle = {
  padding: '12px',
  textAlign: 'left',
  borderBottom: '2px solid #ddd',
  fontSize: '0.8rem',
  textTransform: 'uppercase'
};

const tableCellStyle = {
  padding: '12px',
  fontSize: '0.9rem',
  color: '#444'
};

export default Dashboard;