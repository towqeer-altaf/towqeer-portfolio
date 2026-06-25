import React, { useState, useEffect } from 'react';
import ProjectSection from '../components/ProjectSection';
import DocumentSection from '../components/DocumentSection';
import MessageSection from '../components/MessageSection';
import ProfileSection from '../components/ProfileSection';
import './Dashboard.css';

const TABS = ['projects', 'messages', 'profile', 'documents'];

/**
 * Dashboard is now just an orchestrator: it owns which tab is active and
 * persists that choice to localStorage, then renders the matching section.
 *
 * Each section fetches its own data when it mounts. Since React only
 * mounts the active tab's component, switching tabs naturally fetches
 * fresh data exactly when needed — no shared "activeTab === X" effects,
 * no redundant project fetches, no manual fetch-orchestration required.
 */
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('activeTab') || 'projects');

  useEffect(() => {
    localStorage.setItem('activeTab', activeTab);
  }, [activeTab]);

  return (
    <div className="dashboard">
      <nav className="dashboard-nav">
        <span className="dashboard-brand">ADMIN.PANEL</span>
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
        </div>
      </nav>

      <main className="dashboard-main">
        {activeTab === 'projects' && <ProjectSection />}
        {activeTab === 'messages' && <MessageSection />}
        {activeTab === 'profile' && <ProfileSection />}
        {activeTab === 'documents' && <DocumentSection />}
      </main>
    </div>
  );
};

export default Dashboard;
