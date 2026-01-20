import { useRef, useState, } from 'react'
import '../styles/video-player.css'
import { PlayIcon, PauseIcon, VolumeHighIcon, FullScreenIcon } from './Icons'

export default function VideoPlayer() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const [isPaused, setIsPaused] = useState(true)
  const [progress, setProgress] = useState(0)

  // Update progress bar as video plays
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentProgress = videoRef.current.currentTime / videoRef.current.duration
      setProgress(currentProgress)
    }
  }

  // Scrubbing/Seeking logic
  const handleTimelineUpdate = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !videoRef.current) return
    const rect = timelineRef.current.getBoundingClientRect()
    const percent = Math.min(Math.max(0, e.clientX - rect.left), rect.width) / rect.width
    videoRef.current.currentTime = percent * videoRef.current.duration
  }

  const togglePlay = () => {
    if (videoRef.current?.paused) {
      videoRef.current.play()
      setIsPaused(false)
    } else {
      videoRef.current?.pause()
      setIsPaused(true)
    }
  }

  return (
    <div className="video-container">
      <video 
        ref={videoRef}
        onTimeUpdate={handleTimeUpdate}
        onClick={togglePlay}
        src="https://www.w3schools.com/html/mov_bbb.mp4" 
      />
      
      <div className="video-controls-container">
        <div 
          className="timeline-container" 
          ref={timelineRef}
          onClick={handleTimelineUpdate}
        >
          <div 
            className="timeline" 
            style={{ '--progress-position': progress } as React.CSSProperties}
          ></div>
        </div>

        <div className="controls">
          <button onClick={togglePlay}>
            {isPaused ? <PlayIcon /> : <PauseIcon />}
          </button>
          
          <button><VolumeHighIcon /></button>
          
          <div className="duration-container" style={{fontSize: '14px', fontFamily: 'Roboto, Arial'}}>
            {/* You can add a timestamp helper function here later */}
            0:00 / 0:10 
          </div>

          <button 
            onClick={() => videoRef.current?.requestFullscreen()} 
            style={{marginLeft: "auto"}}
          >
            <FullScreenIcon />
          </button>
        </div>
      </div>
    </div>
  )
}