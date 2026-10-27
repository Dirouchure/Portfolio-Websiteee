import React from 'react';
import { FaTrophy, FaAward, FaStar, FaFire, FaCode, FaRocket } from 'react-icons/fa';
import './AchievementBadges.css';

function AchievementBadges() {
  const achievements = [
    {
      icon: <FaTrophy />,
      title: 'Top Performer',
      description: '2.5+ Years Excellence',
      color: '#fbbf24'
    },
    {
      icon: <FaCode />,
      title: 'Code Master',
      description: '15+ Projects Completed',
      color: '#6366f1'
    },
    {
      icon: <FaStar />,
      title: 'Client Favorite',
      description: '100% Satisfaction Rate',
      color: '#f59e0b'
    },
    {
      icon: <FaFire />,
      title: 'Fast Delivery',
      description: 'Always On Time',
      color: '#ef4444'
    },
    {
      icon: <FaRocket />,
      title: 'Innovation Leader',
      description: 'Modern Tech Stack',
      color: '#8b5cf6'
    },
    {
      icon: <FaAward />,
      title: 'Quality Assured',
      description: 'Bug-Free Code',
      color: '#10b981'
    }
  ];

  return (
    <div className="achievement-badges-section">
      <h3 className="achievements-title">
        <FaTrophy /> Achievements & Recognition
      </h3>
      <div className="achievements-grid">
        {achievements.map((achievement, index) => (
          <div key={index} className="achievement-badge" style={{'--badge-color': achievement.color}}>
            <div className="badge-icon">{achievement.icon}</div>
            <div className="badge-content">
              <h4 className="badge-title">{achievement.title}</h4>
              <p className="badge-description">{achievement.description}</p>
            </div>
            <div className="badge-glow"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementBadges;
