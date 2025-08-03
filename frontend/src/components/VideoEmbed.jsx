import React, { useState, useEffect } from 'react';

const VideoEmbed = ({ 
  instagramUrl, 
  youtubeUrl, 
  title = "Video Dokumenter",
  className = "" 
}) => {
  const [currentPlatform, setCurrentPlatform] = useState('instagram');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Extract Instagram post ID from URL
  const getInstagramPostId = (url) => {
    const match = url.match(/\/p\/([^\/]+)/) || url.match(/\/reel\/([^\/]+)/);
    return match ? match[1] : null;
  };

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const instagramPostId = getInstagramPostId(instagramUrl);
  const youtubeVideoId = getYouTubeVideoId(youtubeUrl);

  const handleIframeError = () => {
    setHasError(true);
    if (currentPlatform === 'instagram' && youtubeVideoId) {
      setCurrentPlatform('youtube');
    }
    setIsLoading(false);
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [currentPlatform]);

  const renderEmbed = () => {
    if (currentPlatform === 'instagram' && instagramPostId) {
      return (
        <iframe
          src={`https://www.instagram.com/p/${instagramPostId}/embed`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
        />
      );
    }

    if (currentPlatform === 'youtube' && youtubeVideoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
          onError={handleIframeError}
          onLoad={handleIframeLoad}
        />
      );
    }

    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">Video tidak tersedia</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`relative ${className}`}>
      {/* Platform Toggle Buttons - Dipindah ke bawah video */}
      <div className="flex justify-center gap-4 mb-4">
        {instagramPostId && (
          <button
            onClick={() => setCurrentPlatform('instagram')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPlatform === 'instagram'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Instagram
            </span>
          </button>
        )}
        {youtubeVideoId && (
          <button
            onClick={() => setCurrentPlatform('youtube')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              currentPlatform === 'youtube'
                ? 'bg-red-600 text-white shadow-lg'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              YouTube
            </span>
          </button>
        )}
      </div>

      {/* Video Container */}
      <div className="aspect-w-16 aspect-h-9 rounded-xl overflow-hidden shadow-lg relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        )}
        
        {renderEmbed()}
      </div>
    </div>
  );
};

export default VideoEmbed; 