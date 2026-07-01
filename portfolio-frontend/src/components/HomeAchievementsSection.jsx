import React from 'react';

const achievements = [
  {
    code: '// MERN-2026',
    title: 'Advanced full-stack engineering',
    description: 'Mastery certification covering decoupled architectures, asynchronous state management, and storage design.',
    issuer: 'Academy / Self-directed ledger',
  },
  {
    code: '// milestone',
    title: 'Production deployment milestone',
    description: 'Built and shipped a secure admin engine with automated file storage and dynamic schema mappings.',
    issuer: 'Completed system architecture',
  },
];

const HomeAchievementsSection = () => {
  return (
    <section className="section section--alt">
      <div className="section-inner">
        <p className="eyebrow">// milestones</p>
        <h2 className="section-title">Achievements & certificates</h2>
        <div className="achievements-grid">
          {achievements.map((item) => (
            <div className="achievement-card" key={item.title}>
              <span className="achievement-code">{item.code}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="achievement-issuer">{item.issuer}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeAchievementsSection;
