import React from 'react';

const CleanVideoEmbed = ({ 
  instagramUrl, 
  youtubeUrl, 
  videoFile = null,
  title = "Video Dokumenter",
  className = ""
}) => {
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

  const renderVideo = () => {
    // Prioritas: local video > YouTube > Instagram
    if (videoFile) {
      return (
        <video 
          controls 
          className="w-full h-full"
          poster="/images/video-thumbnail.jpg"
        >
          <source src={videoFile} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (youtubeVideoId) {
      return (
        <iframe
          src={`https://www.youtube.com/embed/${youtubeVideoId}?rel=0&modestbranding=1&showinfo=0&controls=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }

    if (instagramPostId) {
      return (
        <iframe
          src={`https://www.instagram.com/p/${instagramPostId}/embed`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      );
    }

    // Fallback jika tidak ada video yang tersedia
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100">
        <div className="text-center p-8">
          <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">Video tidak tersedia</p>
        </div>
      </div>
    );
  };

  return (
    <div className={`${className} aspect-w-16 aspect-h-9`}>
      {renderVideo()}
    </div>
  );
};

export default CleanVideoEmbed; 