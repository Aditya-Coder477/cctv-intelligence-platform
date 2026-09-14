import React, { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Play, Pause, Maximize2, RotateCcw, AlertTriangle, Radio } from "lucide-react"

interface HlsPlayerProps {
  cameraId: string
  cameraName?: string
  streamUrl?: string
  autoPlay?: boolean
  className?: string
  showControls?: boolean
}

export const HlsPlayer: React.FC<HlsPlayerProps> = ({
  cameraId,
  cameraName,
  streamUrl,
  autoPlay = true,
  className = "",
  showControls = true,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const hlsRef = useRef<Hls | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [ptsDisplay, setPtsDisplay] = useState<string>("00:00:00")
  const [isLive, setIsLive] = useState(false)

  const defaultStreamUrl = streamUrl || `/api/cameras/${cameraId}/hls/index.m3u8`

  const initHls = () => {
    setError(null)
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      if (hlsRef.current) {
        hlsRef.current.destroy()
      }

      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
      })

      hlsRef.current = hls
      hls.loadSource(defaultStreamUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(true)
        if (autoPlay) {
          video.play().catch((err) => {
            console.warn("Autoplay blocked:", err)
            setIsPlaying(false)
          })
        }
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              setError("Network error contacting CCTV gateway. Retrying...")
              hls.startLoad()
              break
            case Hls.ErrorTypes.MEDIA_ERROR:
              setError("Media decode error encountered. Recovering...")
              hls.recoverMediaError()
              break
            default:
              setError(`Gateway stream error: ${data.details}`)
              hls.destroy()
              break
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari support
      video.src = defaultStreamUrl
      if (autoPlay) {
        video.play().catch(() => setIsPlaying(false))
      }
    } else {
      setError("HLS playback is not supported by your browser.")
    }
  }

  useEffect(() => {
    initHls()
    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [cameraId, streamUrl])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleTimeUpdate = () => {
      const cur = video.currentTime
      const hrs = Math.floor(cur / 3600).toString().padStart(2, "0")
      const mins = Math.floor((cur % 3600) / 60).toString().padStart(2, "0")
      const secs = Math.floor(cur % 60).toString().padStart(2, "0")
      setPtsDisplay(`${hrs}:${mins}:${secs}`)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)

    video.addEventListener("timeupdate", handleTimeUpdate)
    video.addEventListener("play", handlePlay)
    video.addEventListener("pause", handlePause)

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate)
      video.removeEventListener("play", handlePlay)
      video.removeEventListener("pause", handlePause)
    }
  }, [])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
  }

  const toggleFullScreen = () => {
    if (!videoRef.current) return
    if (document.fullscreenElement) {
      document.exitFullscreen()
    } else {
      videoRef.current.requestFullscreen().catch((err) => console.error(err))
    }
  }

  return (
    <div className={`relative bg-black rounded-lg overflow-hidden border border-police-800 flex flex-col group ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-black"
        muted
        playsInline
        crossOrigin="anonymous"
      />

      {/* Top stream metadata overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-police-950/85 backdrop-blur px-2.5 py-1 rounded border border-police-700/60 text-xs text-white">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="font-bold text-red-400">LIVE</span>
          <span className="text-police-400">|</span>
          <span className="font-mono font-medium">{cameraId.toUpperCase()}</span>
          {cameraName && <span className="text-slate-300 truncate max-w-[160px]">({cameraName})</span>}
        </div>

        <div className="flex items-center gap-2 bg-police-950/85 backdrop-blur px-2 py-1 rounded border border-police-700/60 text-xs font-mono text-emerald-400">
          <span>PTS: {ptsDisplay}</span>
          <span className="text-police-500">|</span>
          <span className="text-slate-400">1080p H264</span>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="absolute inset-0 bg-police-950/90 flex flex-col items-center justify-center p-4 text-center z-20">
          <AlertTriangle className="w-8 h-8 text-amber-400 mb-2" />
          <p className="text-xs text-slate-300 mb-3">{error}</p>
          <button
            onClick={initHls}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-police-700 hover:bg-police-600 rounded text-xs text-white font-medium transition"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Retry Stream
          </button>
        </div>
      )}

      {/* Bottom controls overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded hover:bg-white/20 text-white transition"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={initHls}
              className="p-1.5 rounded hover:bg-white/20 text-white transition"
              title="Refresh Stream"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-1.5 rounded hover:bg-white/20 text-white transition"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
