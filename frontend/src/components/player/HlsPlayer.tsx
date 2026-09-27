import React, { useEffect, useRef, useState } from "react"
import Hls from "hls.js"
import { Play, Pause, Maximize2, RotateCcw, AlertTriangle, Radio, ShieldAlert } from "lucide-react"

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
  const [isAuthRequired, setIsAuthRequired] = useState(false)
  const [ptsDisplay, setPtsDisplay] = useState<string>("00:00:00")
  const [isLive, setIsLive] = useState(false)

  const apiBase = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "")
  const defaultHlsUrl = streamUrl || `${apiBase}/api/cameras/${cameraId}/hls/index.m3u8`

  const destroyHls = () => {
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
  }

  const initHls = () => {
    setError(null)
    setIsAuthRequired(false)
    destroyHls()
    const video = videoRef.current
    if (!video) return

    if (Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        liveSyncDurationCount: 3,
        liveMaxLatencyDurationCount: 10,
        xhrSetup: (xhr) => {
          xhr.withCredentials = true
        },
      })

      hlsRef.current = hls
      hls.loadSource(defaultHlsUrl)
      hls.attachMedia(video)

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLive(true)
        setError(null)
        setIsAuthRequired(false)
        if (autoPlay) {
          video.play().then(() => setIsPlaying(true)).catch((err) => {
            console.warn("Autoplay blocked:", err)
            setIsPlaying(false)
          })
        }
      })

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          setIsLive(false)
          console.warn("HLS stream error for", cameraId, data.type, data.details, data.response?.code)
          if (data.response?.code === 503 || data.response?.code === 401 || data.response?.code === 302) {
            setIsAuthRequired(true)
            setError(`Real CCTV stream for ${cameraId.toUpperCase()} requires Sentinel authentication credentials or active session.`)
          } else if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
            setError(`Network error connecting to real CCTV gateway for ${cameraId.toUpperCase()}. Retrying...`)
            hls.startLoad()
          } else if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
            setError("Media decode error encountered. Recovering...")
            hls.recoverMediaError()
          } else {
            setError(`CCTV Gateway stream error: ${data.details || "Stream unavailable"}`)
            destroyHls()
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // Native Safari support
      video.src = defaultHlsUrl
      if (autoPlay) {
        video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
      }
    } else {
      setError("HLS playback is not supported by your browser.")
    }
  }

  useEffect(() => {
    initHls()
    return () => {
      destroyHls()
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
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
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
    <div className={`relative bg-black rounded-lg overflow-hidden border border-[#1e3a6a] flex flex-col group ${className}`}>
      {/* Video element */}
      <video
        ref={videoRef}
        className="w-full h-full object-cover bg-black"
        muted
        playsInline
        crossOrigin="anonymous"
        onClick={togglePlay}
      />

      {/* Top stream metadata overlay */}
      <div className="absolute top-2 left-2 right-2 flex items-center justify-between pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#060c18]/90 backdrop-blur px-2.5 py-1 rounded border border-[#1e3a6a]/80 text-xs text-white shadow-md">
          <Radio className="w-3.5 h-3.5 text-red-500 animate-pulse" />
          <span className="font-bold text-red-400">LIVE HLS</span>
          <span className="text-slate-500">|</span>
          <span className="font-mono font-medium">{cameraId.toUpperCase()}</span>
          {cameraName && <span className="text-slate-300 truncate max-w-[150px] hidden sm:inline">({cameraName})</span>}
        </div>

        <div className="flex items-center gap-2 bg-[#060c18]/90 backdrop-blur px-2 py-1 rounded border border-[#1e3a6a]/80 text-xs font-mono text-emerald-400 shadow-md">
          <span>PTS: {ptsDisplay}</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">1080p H264</span>
        </div>
      </div>

      {/* Error / Auth Required state */}
      {error && (
        <div className="absolute inset-0 bg-[#060c18]/95 flex flex-col items-center justify-center p-4 text-center z-20">
          {isAuthRequired ? (
            <ShieldAlert className="w-9 h-9 text-amber-400 mb-2" />
          ) : (
            <AlertTriangle className="w-9 h-9 text-amber-400 mb-2" />
          )}
          <h4 className="text-sm font-semibold text-white mb-1">
            {isAuthRequired ? "Sentinel Authentication Required" : "Stream Connection Error"}
          </h4>
          <p className="text-xs text-slate-300 max-w-sm mb-3">
            {error}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={initHls}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#132442] hover:bg-[#1a325b] border border-sky-500/50 rounded text-xs text-sky-200 font-medium transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reconnect Live Stream
            </button>
          </div>
        </div>
      )}

      {/* Bottom controls overlay */}
      {showControls && (
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <button
              onClick={togglePlay}
              className="p-1.5 rounded hover:bg-white/20 text-white transition cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={initHls}
              className="p-1.5 rounded hover:bg-white/20 text-white transition cursor-pointer"
              title="Refresh Stream"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleFullScreen}
              className="p-1.5 rounded hover:bg-white/20 text-white transition cursor-pointer"
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


