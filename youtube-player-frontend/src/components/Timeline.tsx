interface Props {
  currentTime: number
  duration: number
  onSeek: (t: number) => void
}

export default function Timeline({ currentTime, duration, onSeek }: Props) {
  return (
    <input
      className="timeline"
      type="range"
      min="0"
      max={duration}
      step="0.1"
      value={currentTime}
      onChange={(e) => onSeek(+e.target.value)}
    />
  )
}
