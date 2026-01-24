import { useRef, useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/video-player.css"
import {
  PlayIcon,
  PauseIcon,
  VolumeHighIcon,
  FullScreenIcon,
  SpeedIcon
} from "../components/Icons"
import { checkAuth } from "../api/auth"

const VIDEO_URL = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const [isPaused, setIsPaused] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isBuffering, setIsBuffering] = useState(false) // State for buffering spinner
  const [showQualityMenu, setShowQualityMenu] = useState(false) // State for Quality menu
  
  const STORAGE_KEY = `resume_pos_${VIDEO_URL}`;

  /* 🔐 AUTH CHECK */
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth()
      if (!user) {
        navigate("/login")
      } else {
        setLoading(false)
      }
    }
    verifyAuth()
  }, [navigate])

  /* ⌨️ CUSTOM KEYBOARD SHORTCUTS */
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!videoRef.current) return;
    // Don't trigger if user is typing in a search bar/input
    if (document.activeElement?.tagName === "INPUT" || document.activeElement?.tagName === "TEXTAREA") return;

    switch (e.key.toLowerCase()) {
      case " ": // Space bar
        e.preventDefault(); // Stop page scroll
        togglePlay();
        break;
      case "m": // Mute
        videoRef.current.muted = !videoRef.current.muted;
        break;
      case "arrowleft": // Seek back 10s
        videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        break;
      case "arrowright": // Seek forward 10s
        videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10);
        break;
    }
  }, [isPaused]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  /* 📺 PICTURE-IN-PICTURE LOGIC */
  const togglePiP = async () => {
    try {
      if (videoRef.current !== document.pictureInPictureElement) {
        await videoRef.current?.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (error) {
      console.error("PiP failed", error);
    }
  }

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    const total = videoRef.current.duration;
    setDuration(total);

    const savedPos = localStorage.getItem(STORAGE_KEY);
    if (savedPos) {
      const time = parseFloat(savedPos);
      videoRef.current.currentTime = time < total ? time : 0;
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPaused(false)
    } else {
      videoRef.current.pause()
      setIsPaused(true)
    }
  }

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const current = videoRef.current.currentTime
    const total = videoRef.current.duration
    setCurrentTime(current);
    setProgress(current / total)

    localStorage.setItem(STORAGE_KEY , current.toString());
  }

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !videoRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width
    videoRef.current.currentTime = percent * videoRef.current.duration
  }

  const togglePlaybackSpeed = () => {
    if (!videoRef.current) return
    let newSpeed = playbackSpeed + 0.5
    if (newSpeed > 2) newSpeed = 0.5 
    videoRef.current.playbackRate = newSpeed
    setPlaybackSpeed(newSpeed)
  }

  const handleVideoEnded = () => {
    localStorage.removeItem(STORAGE_KEY);
    setIsPaused(true);
  };

  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    navigate("/login")
  }

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>

  return (
    <div className="page-layout">
      <div className="main-content">
        <button onClick={handleLogout} className="logout-button">Logout</button>
        
        <div className="video-container">
          {/* ⏳ BUFFERING SPINNER */}
          {isBuffering && <div className="buffering-spinner"></div>}

          <video
            ref={videoRef}
            src={VIDEO_URL}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleVideoEnded}
            onWaiting={() => setIsBuffering(true)} // Shows spinner when loading
            onPlaying={() => setIsBuffering(false)} // Hides spinner when playing
            playsInline
          />
          
          <div className="video-controls-container">
            <div className="timeline-container" ref={timelineRef} onClick={handleTimelineClick}>
              <div className="timeline" style={{ "--progress-position": progress } as any} />
            </div>

            <div className="controls">
              <button onClick={togglePlay}>
                {isPaused ? <PlayIcon /> : <PauseIcon />}
              </button>

              <button><VolumeHighIcon /></button>

              <div className="duration-container">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              {/* ⚙️ QUALITY SELECTOR */}
              <div className="quality-container">
                <button onClick={() => setShowQualityMenu(!showQualityMenu)} className="icon-btn">⚙️</button>
                {showQualityMenu && (
                  <div className="quality-menu">
                    <button onClick={() => setShowQualityMenu(false)}>360p (Auto)</button>
                    <button onClick={() => alert("1080p requires HLS setup!")}>1080p</button>
                  </div>
                )}
              </div>

              <div className="speed-control-wrapper">
                <button className="speed-btn" onClick={togglePlaybackSpeed}>
                  <SpeedIcon />
                  <span className="speed-text">{playbackSpeed}x</span>
                </button>
              </div>

              {/* 📺 PiP BUTTON */}
              <button onClick={togglePiP} className="icon-btn" title="Picture in Picture">🖼️</button>

              <button 
                onClick={() => videoRef.current?.requestFullscreen()} 
                style={{ marginLeft: "auto" }}
              >
                <FullScreenIcon />
              </button>
            </div>
          </div>
        </div>
        <h1 className="video-title">BigBuckBunny Title ShortClip</h1>
      </div>
    </div>
  )
}