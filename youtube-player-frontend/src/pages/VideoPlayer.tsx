import { useRef, useState,useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "../styles/video-player.css"
import {
  PlayIcon,
  PauseIcon,
  VolumeHighIcon,
  FullScreenIcon,
  SpeedIcon // Import your new icon
} from "../components/Icons"
import { checkAuth } from "../api/auth"

const VIDEO_URL = "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4"

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
 
  
  /* 🔐 AUTH CHECK (VERY IMPORTANT) */
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>


  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

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
    setCurrentTime(current)
    setDuration(total)
    setProgress(current / total)
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
   /* 🚪 OPTIONAL LOGOUT */
  const handleLogout = async () => {
    await fetch("http://localhost:5000/api/auth/logout", {
      method: "POST",
      credentials: "include"
    })
    navigate("/login")
  }


  return (
    <div className="page-layout">
      <div className="main-content">
        {/* 🔓 LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          style={{
            position: "absolute",
            top: 20,
            right: 20,
            padding: "8px 14px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>
        
        <div className="video-container">
          <video
            ref={videoRef}
            src={VIDEO_URL}
            onClick={togglePlay}
            onTimeUpdate={handleTimeUpdate}
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

              {/* Enhanced Speed Control */}
              <div className="speed-control-wrapper">
                <button className="speed-btn" onClick={togglePlaybackSpeed}>
                  <SpeedIcon />
                  <span className="speed-text">{playbackSpeed}x</span>
                </button>
              </div>

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