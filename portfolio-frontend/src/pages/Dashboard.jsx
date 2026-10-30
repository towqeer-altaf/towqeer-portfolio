import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProjectSection from '../components/ProjectSection';
import CertificateSection from '../components/CertificateSection';
import DocumentSection from '../components/DocumentSection';
import MessageSection from '../components/MessageSection';
import ProfileSection from '../components/ProfileSection';
import './Dashboard.css';

const TABS = ['projects', 'certificates', 'profile', 'messages', 'documents'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(() => {
    const savedTab = localStorage.getItem('activeTab');
    return TABS.includes(savedTab) ? savedTab : 'projects';
  });

  useEffect(() => {
    if (!localStorage.getItem('adminToken')) navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <Link className="dashboard-brand" to="/">ADMIN.PANEL <span>· View portfolio</span></Link>
        <div className="dashboard-tabs">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`dashboard-tab ${activeTab === tab ? 'active' : ''}`}
            >
              {tab}
            </button>
          ))}
          <button
            type="button"
            className="dashboard-tab dashboard-logout"
            onClick={() => {
              localStorage.removeItem('adminToken');
              navigate('/login', { replace: true });
            }}
          >
            log out
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'projects' && <ProjectSection />}
        {activeTab === 'certificates' && <CertificateSection />}
        {activeTab === 'messages' && <MessageSection />}
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'documents' && <DocumentSection />}
      </main>
    </div>
  );
};

export default Dashboard;
