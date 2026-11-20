import React from 'react';

export default function RaahiVideoPlayer({
  videoSrc = "/videos/raahi_explainer.mp4",
  poster = "/images/explainer_poster.jpg"
}) {
  return (
    <div className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl relative flex items-center justify-center">
      <video
        className="w-full h-full object-cover"
        controls
        playsInline
        preload="metadata"
        poster={poster}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
