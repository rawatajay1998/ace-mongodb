"use client";
import React from "react";

const BannerVideo = React.memo(() => {
  return (
    <div className="vide_container">
      <video
        className="absolute top-0 left-0 w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
      >
        {/* Full HD for screens >= 1920px */}
        <source
          src="https://res.cloudinary.com/dxdgzojw6/video/upload/f_auto,q_auto:eco,vc_auto,w_1920,h_1080/v1747917983/ace-elite-banner-video_nlthyz.mp4"
          type="video/mp4"
          media="(min-width: 1280px)"
        />
        {/* Mid-quality for desktop (1024px to 1919px) */}
        <source
          src="https://res.cloudinary.com/dxdgzojw6/video/upload/f_auto,q_auto:eco,vc_auto,w_1280,h_720/v1747917983/ace-elite-banner-video_nlthyz.mp4"
          type="video/mp4"
          media="(min-width: 768px) and (max-width: 1100px)"
        />
        {/* Lower-quality for mobile (<768px) */}
        <source
          src="https://res.cloudinary.com/dxdgzojw6/video/upload/f_auto,q_auto:eco,vc_auto,w_640,h_360/v1747917983/ace-elite-banner-video_nlthyz.mp4"
          type="video/mp4"
          media="(max-width: 767px)"
        />
        {/* Fallback for unsupported browsers */}
        Your browser does not support the video tag.
      </video>
    </div>
  );
});

BannerVideo.displayName = "BannerVideo";

export default BannerVideo;
