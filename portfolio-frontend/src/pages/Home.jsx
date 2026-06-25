import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import profileImg from '../assets/profilePic.jpeg'; 

const Home = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactData, setContactData] = useState({ name: '', email: '', subject: '', message: '' });

// In Home.jsx
const handleSendMessage = async (e) => {
  e.preventDefault();
  try {
    // Ensure the keys here ('name', 'email', 'subject', 'message') 
    // exactly match the ones in your controller
    await axios.post('http://localhost:5000/api/contact', contactData);
    alert('Message sent successfully!');
    setContactData({ name: '', email: '', subject: '', message: '' });
  } catch (err) {
    console.error(err);
  }
};

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
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111111', fontFamily: 'sans-serif', position: 'relative' }}>
      
      {/* Subtle link to your real working Login screen */}
      <div style={{ position: 'absolute', top: '20px', right: '20px', zIndex: 10 }}>
        <Link to="/login" style={{ textDecoration: 'none', color: '#888888', fontSize: '0.85rem' }}>
          🔒 Admin Portal
        </Link>
      </div>

      {/* SECTION 1: HERO / ABOUT ME */}
      <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6rem 2rem', maxWidth: '1100px', margin: '0 auto', flexWrap: 'wrap-reverse', gap: '2rem' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 1rem 0', letterSpacing: '-1px', lineHeight: '1.1' }}>Hi, I'm Towqeer.</h1>
          <p style={{ fontSize: '1.25rem', color: '#555555', lineHeight: '1.6', maxWidth: '540px', margin: '0 0 2rem 0' }}>
            A passionate Full-Stack Developer specializing in crafting modern web ecosystems, seamless user interfaces, and robust backend architectures.
          </p>
          <a href="#contact" style={{ display: 'inline-block', backgroundColor: '#000000', color: '#ffffff', textDecoration: 'none', padding: '1rem 2rem', fontWeight: '600', letterSpacing: '1px', fontSize: '0.9rem', textTransform: 'uppercase' }}>Let's Collaborate</a>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: '1', minWidth: '300px' }}>
          <div style={{ width: '280px', height: '280px', borderRadius: '50%', overflow: 'hidden', border: '4px solid #111111', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <img src={profileImg} alt="Towqeer Portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        </div>
      </section>

      {/* SECTION 2: WHAT I DO (SERVICES) */}
      <section style={{ backgroundColor: '#fafafa', padding: '5rem 2rem', borderTop: '1px solid #eeeeee', borderBottom: '1px solid #eeeeee' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Capabilities</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 3rem 0', letterSpacing: '-0.5px' }}>What Work I Do</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2.5rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>💻</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Web Development</h3>
              <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: '1.5', margin: '0' }}>Building fast, responsive MERN-stack web applications with scalable database models and optimized performance profiles.</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🚀</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Freelancing</h3>
              <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: '1.5', margin: '0' }}>Delivering complete, production-ready systems independently for clients worldwide while adhering strictly to fast turnarounds and clean architecture patterns.</p>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', border: '1px solid #e0e0e0' }}>
              <div style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>🎨</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0 0 1rem 0' }}>Creative Editing</h3>
              <p style={{ fontSize: '0.95rem', color: '#666666', lineHeight: '1.5', margin: '0' }}>Refining high-fidelity visual assets, cinematic styling layers, and digital content aesthetics to complement clean branding configurations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: LIVE PROJECTS SHOWCASE */}
      <section style={{ padding: '6rem 2rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>Portfolio</p>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 3rem 0', letterSpacing: '-0.5px' }}>Selected Projects</h2>

          {loading ? (
            <p style={{ color: '#666666' }}>Loading engineering ledger...</p>
          ) : projects.length === 0 ? (
            <p style={{ color: '#666666' }}>No items deployed yet.</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem' }}>
              {projects.map((project) => (
                <div key={project._id} style={{ display: 'flex', flexDirection: 'column', border: '1px solid #eeeeee', backgroundColor: '#ffffff' }}>
                  <div style={{ width: '100%', height: '220px', backgroundColor: '#f0f0f0', overflow: 'hidden', borderBottom: '1px solid #eeeeee' }}>
                    <img 
                      src={`http://localhost:5000/uploads/${project.imageUrl?.split('/').pop()}`}
                      alt={project.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/400x220?text=No+Image+Found'; }}
                    />
                  </div>
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: '1' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '700', margin: '0 0 0.5rem 0' }}>{project.title}</h3>
                    <p style={{ fontSize: '0.9rem', color: '#555555', lineHeight: '1.5', margin: '0 0 1.5rem 0', flex: '1' }}>{project.description}</p>
                    <div style={{ display: 'flex', gap: '1rem', marginTop: 'auto' }}>
                      {project.liveLink && <a href={project.liveLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#000000', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase' }}>Live Demo →</a>}
                      {project.githubLink && <a href={project.githubLink} target="_blank" rel="noreferrer" style={{ textDecoration: 'none', color: '#666666', fontWeight: '600', fontSize: '0.85rem', textTransform: 'uppercase' }}>GitHub</a>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* SECTION 4: ACHIEVEMENTS & CERTIFICATES */}
      <section style={{ backgroundColor: '#fafafa', padding: '6rem 2rem', borderTop: '1px solid #eeeeee' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: '#888888', textTransform: 'uppercase', margin: '0 0 0.5rem 0' }}>
            Milestones
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', margin: '0 0 3rem 0', letterSpacing: '-0.5px' }}>
            Achievements & Certificates
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            
            {/* Certificate 1 */}
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: '600', textTransform: 'uppercase' }}>Verification Code: MERN-2026</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0.5rem 0' }}>Advanced Full-Stack Engineering</h3>
              <p style={{ fontSize: '0.9rem', color: '#666666', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                Mastery certification over decoupled system architectures, asynchronous state management pipelines, and dynamic disk-storage solutions.
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111111' }}>Issued by Academy / Self-Directed Ledger</div>
            </div>

            {/* Certificate 2 */}
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', border: '1px solid #e0e0e0', borderRadius: '4px' }}>
              <span style={{ fontSize: '0.75rem', color: '#888888', fontWeight: '600', textTransform: 'uppercase' }}>Milestone</span>
              <h3 style={{ fontSize: '1.2rem', fontWeight: '700', margin: '0.5rem 0' }}>Production Deployment Milestone</h3>
              <p style={{ fontSize: '0.9rem', color: '#666666', margin: '0 0 1.5rem 0', lineHeight: '1.5' }}>
                Successfully built and integrated a secure administration engine with automated local file system storage capability and dynamic schema mappings.
              </p>
              <div style={{ fontSize: '0.85rem', fontWeight: '700', color: '#111111' }}>Completed System Architecture</div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 5: CONTACT GATEWAY */}
      <section id="contact" style={{ padding: '6rem 2rem', backgroundColor: '#ffffff' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: '700', letterSpacing: '2px', color: '#888888', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 0.5rem 0' }}>
            Get in touch
          </p>
          <h2 style={{ fontSize: '2rem', fontWeight: '700', textAlign: 'center', margin: '0 0 3rem 0', letterSpacing: '-0.5px' }}>
            Let's Collaborate
          </h2>

        <form onSubmit={handleSendMessage} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <input 
            type="text" placeholder="Name" required 
            value={contactData.name} 
            onChange={(e) => setContactData({...contactData, name: e.target.value})}
            style={{ padding: '1rem', border: '1px solid #eeeeee' }} 
            />
            <input 
            type="email" placeholder="Email" required 
            value={contactData.email} 
            onChange={(e) => setContactData({...contactData, email: e.target.value})}
            style={{ padding: '1rem', border: '1px solid #eeeeee' }} 
            />
        </div>
        <input 
            type="text" placeholder="Subject" required 
            value={contactData.subject} 
            onChange={(e) => setContactData({...contactData, subject: e.target.value})}
            style={{ padding: '1rem', border: '1px solid #eeeeee' }} 
        />
        <textarea 
            placeholder="Your Message" required 
            value={contactData.message} 
            onChange={(e) => setContactData({...contactData, message: e.target.value})}
            style={{ padding: '1rem', border: '1px solid #eeeeee', height: '150px' }}
        ></textarea>
        <button type="submit" style={{ padding: '1rem', backgroundColor: '#000000', color: '#ffffff', border: 'none', fontWeight: 'bold', cursor: 'pointer', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Send Message
        </button>
        </form>
        </div>
      </section>

    </div>
  );
};

export default Home;