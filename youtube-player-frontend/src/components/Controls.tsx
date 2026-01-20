import { PlayIcon, PauseIcon, VolumeHighIcon } from "./Icons"

interface Props {
  isPlaying: boolean
  togglePlay: () => void
  volume: number
  onVolumeChange: (v: number) => void
}

export default function Controls({
  isPlaying,
  togglePlay,
  volume,
  onVolumeChange
}: Props) {
  return (
    <div className="controls">
      <button onClick={togglePlay}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <VolumeHighIcon />
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={(e) => onVolumeChange(+e.target.value)}
      />
    </div>
  )
}
