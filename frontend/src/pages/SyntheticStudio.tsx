import React, { useState, useEffect, useRef } from "react"
import {
  Upload,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Car,
  Maximize2,
  Sliders,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Search,
  Download,
  AlertCircle,
  FileVideo,
  Bell,
  BellOff,
  ShieldAlert,
  AlertTriangle,
  UserX,
  Ban,
  Eye,
  X
} from "lucide-react"
import { API_BASE, getEvidenceUrl } from "../services/api"

interface VideoItem {
  id: string
  filename: string
  path: string
  display_name: string
  width: number
  height: number
  fps: number
  frame_count: number
  duration_sec: number
  size_mb: number
  is_upload: boolean
  thumbnail_url: string
}

interface DetectedVehicle {
  track_id: string
  display_id?: string
  vehicle_type: string
  vehicle_confidence: number
  plate_number: string | null
  plate_confidence: number | null
  first_seen_sec: number
  last_seen_sec: number
  vehicle_snapshot_url: string | null
  plate_snapshot_url: string | null
  is_watchlist_match?: boolean
  watchlist_category?: string
  watchlist_priority?: string
  watchlist_case_number?: string
  watchlist_description?: string
}

interface AlertItem {
  alert_id: string
  video: string
  track_id: string
  display_id?: string
  registration_number: string
  category: string
  priority: string
  description: string
  case_number?: string
  match_score: number
  match_type: string
  status: string
  detected_at_sec: number
  timestamp_iso: string
  acknowledged_by?: string
  acknowledged_at?: string
}

function getCategoryStyle(category: string): {
  bg: string; border: string; text: string; icon: React.ReactNode; label: string
} {
  switch (category) {
    case "STOLEN_VEHICLE":
      return { bg: "bg-red-950/80", border: "border-red-600", text: "text-red-300", icon: <ShieldAlert className="w-3.5 h-3.5" />, label: "STOLEN VEHICLE" }
    case "WANTED_PERSON":
      return { bg: "bg-orange-950/80", border: "border-orange-500", text: "text-orange-300", icon: <UserX className="w-3.5 h-3.5" />, label: "WANTED PERSON" }
    case "MISSING_PERSON_VEHICLE":
      return { bg: "bg-yellow-950/80", border: "border-yellow-500", text: "text-yellow-300", icon: <Eye className="w-3.5 h-3.5" />, label: "MISSING PERSON" }
    case "BLACKLISTED_VEHICLE":
      return { bg: "bg-purple-950/80", border: "border-purple-600", text: "text-purple-300", icon: <Ban className="w-3.5 h-3.5" />, label: "BLACKLISTED" }
    case "SUSPECT_VEHICLE":
      return { bg: "bg-amber-950/80", border: "border-amber-500", text: "text-amber-300", icon: <AlertTriangle className="w-3.5 h-3.5" />, label: "SUSPECT VEHICLE" }
    default:
      return { bg: "bg-slate-900/80", border: "border-slate-600", text: "text-slate-300", icon: <AlertCircle className="w-3.5 h-3.5" />, label: category }
  }
}

function getPriorityDot(priority: string): string {
  if (priority === "CRITICAL" || priority === "HIGH") return "bg-red-500 animate-ping"
  if (priority === "MEDIUM") return "bg-amber-500"
  return "bg-slate-500"
}

export const SyntheticStudio: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>([])
  const [selectedVideo, setSelectedVideo] = useState<string>("2.mp4")
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [detectorInterval, setDetectorInterval] = useState<number>(3)
  const [conf, setConf] = useState<number>(0.25)
  const [plateConf, setPlateConf] = useState<number>(0.15)
  const [detections, setDetections] = useState<DetectedVehicle[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [totalPlates, setTotalPlates] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [streamKey, setStreamKey] = useState<number>(Date.now())
  const [selectedSnapshot, setSelectedSnapshot] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"detections" | "alerts">("detections")

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const prevAlertCount = useRef<number>(0)

  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/synthetic/videos`)
      if (res.ok) {
        const data: VideoItem[] = await res.json()
        setVideos(data)
        if (data.length > 0 && !data.some((v) => v.filename === selectedVideo)) {
          setSelectedVideo(data[0].filename)
        }
      }
    } catch (e) {
      console.error("Failed to load synthetic videos", e)
    }
  }

  // Poll detections + alerts together
  useEffect(() => {
    if (!selectedVideo || !isPlaying) return

    const fetchAll = async () => {
      try {
        const [detRes, alertRes] = await Promise.all([
          fetch(`${API_BASE}/api/synthetic/detections?video=${encodeURIComponent(selectedVideo)}`),
          fetch(`${API_BASE}/api/synthetic/alerts?video=${encodeURIComponent(selectedVideo)}`)
        ])
        if (detRes.ok) {
          const data = await detRes.json()
          setDetections(data.vehicles || [])
          setTotalPlates(data.total_plates_identified || 0)
        }
        if (alertRes.ok) {
          const alertData: AlertItem[] = await alertRes.json()
          // Strict deduplication by normalized plate / alert key (1 alert per vehicle)
          const seenPlates = new Set<string>()
          const uniqueAlerts = alertData.filter((a) => {
            const key = (a.registration_number || a.alert_id).replace(/\s+/g, "").toUpperCase()
            if (seenPlates.has(key)) return false
            seenPlates.add(key)
            return true
          })
          // Auto-switch to alerts tab when new alert arrives
          if (uniqueAlerts.length > prevAlertCount.current) {
            setActiveTab("alerts")
          }
          prevAlertCount.current = uniqueAlerts.length
          setAlerts(uniqueAlerts)
        }
      } catch (e) {
        console.error("Failed to poll feed", e)
      }
    }

    fetchAll()
    const pollTimer = window.setInterval(fetchAll, 1200)
    return () => clearInterval(pollTimer)
  }, [selectedVideo, isPlaying, streamKey])

  const handleSelectVideo = (filename: string) => {
    fetch(`${API_BASE}/api/synthetic/reset-session?video=${encodeURIComponent(filename)}`, { method: "POST" }).catch(() => {})
    setSelectedVideo(filename)
    setIsPlaying(true)
    setStreamKey(Date.now())
    setDetections([])
    setAlerts([])
    setTotalPlates(0)
    prevAlertCount.current = 0
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append("file", file)
    try {
      const res = await fetch(`${API_BASE}/api/synthetic/upload`, { method: "POST", body: formData })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Upload failed")
      }
      const data = await res.json()
      await fetchVideos()
      setSelectedVideo(data.filename)
      setStreamKey(Date.now())
      setIsPlaying(true)
    } catch (err: any) {
      setUploadError(err.message || "Failed to upload video")
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleAcknowledge = async (alertId: string) => {
    try {
      await fetch(`${API_BASE}/api/synthetic/alerts/${alertId}/acknowledge?operator=Operator`, { method: "POST" })
      setAlerts((prev) =>
        prev.map((a) => a.alert_id === alertId ? { ...a, status: "ACKNOWLEDGED" } : a)
      )
    } catch (e) {
      console.error("Acknowledge failed", e)
    }
  }

  const handleExportReport = () => {
    const reportData = {
      video: selectedVideo,
      analyzed_at: new Date().toISOString(),
      total_vehicles_detected: detections.length,
      total_plates_identified: totalPlates,
      total_alerts: alerts.length,
      alerts,
      detections,
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `detection_report_${selectedVideo}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const streamUrl = `${API_BASE}/api/synthetic/stream?video=${encodeURIComponent(selectedVideo)}&detector_interval=${detectorInterval}&conf=${conf}&plate_conf=${plateConf}&resize_w=720&_t=${streamKey}`

  const filteredDetections = detections.filter((d) => {
    if (!searchQuery) return true
    const q = searchQuery.toUpperCase()
    return (
      d.track_id.toUpperCase().includes(q) ||
      (d.plate_number && d.plate_number.toUpperCase().includes(q)) ||
      d.vehicle_type.toUpperCase().includes(q)
    )
  })

  const newAlertsCount = alerts.filter((a) => a.status === "NEW").length

  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-police-950 p-5 rounded-xl border border-police-800 shadow-xl">
        <div className="flex items-center gap-2.5">
          <span className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Sparkles className="w-5 h-5" />
          </span>
          <div>
            <h1 className="text-xl font-bold text-white tracking-wide flex items-center gap-3">
              Live Synthetic Video AI Studio
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-mono font-medium">
                YOLOv8 + ANPR + WATCHLIST
              </span>
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time Vehicle Detection, Plate Recognition &amp; Watchlist Correlation on 8 Synthetic Feeds
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs flex-wrap">
          <div className="px-3.5 py-2 bg-police-900/90 rounded-lg border border-police-800 flex items-center gap-2">
            <FileVideo className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">PRE-LOADED FEEDS</span>
              <span className="font-semibold text-white">{videos.length} Videos</span>
            </div>
          </div>
          <div className="px-3.5 py-2 bg-police-900/90 rounded-lg border border-police-800 flex items-center gap-2">
            <Car className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">VEHICLES TRACKED</span>
              <span className="font-semibold text-white">{detections.length} Active</span>
            </div>
          </div>
          <div className="px-3.5 py-2 bg-police-900/90 rounded-lg border border-police-800 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">PLATES LOCKED</span>
              <span className="font-semibold text-white">{totalPlates} Identified</span>
            </div>
          </div>
          {alerts.length > 0 && (
            <div className="px-3.5 py-2 bg-red-950/80 rounded-lg border border-red-700 flex items-center gap-2 animate-pulse">
              <ShieldAlert className="w-4 h-4 text-red-400" />
              <div>
                <span className="text-red-400 block text-[10px] font-bold">WATCHLIST ALERTS</span>
                <span className="font-semibold text-red-300">{newAlertsCount} Active</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Active Alert Full-Width Banner ─────────────────────────────── */}
      {newAlertsCount > 0 && (
        <div className="flex items-center gap-3 px-4 py-3 bg-red-950/70 border border-red-700 rounded-xl shadow-lg shadow-red-950/40">
          <span className="relative flex h-3 w-3 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
          <ShieldAlert className="w-5 h-5 text-red-400 shrink-0" />
          <p className="text-sm font-bold text-red-300 flex-1">
            ⚠ WATCHLIST MATCH DETECTED — {newAlertsCount} unacknowledged alert{newAlertsCount > 1 ? "s" : ""} require operator attention
          </p>
          <button
            onClick={() => setActiveTab("alerts")}
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors"
          >
            View Alerts
          </button>
        </div>
      )}

      {/* ── Video Selector Shelf ────────────────────────────────────────── */}
      <div className="bg-police-950/80 p-4 rounded-xl border border-police-800">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-police-300 uppercase tracking-wider flex items-center gap-2">
            <FileVideo className="w-3.5 h-3.5 text-cyan-400" />
            Select Synthetic CCTV Stream or Upload Video
          </span>
          <span className="text-[11px] text-slate-400">
            Click any feed below to start real-time live AI analysis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border-2 border-dashed border-police-700 hover:border-cyan-500 bg-police-900/40 hover:bg-cyan-950/20 transition-all text-center min-h-[110px]"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="video/mp4,video/avi,video/quicktime,video/mkv" className="hidden" />
            <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-white">Upload MP4</span>
            <span className="text-[10px] text-slate-400 mt-0.5">{isUploading ? "Uploading..." : "Custom Video"}</span>
          </div>

          {videos.map((vid) => {
            const isSelected = vid.filename === selectedVideo
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid.filename)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all ${
                  isSelected ? "border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950" : "border-police-800 hover:border-police-600 bg-police-900/60"
                }`}
              >
                <div className="aspect-video w-full bg-slate-900 relative">
                  <img src={getEvidenceUrl(vid.thumbnail_url)} alt={vid.display_name} className="w-full h-full object-cover" onError={(e) => { ;(e.target as HTMLElement).style.display = "none" }} />
                  {isSelected && <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-cyan-500 text-[9px] font-bold text-black rounded uppercase tracking-wider">ACTIVE</span>}
                  <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[9px] font-mono text-slate-200 rounded">{vid.duration_sec}s</span>
                </div>
                <div className="p-2 bg-police-950">
                  <p className="text-[11px] font-medium text-white truncate">{vid.display_name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">{vid.width}x{vid.height} • {vid.fps}fps</p>
                </div>
              </div>
            )
          })}
        </div>

        {uploadError && (
          <div className="mt-3 p-2.5 bg-red-950/50 border border-red-800 rounded-lg text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            {uploadError}
          </div>
        )}
      </div>

      {/* ── Main Workstation Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

        {/* Left: Video Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-black shadow-2xl shadow-cyan-950/40">
            <div className="aspect-video w-full relative flex items-center justify-center bg-slate-950">
              {isPlaying ? (
                <img key={streamKey} src={streamUrl} alt="Live AI Video Stream" className="w-full h-full object-contain" />
              ) : (
                <div className="text-center p-8">
                  <Pause className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-sm text-slate-400">Stream Paused</p>
                  <button onClick={() => setIsPlaying(true)} className="mt-3 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold rounded-lg">
                    Resume Analysis
                  </button>
                </div>
              )}

              {/* LIVE badge */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-cyan-300 tracking-wider border border-cyan-500/40 uppercase">LIVE YOLOv8 INFERENCE</span>
              </div>

              {/* Alert HUD top-right */}
              {newAlertsCount > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-red-900/90 border border-red-600 rounded pointer-events-none">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-flex shrink-0"></span>
                  <span className="text-[10px] font-bold text-red-300 font-mono uppercase tracking-wider">{newAlertsCount} ALERT{newAlertsCount > 1 ? "S" : ""} ACTIVE</span>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="p-3.5 bg-police-950 border-t border-police-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button onClick={() => setIsPlaying(!isPlaying)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white text-xs font-medium transition-colors">
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button onClick={() => { setStreamKey(Date.now()); setIsPlaying(true) }} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white text-xs font-medium transition-colors">
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-police-400" />
                  <span className="text-slate-400">Interval:</span>
                  <select
                    value={detectorInterval}
                    onChange={(e) => { setDetectorInterval(Number(e.target.value)); setStreamKey(Date.now()) }}
                    className="bg-police-900 border border-police-700 text-white rounded px-2 py-1 text-xs outline-none focus:border-cyan-500"
                  >
                    <option value={1}>Every 1 Frame (Max Accurate)</option>
                    <option value={2}>Every 2 Frames (Balanced)</option>
                    <option value={3}>Every 3 Frames (Recommended - Smooth)</option>
                    <option value={4}>Every 4 Frames (High FPS)</option>
                    <option value={5}>Every 5 Frames (Fastest)</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Veh Conf:</span>
                  <input type="range" min="0.10" max="0.80" step="0.05" value={conf}
                    onChange={(e) => { setConf(Number(e.target.value)); setStreamKey(Date.now()) }}
                    className="w-16 accent-cyan-400"
                  />
                  <span className="font-mono text-cyan-300 w-7">{Math.round(conf * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-3.5 bg-police-950/60 rounded-xl border border-police-800/80 text-xs text-slate-400 flex items-start gap-3">
            <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0"><Camera className="w-4 h-4" /></div>
            <div>
              <p className="font-semibold text-slate-200">HUD Legend: Vehicle ID + Plate + Watchlist Correlation</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cyan boxes = tracked vehicle (<strong className="text-cyan-300">TRK-XXXX</strong>). Green reticle = plate locked by EasyOCR.{" "}
                <strong className="text-red-400">Red corner-bracket reticles</strong> = watchlist match with category badge (STOLEN / WANTED / SUSPECT / BLACKLISTED / MISSING).
              </p>
            </div>
          </div>
        </div>

        {/* Right: Tabbed Detections / Alerts */}
        <div className="lg:col-span-4 bg-police-950 rounded-xl border border-police-800 flex flex-col h-[680px] shadow-xl overflow-hidden">
          {/* Tab Header */}
          <div className="border-b border-police-800">
            <div className="flex">
              <button
                onClick={() => setActiveTab("detections")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors ${
                  activeTab === "detections" ? "text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/20" : "text-slate-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vehicles ({detections.length})
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors relative ${
                  activeTab === "alerts" ? "text-red-300 border-b-2 border-red-500 bg-red-950/20" : "text-slate-400 hover:text-white"
                }`}
              >
                {newAlertsCount > 0 ? <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" /> : <BellOff className="w-3.5 h-3.5" />}
                Alerts ({alerts.length})
                {newAlertsCount > 0 && (
                  <span className="absolute top-2 right-6 w-4 h-4 bg-red-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {newAlertsCount}
                  </span>
                )}
              </button>
            </div>

            {/* Sub-header */}
            <div className="px-4 py-2.5 flex items-center justify-between">
              {activeTab === "detections" ? (
                <>
                  <div className="relative flex-1 mr-2">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Vehicle ID / Plate..."
                      className="w-full bg-police-900 border border-police-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={handleExportReport} disabled={detections.length === 0}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 rounded transition-colors disabled:opacity-40 shrink-0"
                  >
                    <Download className="w-3 h-3" /> Export
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-slate-400">
                  {newAlertsCount > 0 ? `${newAlertsCount} unacknowledged — click Acknowledge to clear` : "No pending alerts for this video"}
                </span>
              )}
            </div>
          </div>

          {/* ── DETECTIONS TAB ── */}
          {activeTab === "detections" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {filteredDetections.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <Car className="w-8 h-8 mb-2 opacity-40 text-cyan-400" />
                  <p className="text-xs">No vehicles detected yet</p>
                  <p className="text-[10px] mt-1 text-slate-600">Vehicles appear here as the video streams</p>
                </div>
              ) : (
                filteredDetections.map((veh) => {
                  const hasPlate = Boolean(veh.plate_number)
                  const isMatch = Boolean(veh.is_watchlist_match)
                  const catStyle = isMatch && veh.watchlist_category ? getCategoryStyle(veh.watchlist_category) : null
                  return (
                    <div
                      key={veh.track_id}
                      className={`p-3 rounded-lg border transition-all space-y-2 group ${
                        isMatch ? "bg-red-950/30 border-red-700/70 hover:border-red-500" : "bg-police-900/70 border-police-800/90 hover:border-cyan-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-1 rounded text-xs font-bold border ${isMatch ? "bg-red-950 text-red-300 border-red-700" : "bg-cyan-950/90 text-cyan-300 border-cyan-800"}`}>
                            {veh.display_id || `${veh.vehicle_type} #${veh.track_id.replace('TRK-', '').replace(/^0+/, '')}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isMatch && catStyle && (
                            <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}>
                              {catStyle.icon}{catStyle.label}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3 h-3 text-slate-500" />
                            {veh.last_seen_sec.toFixed(1)}s
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-slate-400 uppercase font-medium">Plate:</span>
                          {hasPlate ? (
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs tracking-wider shadow-sm border ${isMatch ? "bg-red-950/90 border-red-600 text-red-300" : "bg-emerald-950/90 border-emerald-600 text-emerald-300 shadow-emerald-950"}`}>
                              {veh.plate_number}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">
                              No plate detected
                            </span>
                          )}
                        </div>
                        {hasPlate && veh.plate_confidence && (
                          <span className="text-[10px] text-emerald-400/90 font-mono">{Math.round(veh.plate_confidence * 100)}% conf</span>
                        )}
                      </div>

                      {isMatch && veh.watchlist_description && (
                        <div className="text-[10px] text-red-300/80 bg-red-950/30 rounded px-2 py-1 border border-red-900/60 italic">
                          {veh.watchlist_description}
                          {veh.watchlist_case_number && <span className="ml-2 font-mono font-bold text-red-400">#{veh.watchlist_case_number}</span>}
                        </div>
                      )}

                      {(veh.vehicle_snapshot_url || veh.plate_snapshot_url) && (
                        <div className="flex items-center gap-2 pt-1 border-t border-police-800/60">
                          {veh.vehicle_snapshot_url && (
                            <div onClick={() => setSelectedSnapshot(veh.vehicle_snapshot_url)} className="cursor-pointer overflow-hidden rounded border border-police-700/80 hover:border-cyan-400 w-14 h-9 bg-black">
                              <img src={getEvidenceUrl(veh.vehicle_snapshot_url)} alt="Vehicle crop" className="w-full h-full object-cover" />
                            </div>
                          )}
                          {veh.plate_snapshot_url && (
                            <div onClick={() => setSelectedSnapshot(veh.plate_snapshot_url)} className={`cursor-pointer overflow-hidden rounded border hover:border-emerald-400 w-16 h-7 bg-black flex items-center justify-center ${isMatch ? "border-red-700" : "border-emerald-600"}`}>
                              <img src={getEvidenceUrl(veh.plate_snapshot_url)} alt="Plate crop" className="w-full h-full object-contain" />
                            </div>
                          )}
                          <span className="text-[9px] text-slate-500 ml-auto">Click crop to zoom</span>
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* ── ALERTS TAB ── */}
          {activeTab === "alerts" && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {alerts.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                  <ShieldCheck className="w-8 h-8 mb-2 opacity-40 text-emerald-400" />
                  <p className="text-xs text-emerald-400/60 font-semibold">No Alerts Generated</p>
                  <p className="text-[10px] mt-1">Alerts appear when a detected vehicle matches the classified watchlist database</p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const catStyle = getCategoryStyle(alert.category)
                  const isNew = alert.status === "NEW"
                  return (
                    <div key={alert.alert_id} className={`rounded-lg border overflow-hidden ${isNew ? `${catStyle.bg} ${catStyle.border} shadow-lg` : "bg-police-900/40 border-police-700"}`}>
                      <div className={`flex items-center justify-between px-3 py-2 ${isNew ? "bg-black/30" : "bg-police-900/50"}`}>
                        <div className="flex items-center gap-2">
                          <span className={`flex items-center gap-1 ${isNew ? catStyle.text : "text-slate-400"}`}>
                            {catStyle.icon}
                            <span className="text-[11px] font-bold tracking-wider">{catStyle.label}</span>
                          </span>
                          {isNew && <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded uppercase animate-pulse">NEW</span>}
                          {!isNew && <span className="px-1.5 py-0.5 bg-slate-700 text-slate-300 text-[9px] font-bold rounded uppercase">ACK</span>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full inline-flex shrink-0 ${getPriorityDot(alert.priority)}`}></span>
                          <span className="text-[10px] font-bold font-mono text-slate-300">{alert.priority}</span>
                        </div>
                      </div>

                      <div className="px-3 py-2.5 space-y-1.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`px-2.5 py-0.5 rounded font-mono font-bold text-sm tracking-widest border ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}>
                            {alert.registration_number}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">{alert.track_id}</span>
                          <span className={`text-[10px] font-mono ${alert.match_type === "EXACT_MATCH" ? "text-red-400" : "text-amber-400"}`}>
                            {alert.match_type === "EXACT_MATCH" ? "⚡ EXACT" : "~ FUZZY"}
                          </span>
                        </div>

                        <p className="text-[11px] text-slate-300 leading-tight">{alert.description}</p>

                        <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono">
                          {alert.case_number && <span>Case: <span className="text-slate-200">{alert.case_number}</span></span>}
                          <span>Score: <span className="text-emerald-400">{(alert.match_score * 100).toFixed(0)}%</span></span>
                          <span>@{alert.detected_at_sec.toFixed(1)}s</span>
                        </div>

                        {isNew ? (
                          <button
                            onClick={() => handleAcknowledge(alert.alert_id)}
                            className={`mt-1 w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-xs font-semibold transition-colors border ${catStyle.border} ${catStyle.text} hover:bg-white/10`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Acknowledge Alert
                          </button>
                        ) : (
                          <p className="text-[10px] text-slate-500 italic mt-0.5">
                            Acknowledged by {alert.acknowledged_by || "Operator"}{alert.acknowledged_at ? ` • ${new Date(alert.acknowledged_at).toLocaleTimeString()}` : ""}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Snapshot Modal */}
      {selectedSnapshot && (
        <div onClick={() => setSelectedSnapshot(null)} className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 cursor-pointer">
          <div onClick={(e) => e.stopPropagation()} className="bg-police-950 p-4 rounded-xl border border-police-700 max-w-lg w-full text-center space-y-3 relative">
            <button onClick={() => setSelectedSnapshot(null)} className="absolute top-3 right-3 p-1 rounded bg-police-800 hover:bg-police-700 text-slate-300">
              <X className="w-4 h-4" />
            </button>
            <h4 className="text-sm font-bold text-white">High-Resolution Crop Snapshot</h4>
            <div className="rounded-lg overflow-hidden border border-police-800 bg-black">
              <img src={getEvidenceUrl(selectedSnapshot)} alt="Snapshot preview" className="w-full object-contain max-h-[70vh]" />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SyntheticStudio
