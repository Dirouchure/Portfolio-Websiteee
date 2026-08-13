import React from 'react';
import './LoadingSkeleton.css';

export function ProfileSkeleton() {
  return (
    <div className="skeleton-profile">
      <div className="skeleton-content">
        <div className="skeleton-line skeleton-line-sm" />
        <div className="skeleton-line skeleton-line-lg" />
        <div className="skeleton-line skeleton-line-md" />
        <div className="skeleton-line skeleton-line-full" />
        <div className="skeleton-line skeleton-line-full" />
        <div className="skeleton-buttons">
          <div className="skeleton-btn" />
          <div className="skeleton-btn" />
        </div>
      </div>
      <div className="skeleton-avatar" />
    </div>
  );
}

export default ProfileSkeleton;
