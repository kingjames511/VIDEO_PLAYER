import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Upload } from 'lucide-react';

interface VideoPlayerState {
  isVideoReady: boolean;
  isPlaying: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  isDragging: false;
}

const VideoPlayer: React.FC = () => {
  const [state, setState] = useState<VideoPlayerState>({
    isVideoReady: false,
    isPlaying: false,
    isMuted: false,
    currentTime: 0,
    duration: 0,
    isDragging: false,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const progressContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatTime = useCallback((seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, []);

  const seekToPercentage = useCallback((percentage: number) => {
    if (!videoRef.current || !state.isVideoReady) {
      console.warn('Cannot seek: video ref or video not ready');
      return;
    }
    
    const newTime = percentage * state.duration;
    videoRef.current.currentTime = newTime;
    setState(prev => ({ ...prev, currentTime: newTime }));
  }, [state.isVideoReady, state.duration]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log('File selected:', file?.name, file?.type);
    
    if (!file) {
      console.error('No file selected');
      return;
    }
    
    // Check if video ref exists before proceeding
    if (!videoRef.current) {
      console.error('Video ref not available');
      alert('Video player not ready. Please try again.');
      return;
    }
    
    const isVideoType = file.type.startsWith('video/') || 
                       /\.(mp4|webm|ogg|avi|mov|wmv|flv|mkv)$/i.test(file.name);
    
    if (!isVideoType) {
      alert('Please select a valid video file (MP4, WebM, OGG, etc.)');
      return;
    }
    
    try {
      // Clean up previous object URL to prevent memory leaks
      if (videoRef.current.src && videoRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(videoRef.current.src);
      }
      
      const url = URL.createObjectURL(file);
      console.log('Created object URL:', url);
      
      // Reset state first
      setState(prev => ({ 
        ...prev, 
        isVideoReady: false,
        isPlaying: false,
        currentTime: 0,
        duration: 0 
      }));
      
      // Set src and load
      videoRef.current.src = url;
      videoRef.current.load();
      
    } catch (error) {
      console.error('Error handling file upload:', error);
      alert('Error loading video file. Please try a different file.');
    }
  }, []);

  const handleVideoLoaded = useCallback(() => {
    if (!videoRef.current) {
      console.error('Video ref not available in handleVideoLoaded');
      return;
    }
    
    console.log('Video loaded, duration:', videoRef.current.duration);
    
    // Check if duration is valid
    if (isNaN(videoRef.current.duration) || videoRef.current.duration <= 0) {
      console.error('Invalid video duration:', videoRef.current.duration);
      setState(prev => ({ ...prev, isVideoReady: false }));
      alert('Error: Video file appears to be corrupted or invalid.');
      return;
    }
    
    setState(prev => ({
      ...prev,
      isVideoReady: true,
      duration: videoRef.current!.duration,
      currentTime: videoRef.current!.currentTime || 0,
    }));
  }, []);

  const handleTimeUpdate = useCallback(() => {
    if (!videoRef.current || state.isDragging) return;
    
    setState(prev => ({
      ...prev,
      currentTime: videoRef.current!.currentTime || 0,
    }));
  }, [state.isDragging]);

  const handleVideoEnded = useCallback(() => {
    setState(prev => ({ ...prev, isPlaying: false }));
  }, []);

  const handleVideoError = useCallback((e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Video error:', e);
    const video = e.currentTarget;
    let errorMessage = 'Unknown video error';
    
    if (video.error) {
      switch (video.error.code) {
        case video.error.MEDIA_ERR_ABORTED:
          errorMessage = 'Video loading was aborted';
          break;
        case video.error.MEDIA_ERR_NETWORK:
          errorMessage = 'Network error occurred while loading video';
          break;
        case video.error.MEDIA_ERR_DECODE:
          errorMessage = 'Video format not supported or corrupted';
          break;
        case video.error.MEDIA_ERR_SRC_NOT_SUPPORTED:
          errorMessage = 'Video format not supported';
          break;
      }
    }
    
    console.error('Video error details:', errorMessage);
    setState(prev => ({ ...prev, isVideoReady: false }));
    alert(`Video error: ${errorMessage}`);
  }, []);

  const handleProgressClick = useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    if (!progressContainerRef.current || !state.isVideoReady || !videoRef.current) return;
    
    const rect = progressContainerRef.current.getBoundingClientRect();
    if (rect.width === 0) return;
    const percentage = (event.clientX - rect.left) / rect.width;

    seekToPercentage(Math.max(0, Math.min(1, percentage)));
  }, [state.isVideoReady, seekToPercentage]);

  const handleDragStart = useCallback((event: React.MouseEvent) => {
    if (!state.isVideoReady || !videoRef.current) return;
    
    setState(prev => ({ ...prev, isDragging: true }));
    event.preventDefault();
  }, [state.isVideoReady]);

  const handleDragMove = useCallback((event: MouseEvent) => {
    if (!state.isDragging || !progressContainerRef.current) return;
    
    const rect = progressContainerRef.current.getBoundingClientRect();
    const percentage = (event.clientX - rect.left) / rect.width;
    const clampedPercentage = Math.max(0, Math.min(1, percentage));
    
    setState(prev => ({ 
      ...prev, 
      currentTime: clampedPercentage * prev.duration 
    }));
  }, [state.isDragging]);

  const handleDragEnd = useCallback(() => {
    if (!state.isDragging) return;
    
    const percentage = state.currentTime / state.duration;
    seekToPercentage(percentage);
    setState(prev => ({ ...prev, isDragging: false }));
  }, [state.isDragging, state.currentTime, state.duration, seekToPercentage]);

  const togglePlayPause = useCallback(async () => {
    if (!videoRef.current || !state.isVideoReady) {
      console.warn('Cannot play/pause: video ref invalid or not ready');
      return;
    }
    
    try {
      if (state.isPlaying) {
        videoRef.current.pause();
        setState(prev => ({ ...prev, isPlaying: false }));
      } else {
        await videoRef.current.play();
        setState(prev => ({ ...prev, isPlaying: true }));
      }
    } catch (error) {
      console.error('Error playing video:', error);
      if (error.name === 'NotAllowedError') {
        alert('Video autoplay was blocked. Please click play manually.');
      } else {
        alert('Error playing video. The video file may be corrupted.');
      }
    }
  }, [state.isVideoReady, state.isPlaying]);

  const toggleMute = useCallback(() => {
    if (!videoRef.current || !state.isVideoReady) {
      console.warn('Cannot mute/unmute: video ref invalid or not ready');
      return;
    }
    
    videoRef.current.muted = !state.isMuted;
    setState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  }, [state.isVideoReady, state.isMuted]);

  // Cleanup object URL on unmount
  useEffect(() => {
    return () => {
      if (videoRef.current?.src && videoRef.current.src.startsWith('blob:')) {
        URL.revokeObjectURL(videoRef.current.src);
      }
    };
  }, []);

  // Handle drag events
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => handleDragMove(event);
    const handleMouseUp = () => handleDragEnd();

    if (state.isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [state.isDragging, handleDragMove, handleDragEnd]);

  const progressPercentage = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-8 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">
        React Video Player with Synchronized Progress Bar
      </h1>
      
      {/* File Upload */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <label htmlFor="videoInput" className="block text-sm font-medium mb-2">
          Upload Video File
        </label>
        <div className="relative">
          <input
            ref={fileInputRef}
            id="videoInput"
            type="file"
            accept="video/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors"
          >
            <Upload className="w-6 h-6 mr-2" />
            Click to upload video file
          </button>
        </div>
      </div>

      {/* Video Player */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <video
          ref={videoRef}
          className={`w-full h-auto rounded-lg ${state.isVideoReady ? 'block' : 'hidden'}`}
          controls={false} // Disable default controls to avoid conflicts
          preload="metadata"
          onLoadedMetadata={handleVideoLoaded}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
          onPlay={() => setState(prev => ({ ...prev, isPlaying: true }))}
          onPause={() => setState(prev => ({ ...prev, isPlaying: false }))}
          onError={handleVideoError}
        />
        {!state.isVideoReady && (
          <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
            <p className="text-gray-400">Upload a video to get started</p>
          </div>
        )}
      </div>

      {/* Independent Progress Bar */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">Independent Progress Control</h3>
        
        {/* Time Display */}
        <div className="flex justify-between text-sm text-gray-300 mb-2">
          <span>{formatTime(state.currentTime)}</span>
          <span>{formatTime(state.duration)}</span>
        </div>
        
        {/* Custom Progress Bar */}
        <div className="relative mb-6">
          <div
            ref={progressContainerRef}
            onClick={handleProgressClick}
            className="w-full h-3 bg-gray-600 rounded-full cursor-pointer relative"
          >
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-150 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
            <div
              onMouseDown={handleDragStart}
              className={`absolute top-1/2 transform -translate-y-1/2 w-5 h-5 bg-white rounded-full shadow-lg cursor-grab active:cursor-grabbing transition-all duration-150 ${
                state.isDragging ? 'scale-125' : ''
              }`}
              style={{
                left: `${progressPercentage}%`,
                marginLeft: '-10px',
              }}
            />
          </div>
        </div>
        
        {/* Control Buttons */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={togglePlayPause}
            disabled={!state.isVideoReady}
            className="flex items-center bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {state.isPlaying ? (
              <>
                <Pause className="w-5 h-5 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Play
              </>
            )}
          </button>
          
          <button
            onClick={toggleMute}
            disabled={!state.isVideoReady}
            className="flex items-center bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            {state.isMuted ? (
              <>
                <VolumeX className="w-5 h-5 mr-2" />
                Unmute
              </>
            ) : (
              <>
                <Volume2 className="w-5 h-5 mr-2" />
                Mute
              </>
            )}
          </button>
        </div>
        
        {/* Status Indicator */}
        {state.isVideoReady && (
          <div className="mt-4 text-center text-sm text-gray-400">
            Video loaded • Duration: {formatTime(state.duration)} • 
            {state.isPlaying ? ' Playing' : ' Paused'}
            {state.isDragging && ' • Scrubbing'}
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;