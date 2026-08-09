import React, { useState, useEffect } from 'react';
import { FaPlay, FaEye, FaClock, FaStar } from 'react-icons/fa';
import api from '../config/api';
import './VideoReel.css';

function VideoReel() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await api.get('/video-reel');
      setVideos(response.data);
      if (response.data.length > 0) {
        const featured = response.data.find(v => v.is_featured) || response.data[0];
        setSelectedVideo(featured);
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching videos:', error);
      setLoading(false);
    }
  };

  const handleVideoClick = async (video) => {
    setSelectedVideo(video);
    try {
      await api.post(`/video-reel/${video.id}/view`);
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  const getVideoEmbed = (video) => {
    if (!video) return '';
    
    if (video.video_type === 'youtube') {
      const videoId = video.video_url.includes('youtube.com') 
        ? new URL(video.video_url).searchParams.get('v')
        : video.video_url;
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (video.video_type === 'vimeo') {
      const videoId = video.video_url.split('/').pop();
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return video.video_url;
  };

  const categories = ['All', ...new Set(videos.map(v => v.category).filter(Boolean))];
  const filteredVideos = selectedCategory === 'All' 
    ? videos 
    : videos.filter(v => v.category === selectedCategory);

  if (loading) {
    return (
      <div className="video-reel">
        <div className="container">
          <div className="loading">Loading video reel...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="video-reel">
      <div className="container">
        <h1 className="page-title">Video Reel</h1>
        <p className="page-subtitle">Showcase of my best video editing work</p>

        {selectedVideo && (
          <div className="featured-video-section">
            <div className="video-player">
              <iframe
                src={getVideoEmbed(selectedVideo)}
                title={selectedVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-info">
              <div className="video-header">
                <h2>{selectedVideo.title}</h2>
                {selectedVideo.is_featured && <span className="featured-badge"><FaStar /> Featured</span>}
              </div>
              {selectedVideo.description && <p className="video-description">{selectedVideo.description}</p>}
              <div className="video-meta">
                {selectedVideo.category && <span className="meta-item"><strong>Category:</strong> {selectedVideo.category}</span>}
                {selectedVideo.duration && <span className="meta-item"><FaClock /> {selectedVideo.duration}</span>}
                <span className="meta-item"><FaEye /> {selectedVideo.views} views</span>
              </div>
            </div>
          </div>
        )}

        {categories.length > 1 && (
          <div className="filter-section">
            <div className="category-filters">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="videos-grid">
          {filteredVideos.map((video) => (
            <div
              key={video.id}
              className={`video-card ${selectedVideo?.id === video.id ? 'active' : ''}`}
              onClick={() => handleVideoClick(video)}
            >
              <div className="video-thumbnail">
                <img
                  src={video.thumbnail || `https://img.youtube.com/vi/${video.video_url}/hqdefault.jpg`}
                  alt={video.title}
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/320x180?text=Video';
                  }}
                />
                <div className="play-overlay">
                  <FaPlay />
                </div>
                {video.is_featured && <span className="featured-label">Featured</span>}
              </div>
              <div className="video-card-content">
                <h3>{video.title}</h3>
                {video.category && <span className="category-badge">{video.category}</span>}
                <div className="video-stats">
                  {video.duration && <span><FaClock /> {video.duration}</span>}
                  <span><FaEye /> {video.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVideos.length === 0 && (
          <div className="no-data">
            <p>No videos found in this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default VideoReel;
