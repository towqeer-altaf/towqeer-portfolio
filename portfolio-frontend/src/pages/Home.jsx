import React from 'react';
import { ThemeProvider, useTheme } from '../contexts/ThemeContext';
import HomeNavbar from '../components/HomeNavbar';
import HomeHeroSection from '../components/HomeHeroSection';
import HomeServicesSection from '../components/HomeServicesSection';
import HomeProjectsSection from '../components/HomeProjectsSection';
import HomeAchievementsSection from '../components/HomeAchievementsSection';
import HomeContactSection from '../components/HomeContactSection';
import './Home.css';

const HomeContent = () => {
  const { theme } = useTheme();

  return (
    <div className="home-page" data-theme={theme}>
      <HomeNavbar />
      <HomeHeroSection />
      <HomeServicesSection />
      <HomeProjectsSection />
      <HomeAchievementsSection />
      <HomeContactSection />
    </div>
  );
};

// ThemeProvider is scoped to this page for now. To make dark/light mode
// persist across your whole site, move <ThemeProvider> up to wrap <App />
// in App.jsx instead — everything else here stays the same.
const Home = () => (
  <ThemeProvider>
    <HomeContent />
  </ThemeProvider>
);

export default Home;
