import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw, 
  Subtitles, 
  Coffee, 
  ShoppingBag, 
  Users, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Home, 
  Building2,
  MapPin,
  ChevronRight
} from 'lucide-react';

const STORY_SCENES = [
  {
    id: 'pg_group_shopping',
    name: 'Scene 1: PG Life — Group Shopping',
    tagline: 'Hostel Room • 7:30 PM',
    bgGradient: 'from-[#072426] via-[#0E3D42] to-[#08282A]',
    duration: 22,
    lines: [
      {
        speaker: 'Karan',
        role: 'Roommate 1 (Room 102)',
        avatar: 'K',
        avatarBg: 'bg-emerald-500 text-white',
        dialogue: 'Yaar, mujhe Blinkit se kuch groceries order karni hain, but mera cart minimum order value tak nahi pahunch raha.',
        subtitle: 'Dude, I need to order groceries, but my cart doesn’t reach the minimum order value.',
        voiceType: 'male_1',
        timeStart: 0,
        timeEnd: 5,
        visualAction: 'Karan is staring at his phone showing a ₹65 cart total and a "Add ₹85 more for free delivery" warning.'
      },
      {
        speaker: 'Priya',
        role: 'Friend (Room 204)',
        avatar: 'P',
        avatarBg: 'bg-purple-500 text-white',
        dialogue: 'Arre, mereko bhi kuch items mangwane hain!',
        subtitle: 'Oh, I also need to get a few items!',
        voiceType: 'female',
        timeStart: 5,
        timeEnd: 8,
        visualAction: 'Priya enters with her notebook, waving her shopping list for eggs and bread.'
      },
      {
        speaker: 'Aman',
        role: 'Roommate 2 (Room 301)',
        avatar: 'A',
        avatarBg: 'bg-blue-500 text-white',
        dialogue: 'Toh alag-alag order kyun? Agar hum sab apne items ek saath add kar dein toh?',
        subtitle: 'Why order separately? What if we add all our items together?',
        voiceType: 'male_2',
        timeStart: 8,
        timeEnd: 12,
        visualAction: 'Aman opens Raahi Circles: "Green Park PG #4" and taps "+ Group Shopping Session".'
      },
      {
        speaker: 'Karan',
        role: 'Karan',
        avatar: 'K',
        avatarBg: 'bg-emerald-500 text-white',
        dialogue: 'Arey wah! Ab minimum order bhi complete ho gaya aur sabka samaan ek hi order mein aa jayega!',
        subtitle: 'Awesome! Now the minimum order is complete, and everyone’s stuff comes in one single delivery!',
        voiceType: 'male_1',
        timeStart: 12,
        timeEnd: 17,
        visualAction: 'Basket total jumps: ₹65 + ₹55 + ₹65 = ₹185! Green checkmark: Free Delivery Unlocked!'
      },
      {
        speaker: 'Narrator',
        role: 'Raahi Storyteller',
        avatar: 'R',
        avatarBg: 'bg-amber-500 text-slate-950 font-black',
        dialogue: 'With Raahi Group Shopping, people in the same PG, hostel or community can combine their shopping baskets and coordinate one order.',
        subtitle: 'With Raahi Group Shopping, people in the same PG, hostel or community can combine their shopping baskets and coordinate one order.',
        voiceType: 'narrator',
        timeStart: 17,
        timeEnd: 22,
        visualAction: 'Raahi Circles: Transparent shared cart with individual split breakdowns.'
      }
    ]
  },
  {
    id: 'office_quick_errands',
    name: 'Scene 2: Office Life — Quick Errands',
    tagline: 'Tech Park Floor 4 • 3:45 PM',
    bgGradient: 'from-[#0A1F38] via-[#0F3559] to-[#0A1F38]',
    duration: 20,
    lines: [
      {
        speaker: 'Rohan',
        role: 'Employee (Desk 412)',
        avatar: 'R',
        avatarBg: 'bg-cyan-500 text-white',
        dialogue: 'Yaar, coffee peene ka mann hai, but abhi bahar jaane ka time nahi hai.',
        subtitle: 'Man, I really want a cold coffee, but I don’t have time to go downstairs right now.',
        voiceType: 'male_1',
        timeStart: 22,
        timeEnd: 26,
        visualAction: 'Rohan is typing on his laptop, looking fatigued between meetings.'
      },
      {
        speaker: 'Vikram',
        role: 'Colleague (Desk 408)',
        avatar: 'V',
        avatarBg: 'bg-indigo-500 text-white',
        dialogue: 'Main break pe ja raha hoon. Kuch chahiye?',
        subtitle: 'I’m heading out for a quick break. Need anything?',
        voiceType: 'male_2',
        timeStart: 26,
        timeEnd: 29,
        visualAction: 'Vikram puts on his lanyard, walking toward the cafeteria elevator.'
      },
      {
        speaker: 'Rohan',
        role: 'Rohan',
        avatar: 'R',
        avatarBg: 'bg-cyan-500 text-white',
        dialogue: 'Ek coffee le aana please!',
        subtitle: 'Grab me a cold coffee please!',
        voiceType: 'male_1',
        timeStart: 29,
        timeEnd: 32,
        visualAction: 'Rohan posts a Quick Errand on Raahi: 2 Hazelnut Coffees (₹140 + ₹25 Tip).'
      },
      {
        speaker: 'Rohan',
        role: 'Rohan',
        avatar: 'R',
        avatarBg: 'bg-cyan-500 text-white',
        dialogue: 'Thanks, bro! Tune toh kaam easy kar diya.',
        subtitle: 'Thanks, bro! You made my workday so much easier.',
        voiceType: 'male_1',
        timeStart: 32,
        timeEnd: 36,
        visualAction: 'Vikram returns with fresh iced cups. Rohan gives 4-digit code (7492) to verify handover.'
      },
      {
        speaker: 'Narrator',
        role: 'Raahi Storyteller',
        avatar: 'R',
        avatarBg: 'bg-amber-500 text-slate-950 font-black',
        dialogue: 'With Raahi Quick Errands, people can help others in their Circle with small everyday purchases and pickups. Helpers can also earn optional rewards.',
        subtitle: 'With Raahi Quick Errands, people can help others in their Circle with small everyday purchases and pickups. Helpers can also earn optional rewards.',
        voiceType: 'narrator',
        timeStart: 36,
        timeEnd: 42,
        visualAction: 'One small favour. One happier workday.'
      }
    ]
  },
  {
    id: 'bigger_vision',
    name: 'Scene 3: The Bigger Raahi Vision',
    tagline: 'Connecting India • City to Campus',
    bgGradient: 'from-[#072426] via-[#103D3B] to-[#041517]',
    duration: 18,
    lines: [
      {
        speaker: 'Voiceover',
        role: 'The Raahi Vision',
        avatar: 'R',
        avatarBg: 'bg-emerald-400 text-slate-950 font-black',
        dialogue: 'What if your everyday journey could help someone else? What if the people around you could make everyday life easier?',
        subtitle: 'What if your everyday journey could help someone else? What if the people around you could make everyday life easier?',
        voiceType: 'narrator',
        timeStart: 42,
        timeEnd: 48,
        visualAction: 'Cinematic montage: A commuter boarding the metro, carrying a package with minimal detour.'
      },
      {
        speaker: 'Voiceover',
        role: 'The Raahi Vision',
        avatar: 'R',
        avatarBg: 'bg-emerald-400 text-slate-950 font-black',
        dialogue: 'That’s the idea behind Raahi. From earning while travelling to helping your own community, Raahi connects people through journeys, deliveries and everyday convenience.',
        subtitle: 'That’s the idea behind Raahi. From earning while travelling to helping your own community, Raahi connects people through journeys, deliveries and everyday convenience.',
        voiceType: 'narrator',
        timeStart: 48,
        timeEnd: 60,
        visualAction: 'College students sharing notes on campus, neighbours pooling groceries in apartment towers.'
      }
    ]
  },
  {
    id: 'brand_ending',
    name: 'Scene 4: Brand Finale',
    tagline: 'Raahi India',
    bgGradient: 'from-[#031416] via-[#072426] to-[#020B0C]',
    duration: 10,
    lines: [
      {
        speaker: 'Voiceover',
        role: 'Raahi Voice',
        avatar: 'R',
        avatarBg: 'bg-amber-400 text-slate-950 font-black',
        dialogue: 'Raahi — Earn on the way. Help around the way.',
        subtitle: 'Raahi — Earn on the way. Help around the way.',
        voiceType: 'narrator',
        timeStart: 60,
        timeEnd: 70,
        visualAction: 'Cinematic glowing Raahi emblem: Everyday needs. Community-powered.'
      }
    ]
  }
];

export default function RaahiVideoPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);

  const containerRef = useRef(null);
  const timerRef = useRef(null);
  const lastSpokenLineIndex = useRef(-1);

  const totalDuration = 70; // seconds

  // Flatten all lines across scenes for easy timeline resolution
  const allLines = STORY_SCENES.flatMap((scene) => 
    scene.lines.map(line => ({ ...line, sceneId: scene.id, sceneName: scene.name }))
  );

  // Current active scene and line based on currentTime
  const currentScene = STORY_SCENES.find((scene, idx) => {
    const nextScene = STORY_SCENES[idx + 1];
    if (!nextScene) return true;
    return currentTime < nextScene.lines[0].timeStart;
  }) || STORY_SCENES[0];

  const currentLineIndex = allLines.findIndex(
    l => currentTime >= l.timeStart && currentTime < l.timeEnd
  );
  const currentLine = allLines[currentLineIndex] || allLines[allLines.length - 1];

  // Web Speech Synthesis Voice Speaker
  const speakLine = (line) => {
    if (isMuted || typeof window === 'undefined' || !window.speechSynthesis) return;

    try {
      window.speechSynthesis.cancel(); // cancel previous utterance
      const utterance = new SpeechSynthesisUtterance(line.dialogue);

      // Voice modulation based on character type
      if (line.voiceType === 'female') {
        utterance.pitch = 1.3;
        utterance.rate = 1.05;
      } else if (line.voiceType === 'male_1') {
        utterance.pitch = 1.1;
        utterance.rate = 1.05;
      } else if (line.voiceType === 'male_2') {
        utterance.pitch = 0.95;
        utterance.rate = 1.0;
      } else {
        // Narrator
        utterance.pitch = 1.0;
        utterance.rate = 0.95;
      }

      // Prefer Indian English voice if available
      const voices = window.speechSynthesis.getVoices();
      const indianVoice = voices.find(v => v.lang.includes('en-IN') || v.lang.includes('hi-IN'));
      if (indianVoice) utterance.voice = indianVoice;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      // SpeechSynthesis gracefully ignored if not allowed
    }
  };

  // Synchronized playback loop
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= totalDuration) {
            setIsPlaying(false);
            if (typeof window !== 'undefined' && window.speechSynthesis) {
              window.speechSynthesis.cancel();
            }
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

  // Trigger speech when active line changes
  useEffect(() => {
    if (isPlaying && currentLineIndex !== -1 && currentLineIndex !== lastSpokenLineIndex.current) {
      lastSpokenLineIndex.current = currentLineIndex;
      speakLine(currentLine);
    }
  }, [currentLineIndex, isPlaying]);

  const togglePlay = () => {
    setHasStarted(true);
    const nextState = !isPlaying;
    setIsPlaying(nextState);
    if (!nextState && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const handleSeek = (e) => {
    const newTime = Number(e.target.value);
    setCurrentTime(newTime);
    lastSpokenLineIndex.current = -1;
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (nextMuted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const jumpToScene = (sceneIndex) => {
    setHasStarted(true);
    const targetScene = STORY_SCENES[sceneIndex];
    if (targetScene) {
      const targetTime = targetScene.lines[0].timeStart;
      setCurrentTime(targetTime);
      lastSpokenLineIndex.current = -1;
      setIsPlaying(true);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6">
      
      {/* 16:9 Cinematic Video Player Frame */}
      <div 
        ref={containerRef}
        className={`relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl select-none flex flex-col justify-between p-4 sm:p-7 bg-gradient-to-br ${currentScene.bgGradient} transition-colors duration-700`}
      >
        {/* Ambient background glows */}
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-teal-400/10 blur-3xl pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-80 h-80 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        {/* Top Video Header */}
        <div className="relative z-10 flex items-center justify-between text-xs text-teal-200/90">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-extrabold uppercase tracking-widest text-[11px] text-emerald-300">
              {currentScene.name}
            </span>
          </div>
          <span className="text-[11px] font-semibold text-slate-300 bg-black/40 px-3 py-1 rounded-full border border-white/10 backdrop-blur-md">
            {currentScene.tagline}
          </span>
        </div>

        {/* Center Stage: Character Interaction & Dialogue */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center my-2 text-center max-w-2xl mx-auto">
          
          {!hasStarted ? (
            /* Poster & Story Introduction Thumbnail */
            <div className="space-y-4 animate-fade-in cursor-pointer" onClick={togglePlay}>
              {/* Illustrated Character Group Thumbnail Badge */}
              <div className="flex items-center justify-center -space-x-3 mb-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center ring-4 ring-slate-950 shadow-lg text-sm">
                  K
                </div>
                <div className="w-12 h-12 rounded-full bg-purple-500 text-white font-bold flex items-center justify-center ring-4 ring-slate-950 shadow-lg text-sm">
                  P
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500 text-white font-bold flex items-center justify-center ring-4 ring-slate-950 shadow-lg text-sm">
                  A
                </div>
              </div>

              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-emerald-400 to-teal-400 text-slate-950 flex items-center justify-center mx-auto shadow-2xl hover:scale-110 transition-transform">
                <Play className="w-7 h-7 sm:w-9 sm:h-9 translate-x-0.5" />
              </div>

              <div>
                <span className="text-xs uppercase font-black text-amber-300 tracking-wider block">
                  Cinematic Mini-Story • 4 Scenes
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  How Karan, Priya & Aman Discovered Raahi
                </h3>
                <p className="text-xs sm:text-sm text-teal-100/80 max-w-md mx-auto mt-1">
                  Watch three friends solve real grocery thresholds and office coffee cravings together.
                </p>
              </div>
            </div>
          ) : (
            /* Active Character Dialogue Stage */
            <div className="space-y-4 animate-fade-in w-full">
              
              {/* Scene 4: Brand Finale Layout */}
              {currentScene.id === 'brand_ending' ? (
                <div className="space-y-4 text-center animate-fade-in">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-400 to-teal-300 flex items-center justify-center text-slate-950 font-black text-3xl mx-auto shadow-2xl ring-4 ring-teal-400/30">
                    R
                  </div>
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                      RAAHI
                    </h2>
                    <p className="text-sm sm:text-base font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-200 via-teal-200 to-amber-200 mt-1">
                      Everyday needs. Community-powered.
                    </p>
                  </div>
                  <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-xs font-semibold text-teal-200 border border-white/10">
                    Earn on the way. Help around the way.
                  </div>
                </div>
              ) : (
                /* Character Speaking Stage */
                <div className="space-y-3.5">
                  {/* Speaker Identifier Badge */}
                  <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/15 shadow-sm">
                    <div className={`w-6 h-6 rounded-lg ${currentLine.avatarBg} flex items-center justify-center text-xs font-extrabold`}>
                      {currentLine.avatar}
                    </div>
                    <span className="text-xs font-bold text-white">
                      {currentLine.speaker}
                    </span>
                    <span className="text-[10px] text-teal-300 font-medium">
                      ({currentLine.role})
                    </span>
                  </div>

                  {/* Character Conversational Speech Balloon */}
                  <div className="p-4 sm:p-5 rounded-3xl bg-slate-900/80 backdrop-blur-md border border-teal-500/30 shadow-2xl max-w-xl mx-auto space-y-2">
                    <p className="text-base sm:text-xl font-bold text-white leading-relaxed">
                      "{currentLine.dialogue}"
                    </p>
                    
                    {/* Visual Stage Direction / Context Action */}
                    <div className="pt-2 border-t border-white/10 flex items-center justify-center gap-2 text-[11px] text-teal-300/90 font-medium">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{currentLine.visualAction}</span>
                    </div>
                  </div>

                  {/* English Accessibility Subtitle */}
                  {showCaptions && currentLine.subtitle && (
                    <div className="inline-block px-4 py-1 bg-black/70 backdrop-blur-md rounded-xl text-[11px] sm:text-xs text-emerald-200 font-medium border border-white/10">
                      Subtitle: {currentLine.subtitle}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

        {/* Bottom Controls Bar */}
        <div className="relative z-10 bg-black/70 backdrop-blur-md rounded-2xl p-2.5 sm:p-3 border border-white/10 space-y-2">
          
          {/* Progress Timeline Scrubber */}
          <input
            type="range"
            min="0"
            max={totalDuration}
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:h-2 transition-all"
          />

          <div className="flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={togglePlay} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 translate-x-0.5" />}
              </button>

              <button 
                onClick={toggleMute} 
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                title={isMuted ? 'Unmute Character Voices' : 'Mute Voices'}
              >
                {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-300" />}
              </button>

              <span className="font-mono text-[11px] text-slate-300">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold border transition-colors flex items-center gap-1 ${
                  showCaptions 
                    ? 'bg-emerald-400/20 border-emerald-400 text-emerald-300' 
                    : 'bg-white/10 border-white/10 text-slate-400'
                }`}
                title="Toggle English Subtitles"
              >
                <Subtitles className="w-3 h-3" />
                <span>CC</span>
              </button>

              <button
                onClick={toggleFullscreen}
                className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors text-white"
                title="Fullscreen"
              >
                <Maximize className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 4 Interactive Story Scenes Selector */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider">
              Scenes & Story Outline
            </h4>
            <p className="text-xs text-slate-500">
              Click any scene below to jump directly into the character conversation.
            </p>
          </div>
          <span className="text-xs font-bold text-teal-800 bg-teal-50 px-3 py-1 rounded-xl border border-teal-200">
            4 Story Scenes
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {STORY_SCENES.map((scene, idx) => {
            const isSelected = currentScene.id === scene.id;

            return (
              <button
                key={scene.id}
                onClick={() => jumpToScene(idx)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-2 group ${
                  isSelected 
                    ? 'bg-emerald-50 border-emerald-300 shadow-sm ring-1 ring-emerald-300' 
                    : 'bg-slate-50/70 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                      Scene {idx + 1}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Playing
                      </span>
                    )}
                  </div>
                  <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">
                    {scene.name.split(':')[1]?.trim() || scene.name}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                    {scene.tagline}
                  </p>
                </div>

                <div className="text-[10px] font-semibold text-teal-700 flex items-center gap-1">
                  <span>Watch Scene</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}
