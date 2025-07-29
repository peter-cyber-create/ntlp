'use client'

import React, { useRef, useEffect } from 'react'

interface VideoBackgroundProps {
  videoSrc?: string
  fallbackImage?: string
  children?: React.ReactNode
  className?: string
}

const VideoBackground: React.FC<VideoBackgroundProps> = ({
  videoSrc,
  fallbackImage = '/api/placeholder/1920/1080',
  children,
  className = ''
}) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current && videoSrc) {
      videoRef.current.play().catch(() => {
        // Auto-play failed, video will show as paused
        console.log('Auto-play prevented by browser')
      })
    }
  }, [videoSrc])

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Video Background */}
      {videoSrc ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackImage}
        >
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        /* Fallback Background Image */
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${fallbackImage})`
          }}
        />
      )}
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

export default VideoBackground
