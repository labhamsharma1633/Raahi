import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Sparkles, 
  Subtitles, 
  CheckCircle2, 
  Compass, 
  Users, 
  ShoppingBag, 
  Coffee, 
  Route,
  Info
} from 'lucide-react';
import { RAAHI_EXPLAINER_VIDEO_CONFIG } from '../../config/videoConfig';

export default function RaahiVideoPlayer({ config = RAAHI_EXPLAINER_VIDEO_CONFIG }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);

  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const animationIntervalRef = useRef(null);

  const duration = config.durationSeconds || 60;
  const chapters = config.chapters || [];

  // If a real video URL exists, use standard HTML5 video events
  const hasRealVideo = Boolean(config.videoUrl && config.videoUrl.trim() !== '');

  // Simulated playback timer for the interactive explainer walkthrough
  useEffect(() => {
    if (isPlaying && !hasRealVideo) {
      animationIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= duration) {
            setIsPlaying(false);
            return 0;
          }
          const next = prev + 1;
          // Determine chapter
          if (next >= 54) setActiveChapterIndex(5);
          else if (next >= 45) setActiveChapterIndex(4);
          else if (next >= 34) setActiveChapterIndex(3);
          else if (next >= 22) setActiveChapterIndex(2);
          else if (next >= 10) setActiveChapterIndex(1);
          else setActiveChapterIndex(0);
          return next;
        });
      }, 1000);
    } else {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    }
    return () => {
      if (animationIntervalRef.current) clearInterval(animationIntervalRef.current);
    };
  }, [isPlaying, hasRealVideo, duration]);

  const togglePlay = () => {
    setHasStarted(true);
    if (hasRealVideo && videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    if (hasRealVideo && videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    // Update active chapter
    if (newTime >= 54) setActiveChapterIndex(5);
    else if (newTime >= 45) setActiveChapterIndex(4);
    else if (newTime >= 34) setActiveChapterIndex(3);
    else if (newTime >= 22) setActiveChapterIndex(2);
    else if (newTime >= 10) setActiveChapterIndex(1);
    else setActiveChapterIndex(0);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const jumpToChapter = (idx) => {
    setHasStarted(true);
    setActiveChapterIndex(idx);
    const times = [0, 10, 22, 34, 45, 54];
    const target = times[idx] || 0;
    setCurrentTime(target);
    if (hasRealVideo && videoRef.current) {
      videoRef.current.currentTime = target;
    }
    setIsPlaying(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const chapterIcons = [Compass, Route, ShoppingBag, Users, Coffee, Sparkles];
  const CurrentIcon = chapterIcons[activeChapterIndex] || Sparkles;

  return (
    <div className="space-y-6">
      
      {/* 16:9 Video Frame */}
      <div 
        ref={containerRef}
        className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group select-none flex items-center justify-center"
      >
        {/* Real Video Element if configured */}
        {hasRealVideo ? (
          <video
            ref={videoRef}
            src={config.videoUrl}
            poster={config.posterImage}
            muted={isMuted}
            className="w-full h-full object-cover"
            onTimeUpdate={() => setCurrentTime(videoRef.current?.currentTime || 0)}
            onEnded={() => setIsPlaying(false)}
          />
        ) : (
          /* Interactive Built-in Explainer Animation Stage */
          <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-[#061E20] via-[#0D3B3E] to-[#041517] flex flex-col items-center justify-center p-6 text-white text-center">
            {/* Ambient Animated Particles / Glows */}
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

            {!hasStarted ? (
              /* Poster / Thumbnail State before Play */
              <div className="space-y-4 max-w-lg z-10 animate-fade-in">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform cursor-pointer group-hover:ring-8 ring-emerald-400/20" onClick={togglePlay}>
                  <Play className="w-7 h-7 sm:w-9 sm:h-9 translate-x-0.5" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-emerald-300 block mb-1">
                    Official Explainer Video • 60 Seconds
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-white">
                    {config.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-teal-100/80 mt-1 max-w-md mx-auto">
                    {config.subtitle}
                  </p>
                </div>
              </div>
            ) : (
              /* Active Explainer Scene Stage */
              <div className="max-w-xl z-10 space-y-4 animate-fade-in">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center mx-auto shadow-lg backdrop-blur-md">
                  <CurrentIcon className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] sm:text-xs uppercase font-black text-amber-300 tracking-wider">
                    Chapter {activeChapterIndex + 1} of 6 • {chapters[activeChapterIndex]?.time}
                  </span>
                  <h4 className="text-lg sm:text-2xl font-black text-white">
                    {chapters[activeChapterIndex]?.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-teal-100/90 leading-relaxed max-w-md mx-auto">
                    {chapters[activeChapterIndex]?.desc}
                  </p>
                </div>

                {/* Subtitle / Caption Bar */}
                {showCaptions && (
                  <div className="inline-block px-4 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-white/10 text-[11px] sm:text-xs font-medium text-emerald-200">
                    "{chapters[activeChapterIndex]?.desc}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Big Center Play/Pause Overlay Click Target */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 w-full h-full bg-transparent flex items-center justify-center cursor-pointer z-20 focus:outline-none"
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          {hasStarted && !isPlaying && (
            <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-md text-white flex items-center justify-center hover:scale-110 transition-transform border border-white/20">
              <Play className="w-7 h-7 translate-x-0.5" />
            </div>
          )}
        </button>

        {/* Video Player Controls Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent z-30 transition-opacity space-y-2 opacity-95 group-hover:opacity-100">
          
          {/* Progress Scrubber */}
          <input
            type="range"
            min="0"
            max={duration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:h-2 transition-all"
          />

          {/* Controls & Timestamps */}
          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <button 
                onClick={togglePlay} 
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 translate-x-0.5" />}
              </button>

              <button 
                onClick={() => setIsMuted(!isMuted)} 
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5" />}
              </button>

              <span className="font-mono text-[11px] text-slate-300">
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                  showCaptions 
                    ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' 
                    : 'bg-white/10 border-white/10 text-slate-400'
                }`}
                title="Toggle Captions"
              >
                <Subtitles className="w-3 h-3" />
                <span>CC</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
                title="Fullscreen"
              >
                <Maximize className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chapters & Story Breakdown Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              60-Second Video Topics & Chapters
            </h4>
            <p className="text-xs text-slate-500">
              Click any chapter below to jump directly to that part of the story.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
            6 Core Pillars
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {chapters.map((ch, idx) => {
            const isSelected = activeChapterIndex === idx;
            const Icon = chapterIcons[idx] || Sparkles;

            return (
              <button
                key={idx}
                onClick={() => jumpToChapter(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-start gap-3 group ${
                  isSelected 
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-300' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs transition-colors ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-white text-slate-600 border border-slate-200'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5 truncate flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      {ch.time}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-700">Playing</span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 truncate">
                    {ch.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {ch.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Configuration Notice */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2 text-[11px] text-slate-500">
          <Info className="w-4 h-4 text-slate-400 shrink-0" />
          <span>
            <strong>Asset Configuration:</strong> To attach your final production MP4 or WebM video file, set <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">videoUrl</code> in <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">src/config/videoConfig.js</code>.
          </span>
        </div>
      </div>

    </div>
  );
}
