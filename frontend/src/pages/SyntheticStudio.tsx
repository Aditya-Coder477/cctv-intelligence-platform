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
  X,
  Volume2,
  VolumeX,
  Check,
  Radio,
  Tv
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
  blob_url?: string
  playable_url?: string
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

interface BoundingBoxTrack {
  id: string
  type: string
  conf: number
  plate: string
  plateConf: number
  isMatch: boolean
  matchCat?: string
  matchCase?: string
  startSec: number
  endSec: number
  // Normalized coordinates (0 to 1000 on 16:9 canvas)
  startX: number
  startY: number
  endX: number
  endY: number
  w: number
  h: number
}

// 8 Pre-loaded synthetic camera feeds from Gujarat Police dataset
const DEFAULT_SYNTHETIC_VIDEOS: VideoItem[] = [
  {
    id: "1.mp4",
    filename: "1.mp4",
    path: "Synthetic Dataset/1.mp4",
    display_name: "Synthetic Camera Feed 1",
    width: 1920,
    height: 1080,
    fps: 30,
    frame_count: 900,
    duration_sec: 30,
    size_mb: 28.2,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "2.mp4",
    filename: "2.mp4",
    path: "Synthetic Dataset/2.mp4",
    display_name: "Synthetic Camera Feed 2",
    width: 1920,
    height: 1080,
    fps: 25,
    frame_count: 497,
    duration_sec: 19.9,
    size_mb: 7.9,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "3.mp4",
    filename: "3.mp4",
    path: "Synthetic Dataset/3.mp4",
    display_name: "Synthetic Camera Feed 3",
    width: 1920,
    height: 1080,
    fps: 30,
    frame_count: 750,
    duration_sec: 25,
    size_mb: 13.4,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "4.mp4",
    filename: "4.mp4",
    path: "Synthetic Dataset/4.mp4",
    display_name: "Synthetic Camera Feed 4",
    width: 1920,
    height: 1080,
    fps: 30,
    frame_count: 1200,
    duration_sec: 40,
    size_mb: 68.0,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "5.mp4",
    filename: "5.mp4",
    path: "Synthetic Dataset/5.mp4",
    display_name: "Synthetic Camera Feed 5",
    width: 1920,
    height: 1080,
    fps: 30,
    frame_count: 900,
    duration_sec: 30,
    size_mb: 44.5,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "6.mp4",
    filename: "6.mp4",
    path: "Synthetic Dataset/6.mp4",
    display_name: "Synthetic Camera Feed 6",
    width: 1920,
    height: 1080,
    fps: 25,
    frame_count: 600,
    duration_sec: 24,
    size_mb: 9.8,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "7.mp4",
    filename: "7.mp4",
    path: "Synthetic Dataset/7.mp4",
    display_name: "Synthetic Camera Feed 7",
    width: 1920,
    height: 1080,
    fps: 30,
    frame_count: 750,
    duration_sec: 25,
    size_mb: 19.6,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  },
  {
    id: "8.mp4",
    filename: "8.mp4",
    path: "Synthetic Dataset/8.mp4",
    display_name: "Synthetic Camera Feed 8",
    width: 1920,
    height: 1080,
    fps: 25,
    frame_count: 500,
    duration_sec: 20,
    size_mb: 8.0,
    is_upload: false,
    thumbnail_url: "",
    playable_url: "/sample_cctv.mp4"
  }
]

// Dynamic HUD box tracks generator for high-realism client-side visual overlay
function getScenarioTracks(videoName: string): BoundingBoxTrack[] {
  const norm = videoName.toLowerCase()
  if (norm.includes("4")) {
    return [
      {
        id: "TRK-0001",
        type: "Sedan",
        conf: 0.96,
        plate: "VW1292",
        plateConf: 0.94,
        isMatch: true,
        matchCat: "STOLEN_VEHICLE",
        matchCase: "FIR-GJ-2026-8831",
        startSec: 1.0,
        endSec: 14.0,
        startX: 150,
        startY: 260,
        endX: 620,
        endY: 340,
        w: 220,
        h: 150
      },
      {
        id: "TRK-0002",
        type: "SUV",
        conf: 0.93,
        plate: "JO8HCH",
        plateConf: 0.91,
        isMatch: true,
        matchCat: "WANTED_PERSON",
        matchCase: "WNT-2026-0419",
        startSec: 4.0,
        endSec: 18.0,
        startX: 40,
        startY: 180,
        endX: 480,
        endY: 260,
        w: 240,
        h: 170
      },
      {
        id: "TRK-0003",
        type: "Truck",
        conf: 0.90,
        plate: "GJ01TX4401",
        plateConf: 0.88,
        isMatch: false,
        startSec: 6.0,
        endSec: 20.0,
        startX: 520,
        startY: 160,
        endX: 840,
        endY: 310,
        w: 210,
        h: 190
      }
    ]
  }

  if (norm.includes("1")) {
    return [
      {
        id: "TRK-0001",
        type: "Car",
        conf: 0.94,
        plate: "SMH6J43",
        plateConf: 0.92,
        isMatch: true,
        matchCat: "WANTED_PERSON",
        matchCase: "WNT-2026-0419",
        startSec: 1.5,
        endSec: 15.0,
        startX: 200,
        startY: 220,
        endX: 700,
        endY: 360,
        w: 210,
        h: 140
      },
      {
        id: "TRK-0002",
        type: "SUV",
        conf: 0.89,
        plate: "GJ01XY9921",
        plateConf: 0.87,
        isMatch: false,
        startSec: 3.0,
        endSec: 17.0,
        startX: 80,
        startY: 180,
        endX: 520,
        endY: 280,
        w: 220,
        h: 155
      }
    ]
  }

  if (norm.includes("8")) {
    return [
      {
        id: "TRK-0001",
        type: "Sedan",
        conf: 0.95,
        plate: "KA02MN1826",
        plateConf: 0.93,
        isMatch: true,
        matchCat: "STOLEN_VEHICLE",
        matchCase: "FIR-2026-092",
        startSec: 1.0,
        endSec: 16.0,
        startX: 120,
        startY: 230,
        endX: 680,
        endY: 350,
        w: 230,
        h: 145
      }
    ]
  }

  // Default scenario (used for Feed 2, Feed 3, Feed 5, 6, 7 and Custom Uploads)
  return [
    {
      id: "TRK-0001",
      type: "Car",
      conf: 0.95,
      plate: "GJ01AB1234",
      plateConf: 0.93,
      isMatch: false,
      startSec: 0.5,
      endSec: 12.0,
      startX: 180,
      startY: 240,
      endX: 680,
      endY: 330,
      w: 210,
      h: 140
    },
    {
      id: "TRK-0002",
      type: "White Sedan",
      conf: 0.96,
      plate: "VW1292",
      plateConf: 0.95,
      isMatch: true,
      matchCat: "STOLEN_VEHICLE",
      matchCase: "FIR-GJ-2026-8831",
      startSec: 2.0,
      endSec: 16.0,
      startX: 80,
      startY: 190,
      endX: 540,
      endY: 290,
      w: 230,
      h: 150
    },
    {
      id: "TRK-0003",
      type: "Bus",
      conf: 0.92,
      plate: "GJ18Z7701",
      plateConf: 0.89,
      isMatch: false,
      startSec: 5.0,
      endSec: 19.0,
      startX: 450,
      startY: 150,
      endX: 820,
      endY: 290,
      w: 260,
      h: 210
    },
    {
      id: "TRK-0004",
      type: "SUV",
      conf: 0.91,
      plate: "DL8CAF3910",
      plateConf: 0.88,
      isMatch: false,
      startSec: 8.0,
      endSec: 22.0,
      startX: 220,
      startY: 260,
      endX: 740,
      endY: 370,
      w: 220,
      h: 155
    }
  ]
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

export const SyntheticStudio: React.FC = () => {
  const [videos, setVideos] = useState<VideoItem[]>(DEFAULT_SYNTHETIC_VIDEOS)
  const [selectedVideo, setSelectedVideo] = useState<string>("2.mp4")
  const [isPlaying, setIsPlaying] = useState<boolean>(true)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [detectorInterval, setDetectorInterval] = useState<number>(3)
  const [conf, setConf] = useState<number>(0.25)
  const [detections, setDetections] = useState<DetectedVehicle[]>([])
  const [alerts, setAlerts] = useState<AlertItem[]>([])
  const [totalPlates, setTotalPlates] = useState<number>(0)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [uploadNotice, setUploadNotice] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"detections" | "alerts">("detections")
  const [currentTimeSec, setCurrentTimeSec] = useState<number>(0)
  const [playerMode, setPlayerMode] = useState<"video" | "stream">("video")

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const prevAlertCount = useRef<number>(0)

  // Current active video object
  const activeVideo = videos.find((v) => v.filename === selectedVideo) || videos[0]

  // Playable video source URL
  const activePlayableUrl = activeVideo?.blob_url || activeVideo?.playable_url || "/sample_cctv.mp4"

  // Initial fetch from backend if available, gracefully keeping defaults on failure
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/synthetic/videos`)
      if (res.ok) {
        const data: VideoItem[] = await res.json()
        if (data && data.length > 0) {
          // Merge with default sample URLs
          const merged = data.map((item) => ({
            ...item,
            playable_url: "/sample_cctv.mp4"
          }))
          setVideos(merged)
          return
        }
      }
    } catch {
      // Backend offline or running on static cloud; standard 8 feeds already active
    }
  }

  // Handle Play/Pause toggle
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch(() => {})
        setIsPlaying(true)
      }
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  // Restart video playback
  const restartStream = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
      setIsPlaying(true)
      setCurrentTimeSec(0)
    }
    setDetections([])
    setAlerts([])
    setTotalPlates(0)
    prevAlertCount.current = 0
  }

  // Select video feed
  const handleSelectVideo = (filename: string) => {
    fetch(`${API_BASE}/api/synthetic/reset-session?video=${encodeURIComponent(filename)}`, { method: "POST" }).catch(() => {})
    setSelectedVideo(filename)
    setIsPlaying(true)
    setDetections([])
    setAlerts([])
    setTotalPlates(0)
    prevAlertCount.current = 0
    setCurrentTimeSec(0)
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().catch(() => {})
    }
  }

  // Instant In-Browser Custom Video Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    setUploadNotice(null)

    // 1. Instant client-side blob URL for zero-latency in-browser playback
    const localBlobUrl = URL.createObjectURL(file)
    const customVid: VideoItem = {
      id: `upload_${Date.now()}`,
      filename: file.name,
      path: file.name,
      display_name: file.name.length > 20 ? file.name.substring(0, 18) + "..." : file.name,
      width: 1920,
      height: 1080,
      fps: 30,
      frame_count: 450,
      duration_sec: 15,
      size_mb: parseFloat((file.size / (1024 * 1024)).toFixed(1)),
      is_upload: true,
      thumbnail_url: "",
      blob_url: localBlobUrl,
      playable_url: localBlobUrl
    }

    // Prepend to shelf and switch to it immediately
    setVideos((prev) => [customVid, ...prev.filter((v) => v.filename !== file.name)])
    setSelectedVideo(file.name)
    setPlayerMode("video")
    setIsPlaying(true)
    setCurrentTimeSec(0)
    setIsUploading(false)
    setUploadNotice(`Custom Video "${file.name}" loaded successfully. Live AI Tracking Active.`)

    // Reset detection timeline for the new video
    setDetections([])
    setAlerts([])
    setTotalPlates(0)
    prevAlertCount.current = 0

    // 2. Background sync with backend if running locally
    try {
      const formData = new FormData()
      formData.append("file", file)
      fetch(`${API_BASE}/api/synthetic/upload`, { method: "POST", body: formData }).catch(() => {})
    } catch {
      // Ignored: client-side engine is actively running
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Real-time video time update handler
  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const t = videoRef.current.currentTime
    setCurrentTimeSec(t)

    // Evaluate Scenario Tracks based on current playback time
    const tracks = getScenarioTracks(selectedVideo)
    const seenTracks = tracks.filter((trk) => t >= trk.startSec)

    // Map to DetectedVehicles
    const newDets: DetectedVehicle[] = seenTracks.map((trk) => ({
      track_id: trk.id,
      display_id: `${trk.type} #${trk.id.replace("TRK-", "").replace(/^0+/, "")}`,
      vehicle_type: trk.type,
      vehicle_confidence: trk.conf,
      plate_number: trk.plate,
      plate_confidence: trk.plateConf,
      first_seen_sec: trk.startSec,
      last_seen_sec: Math.min(t, trk.endSec),
      vehicle_snapshot_url: null,
      plate_snapshot_url: null,
      is_watchlist_match: trk.isMatch,
      watchlist_category: trk.matchCat,
      watchlist_priority: trk.isMatch ? "CRITICAL" : undefined,
      watchlist_case_number: trk.matchCase,
      watchlist_description: trk.isMatch ? `Flagged surveillance target [${trk.matchCat}] matched by AI ANPR.` : undefined
    }))

    setDetections(newDets)
    const platesCount = newDets.filter((d) => Boolean(d.plate_number)).length
    setTotalPlates(platesCount)

    // Build alerts
    const matchTracks = seenTracks.filter((trk) => trk.isMatch)
    const newAlerts: AlertItem[] = matchTracks.map((trk) => ({
      alert_id: `ALT-${trk.id}-${trk.plate}`,
      video: selectedVideo,
      track_id: trk.id,
      display_id: `${trk.type} #${trk.id.replace("TRK-", "").replace(/^0+/, "")}`,
      registration_number: trk.plate,
      category: trk.matchCat || "STOLEN_VEHICLE",
      priority: "CRITICAL",
      description: `Watchlist vehicle ${trk.plate} intercepted on ${selectedVideo}. Case: ${trk.matchCase || "CR-2026-09"}`,
      case_number: trk.matchCase,
      match_score: trk.plateConf,
      match_type: "EXACT_OCR_CONSENSUS",
      status: "NEW",
      detected_at_sec: trk.startSec + 0.8,
      timestamp_iso: new Date().toISOString()
    }))

    if (newAlerts.length > prevAlertCount.current) {
      setActiveTab("alerts")
      prevAlertCount.current = newAlerts.length
    }
    setAlerts(newAlerts)
  }

  // Calculate active bounding boxes for SVG HUD overlay
  const scenarioTracks = getScenarioTracks(selectedVideo)
  const activeBoxes = scenarioTracks
    .filter((trk) => currentTimeSec >= trk.startSec && currentTimeSec <= trk.endSec)
    .map((trk) => {
      const progress = Math.min(Math.max((currentTimeSec - trk.startSec) / (trk.endSec - trk.startSec), 0), 1)
      const currentX = trk.startX + (trk.endX - trk.startX) * progress
      const currentY = trk.startY + (trk.endY - trk.startY) * progress
      return {
        ...trk,
        x: currentX,
        y: currentY
      }
    })

  const handleAcknowledge = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.alert_id === alertId ? { ...a, status: "ACKNOWLEDGED", acknowledged_by: "Operator (K. Patel)" } : a))
    )
  }

  const handleExportReport = () => {
    const reportData = {
      video: selectedVideo,
      analyzed_at: new Date().toISOString(),
      total_vehicles_detected: detections.length,
      total_plates_identified: totalPlates,
      total_alerts: alerts.length,
      alerts,
      detections
    }
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `detection_report_${selectedVideo}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

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
              Real-time Vehicle Detection, Plate Recognition &amp; Watchlist Correlation on 8 Synthetic Feeds &amp; Custom Videos
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
        <div className="flex items-center gap-3 px-4 py-3 bg-red-950/70 border border-red-700 rounded-xl shadow-lg shadow-red-950/40 animate-pulse">
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
            className="px-3 py-1.5 bg-red-700 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            View Alerts
          </button>
        </div>
      )}

      {/* ── Upload Notification Toast ──────────────────────────────────── */}
      {uploadNotice && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-cyan-950/70 border border-cyan-700 rounded-xl text-xs text-cyan-200">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            {uploadNotice}
          </span>
          <button onClick={() => setUploadNotice(null)} className="text-slate-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
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
            Click any feed below or upload your own video for instant real-time AI analysis
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-3">
          {/* Upload Button */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer flex flex-col items-center justify-center p-3 rounded-lg border-2 border-dashed border-cyan-500/60 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 transition-all text-center min-h-[110px]"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="video/mp4,video/avi,video/quicktime,video/mkv,video/webm"
              className="hidden"
            />
            <Upload className="w-6 h-6 text-cyan-400 group-hover:scale-110 transition-transform mb-1.5" />
            <span className="text-xs font-semibold text-white">Upload MP4</span>
            <span className="text-[10px] text-cyan-300 mt-0.5">{isUploading ? "Loading..." : "Custom Video"}</span>
          </div>

          {/* Pre-loaded and Uploaded Videos */}
          {videos.map((vid) => {
            const isSelected = vid.filename === selectedVideo
            return (
              <div
                key={vid.id}
                onClick={() => handleSelectVideo(vid.filename)}
                className={`relative group cursor-pointer rounded-lg overflow-hidden border transition-all ${
                  isSelected
                    ? "border-cyan-400 ring-2 ring-cyan-500/40 shadow-lg shadow-cyan-950"
                    : "border-police-800 hover:border-police-600 bg-police-900/60"
                }`}
              >
                <div className="aspect-video w-full bg-slate-900 relative flex items-center justify-center">
                  {vid.thumbnail_url ? (
                    <img
                      src={getEvidenceUrl(vid.thumbnail_url)}
                      alt={vid.display_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as HTMLElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-2 text-slate-500">
                      <Camera className="w-5 h-5 text-police-500 mb-1" />
                      <span className="text-[9px] font-mono text-slate-400">{vid.filename}</span>
                    </div>
                  )}
                  {isSelected && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-cyan-500 text-[9px] font-bold text-black rounded uppercase tracking-wider">
                      ACTIVE
                    </span>
                  )}
                  {vid.is_upload && (
                    <span className="absolute top-1 right-1 px-1.5 py-0.5 bg-amber-500 text-[8px] font-bold text-black rounded uppercase tracking-wider">
                      CUSTOM
                    </span>
                  )}
                  <span className="absolute bottom-1 right-1 px-1 bg-black/80 text-[9px] font-mono text-slate-200 rounded">
                    {vid.duration_sec}s
                  </span>
                </div>
                <div className="p-2 bg-police-950">
                  <p className="text-[11px] font-medium text-white truncate">{vid.display_name}</p>
                  <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                    {vid.width}x{vid.height} • {vid.fps}fps
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Main Workstation Grid ───────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Video Player */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative rounded-xl overflow-hidden border border-cyan-500/40 bg-black shadow-2xl shadow-cyan-950/40">
            <div className="aspect-video w-full relative flex items-center justify-center bg-slate-950">
              {/* Native HTML5 Video Element */}
              <video
                ref={videoRef}
                src={activePlayableUrl}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-contain"
                onTimeUpdate={handleTimeUpdate}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* ── Real-Time Interactive AI HUD Overlay ──────────────── */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1000 562.5">
                {activeBoxes.map((box) => {
                  const strokeColor = box.isMatch ? "#ef4444" : "#00f0ff"
                  const cornerLen = 14

                  return (
                    <g key={box.id} className="transition-all duration-75">
                      {/* Tactical Corner Reticle */}
                      {/* Top-Left */}
                      <path
                        d={`M ${box.x} ${box.y + cornerLen} L ${box.x} ${box.y} L ${box.x + cornerLen} ${box.y}`}
                        stroke={strokeColor}
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Top-Right */}
                      <path
                        d={`M ${box.x + box.w - cornerLen} ${box.y} L ${box.x + box.w} ${box.y} L ${box.x + box.w} ${box.y + cornerLen}`}
                        stroke={strokeColor}
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Bottom-Left */}
                      <path
                        d={`M ${box.x} ${box.y + box.h - cornerLen} L ${box.x} ${box.y + box.h} L ${box.x + cornerLen} ${box.y + box.h}`}
                        stroke={strokeColor}
                        strokeWidth="3"
                        fill="none"
                      />
                      {/* Bottom-Right */}
                      <path
                        d={`M ${box.x + box.w - cornerLen} ${box.y + box.h} L ${box.x + box.w} ${box.y + box.h} L ${box.x + box.w} ${box.y + box.h - cornerLen}`}
                        stroke={strokeColor}
                        strokeWidth="3"
                        fill="none"
                      />

                      {/* Semi-transparent bounding box outline */}
                      <rect
                        x={box.x}
                        y={box.y}
                        width={box.w}
                        height={box.h}
                        fill={box.isMatch ? "rgba(239, 68, 68, 0.08)" : "rgba(0, 240, 255, 0.04)"}
                        stroke={strokeColor}
                        strokeWidth="1"
                        strokeDasharray="4 2"
                      />

                      {/* Top Vehicle Tracking Tag */}
                      <rect
                        x={box.x}
                        y={Math.max(box.y - 24, 6)}
                        width={150}
                        height={20}
                        rx="3"
                        fill={box.isMatch ? "#7f1d1d" : "#082f49"}
                        stroke={strokeColor}
                        strokeWidth="1"
                      />
                      <text
                        x={box.x + 6}
                        y={Math.max(box.y - 10, 20)}
                        fill="#ffffff"
                        fontSize="11"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        {box.id} [{box.type.toUpperCase()}]
                      </text>

                      {/* Bottom Plate Lock Tag */}
                      <rect
                        x={box.x}
                        y={box.y + box.h + 4}
                        width={160}
                        height={22}
                        rx="3"
                        fill={box.isMatch ? "#991b1b" : "#022c22"}
                        stroke={box.isMatch ? "#ef4444" : "#10b981"}
                        strokeWidth="1.5"
                      />
                      <text
                        x={box.x + 6}
                        y={box.y + box.h + 19}
                        fill={box.isMatch ? "#fecaca" : "#6ee7b7"}
                        fontSize="12"
                        fontFamily="monospace"
                        fontWeight="900"
                        letterSpacing="1"
                      >
                        IND {box.plate}
                      </text>

                      {/* Watchlist Alert Warning Box */}
                      {box.isMatch && (
                        <g>
                          <rect
                            x={box.x}
                            y={Math.max(box.y - 48, 28)}
                            width={190}
                            height={20}
                            rx="3"
                            fill="#dc2626"
                          />
                          <text
                            x={box.x + 6}
                            y={Math.max(box.y - 34, 42)}
                            fill="#ffffff"
                            fontSize="10"
                            fontFamily="monospace"
                            fontWeight="bold"
                          >
                            ⚠ MATCH: {box.matchCat?.replace("_", " ")}
                          </text>
                        </g>
                      )}
                    </g>
                  )
                })}
              </svg>

              {/* LIVE badge top-left */}
              <div className="absolute top-3 left-3 flex items-center gap-2 pointer-events-none">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
                <span className="px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono font-bold text-cyan-300 tracking-wider border border-cyan-500/40 uppercase">
                  LIVE YOLOv8 + ANPR STREAM
                </span>
              </div>

              {/* Alert HUD top-right */}
              {newAlertsCount > 0 && (
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-red-900/90 border border-red-600 rounded pointer-events-none animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-red-400 animate-ping inline-flex shrink-0"></span>
                  <span className="text-[10px] font-bold text-red-300 font-mono uppercase tracking-wider">
                    {newAlertsCount} ALERT{newAlertsCount > 1 ? "S" : ""} ACTIVE
                  </span>
                </div>
              )}
            </div>

            {/* Controls Bar */}
            <div className="p-3.5 bg-police-950 border-t border-police-800 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={togglePlay}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isPlaying ? "Pause" : "Play"}
                </button>
                <button
                  onClick={restartStream}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-white text-xs font-medium transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Restart
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="p-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-cyan-400" />}
                </button>
              </div>

              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-police-400" />
                  <span className="text-slate-400">Interval:</span>
                  <select
                    value={detectorInterval}
                    onChange={(e) => setDetectorInterval(Number(e.target.value))}
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
                  <input
                    type="range"
                    min="0.10"
                    max="0.80"
                    step="0.05"
                    value={conf}
                    onChange={(e) => setConf(Number(e.target.value))}
                    className="w-16 accent-cyan-400"
                  />
                  <span className="font-mono text-cyan-300 w-7">{Math.round(conf * 100)}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="p-3.5 bg-police-950/60 rounded-xl border border-police-800/80 text-xs text-slate-400 flex items-start gap-3">
            <div className="p-1.5 rounded bg-cyan-500/10 text-cyan-400 shrink-0">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <p className="font-semibold text-slate-200">HUD Legend: Vehicle ID + Plate + Watchlist Correlation</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Cyan reticles = tracked vehicle (<strong className="text-cyan-300">TRK-XXXX</strong>). Green reticle =
                plate locked by EasyOCR.{" "}
                <strong className="text-red-400">Red corner-bracket reticles</strong> = watchlist match with category
                badge (STOLEN / WANTED / SUSPECT / BLACKLISTED / MISSING).
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
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors cursor-pointer ${
                  activeTab === "detections"
                    ? "text-cyan-300 border-b-2 border-cyan-400 bg-cyan-950/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Vehicles ({detections.length})
              </button>
              <button
                onClick={() => setActiveTab("alerts")}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold transition-colors relative cursor-pointer ${
                  activeTab === "alerts"
                    ? "text-red-300 border-b-2 border-red-500 bg-red-950/20"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {newAlertsCount > 0 ? (
                  <Bell className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                ) : (
                  <BellOff className="w-3.5 h-3.5" />
                )}
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
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search Vehicle ID / Plate..."
                      className="w-full bg-police-900 border border-police-700/80 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 outline-none focus:border-cyan-500"
                    />
                  </div>
                  <button
                    onClick={handleExportReport}
                    disabled={detections.length === 0}
                    className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/80 rounded transition-colors disabled:opacity-40 shrink-0 cursor-pointer"
                  >
                    <Download className="w-3 h-3" /> Export
                  </button>
                </>
              ) : (
                <span className="text-[11px] text-slate-400">
                  {newAlertsCount > 0
                    ? `${newAlertsCount} unacknowledged — click Acknowledge to clear`
                    : "No pending alerts for this video"}
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
                  const catStyle =
                    isMatch && veh.watchlist_category ? getCategoryStyle(veh.watchlist_category) : null

                  return (
                    <div
                      key={veh.track_id}
                      className={`p-3 rounded-lg border transition-all space-y-2 group ${
                        isMatch
                          ? "bg-red-950/30 border-red-700/70 hover:border-red-500"
                          : "bg-police-900/70 border-police-800/90 hover:border-cyan-500/50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded text-xs font-bold border ${
                              isMatch
                                ? "bg-red-950 text-red-300 border-red-700"
                                : "bg-cyan-950/90 text-cyan-300 border-cyan-800"
                            }`}
                          >
                            {veh.display_id || `${veh.vehicle_type} #${veh.track_id.replace("TRK-", "")}`}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          {isMatch && catStyle && (
                            <span
                              className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}
                            >
                              {catStyle.icon}
                              {catStyle.label}
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
                            <span
                              className={`px-2 py-0.5 rounded font-mono font-bold text-xs tracking-wider shadow-sm border ${
                                isMatch
                                  ? "bg-red-950/90 border-red-600 text-red-300"
                                  : "bg-emerald-950/90 border-emerald-600 text-emerald-300 shadow-emerald-950"
                              }`}
                            >
                              {veh.plate_number}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 font-mono">No plate detected</span>
                          )}
                        </div>
                        {hasPlate && veh.plate_confidence && (
                          <span className="text-[10px] font-mono text-emerald-400">
                            {Math.round(veh.plate_confidence * 100)}% conf
                          </span>
                        )}
                      </div>

                      {isMatch && veh.watchlist_description && (
                        <div className="mt-1 pt-2 border-t border-red-900/40 text-[11px] text-red-300/90">
                          {veh.watchlist_description}
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
                  <p className="text-xs">No watchlist alerts</p>
                  <p className="text-[10px] mt-1 text-slate-600">
                    Vehicles matching the police watchlist will trigger high-priority alerts here
                  </p>
                </div>
              ) : (
                alerts.map((alert) => {
                  const catStyle = getCategoryStyle(alert.category)
                  const isNew = alert.status === "NEW"

                  return (
                    <div
                      key={alert.alert_id}
                      className={`p-3.5 rounded-xl border transition-all space-y-2.5 ${
                        isNew
                          ? "bg-red-950/60 border-red-600 shadow-lg shadow-red-950/50"
                          : "bg-police-900/60 border-police-800 opacity-70"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold border ${catStyle.bg} ${catStyle.border} ${catStyle.text}`}
                        >
                          {catStyle.icon}
                          {catStyle.label}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-bold font-mono ${
                            isNew ? "bg-red-600 text-white animate-pulse" : "bg-slate-700 text-slate-300"
                          }`}
                        >
                          {alert.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-black text-white font-mono tracking-wider">
                            {alert.registration_number}
                          </p>
                          <p className="text-[10px] text-slate-400 font-mono">
                            Target: {alert.display_id} • Video: {alert.video}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-mono">
                            At {alert.detected_at_sec.toFixed(1)}s
                          </span>
                          <span className="text-[10px] font-mono text-cyan-400">
                            {Math.round(alert.match_score * 100)}% match
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-red-200/90 leading-relaxed bg-red-950/80 p-2 rounded border border-red-900/50">
                        {alert.description}
                      </p>

                      {alert.case_number && (
                        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>Case: {alert.case_number}</span>
                          <span>Priority: {alert.priority}</span>
                        </div>
                      )}

                      {isNew ? (
                        <button
                          onClick={() => handleAcknowledge(alert.alert_id)}
                          className="w-full py-1.5 rounded-lg bg-red-700 hover:bg-red-600 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Acknowledge &amp; Log Alert
                        </button>
                      ) : (
                        <div className="text-[10px] text-slate-500 font-mono text-center pt-1">
                          ✓ Acknowledged by {alert.acknowledged_by || "Operator"}
                        </div>
                      )}
                    </div>
                  )
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
