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
        poster="/assets/images/about-one.jpg"
      >
        {/* Mid-quality for desktop (1024px to 1919px) */}
        <source
          src="https://res.cloudinary.com/dxdgzojw6/video/upload/f_auto,q_auto:eco,vc_auto/v1747917983/ace-elite-banner-video_nlthyz.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
});

BannerVideo.displayName = "BannerVideo";

export default BannerVideo;
