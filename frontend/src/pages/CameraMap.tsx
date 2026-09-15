import React, { useEffect, useState, useMemo, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, useMapEvents } from "react-leaflet"
import L from "leaflet"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  AlertCircle,
  Video,
  ExternalLink,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  X,
  SlidersHorizontal,
  ShieldAlert,
  ChevronLeft,
  ChevronRight,
  Route,
  Activity,
  AlertTriangle,
  Radio,
  Eye,
  Camera as CameraIcon,
  Filter,
  RefreshCw,
  Compass,
  ArrowRight,
  Info
} from "lucide-react"
import { api, getEvidenceUrl } from "../services/api"
import { Camera, Alert, ObservedVehicle } from "../types"
import { HlsPlayer } from "../components/player/HlsPlayer"

// ── Map Zoom Controller & State Listener ──────────────────────────────────────
const MapEventsHandler: React.FC<{
  onZoomChange: (zoom: number) => void
  centerTarget: [number, number] | null
  targetZoom: number | null
}> = ({ onZoomChange, centerTarget, targetZoom }) => {
  const map = useMapEvents({
    zoomend: () => {
      onZoomChange(map.getZoom())
    },
  })

  useEffect(() => {
    if (centerTarget) {
      map.setView(centerTarget, targetZoom || map.getZoom(), { animate: true })
    }
  }, [centerTarget, targetZoom, map])

  return null
}

// ── Custom Tactical Marker Generators ─────────────────────────────────────────
function createCameraIcon(status: string, hasAlert: boolean, isSelected: boolean) {
  let ringColor = "#10b981" // emerald
  let glowColor = "rgba(16, 185, 129, 0.4)"
  let coreBg = "#064e3b"

  if (hasAlert || status === "active_alert") {
    ringColor = "#ef4444" // red
    glowColor = "rgba(239, 68, 68, 0.6)"
    coreBg = "#7f1d1d"
  } else if (status === "degraded") {
    ringColor = "#f59e0b" // amber
    glowColor = "rgba(245, 158, 11, 0.5)"
    coreBg = "#78350f"
  } else if (status === "offline") {
    ringColor = "#64748b" // slate gray
    glowColor = "rgba(100, 116, 139, 0.3)"
    coreBg = "#1e293b"
  }

  const selectedBorder = isSelected ? "border: 2px solid #06b6d4; transform: scale(1.2);" : ""
  const alertAnimation = hasAlert || status === "active_alert" ? "animation: pulse 1.5s infinite;" : ""

  return L.divIcon({
    className: "tactical-camera-pin",
    html: `
      <div style="position: relative; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; ${alertAnimation} ${selectedBorder}">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: ${glowColor}; filter: blur(3px);"></div>
        <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: ${coreBg}; border: 2px solid ${ringColor}; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(0,0,0,0.8);">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="${ringColor}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
            <circle cx="12" cy="13" r="3"/>
          </svg>
        </div>
        ${hasAlert || status === "active_alert" ? `
          <div style="position: absolute; top: -3px; right: -3px; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; border: 1.5px solid #000;"></div>
        ` : ""}
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  })
}

function createClusterIcon(cluster: { name: string; count: number; hasAlert: boolean }) {
  const borderColor = cluster.hasAlert ? "#ef4444" : "#06b6d4"
  const bgColor = cluster.hasAlert ? "rgba(127, 29, 29, 0.9)" : "rgba(10, 25, 47, 0.92)"
  const textColor = cluster.hasAlert ? "#fca5a5" : "#e0f2fe"

  return L.divIcon({
    className: "tactical-cluster-pin",
    html: `
      <div style="position: relative; min-width: 44px; height: 44px; padding: 0 8px; border-radius: 22px; background: ${bgColor}; border: 2px solid ${borderColor}; display: flex; flex-direction: column; align-items: center; justify-content: center; box-shadow: 0 0 16px ${cluster.hasAlert ? "rgba(239,68,68,0.6)" : "rgba(6,182,212,0.4)"}; cursor: pointer; transition: transform 0.2s;">
        <span style="font-family: monospace; font-size: 13px; font-weight: 800; color: ${textColor}; line-height: 1;">${cluster.count}</span>
        <span style="font-size: 8px; font-weight: 700; color: ${textColor}; letter-spacing: 0.5px; text-transform: uppercase;">CAMS</span>
        ${cluster.hasAlert ? `
          <div style="position: absolute; top: -4px; right: -4px; width: 12px; height: 12px; border-radius: 50%; background: #ef4444; border: 2px solid #000; display: flex; align-items: center; justify-content: center; font-size: 8px; font-weight: bold; color: white;">!</div>
        ` : ""}
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  })
}

function createAlertIcon() {
  return L.divIcon({
    className: "tactical-alert-pin",
    html: `
      <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(239, 68, 68, 0.5); animation: ping 1.2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 26px; height: 26px; border-radius: 50%; background: #7f1d1d; border: 2px solid #ef4444; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 12px rgba(239,68,68,0.8);">
          <span style="font-size: 12px;">🚨</span>
        </div>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  })
}

function createSequenceIcon(index: number) {
  return L.divIcon({
    className: "tactical-sequence-pin",
    html: `
      <div style="width: 28px; height: 28px; border-radius: 50%; background: #1e3a8a; border: 2px solid #60a5fa; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(96,165,250,0.8); font-family: monospace; font-weight: 900; font-size: 11px; color: #ffffff;">
        ${index}
      </div>
    `,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  })
}

// ── Region Definitions for Low-Zoom Clustering ────────────────────────────────
interface RegionalCluster {
  id: string
  name: string
  lat: number
  lon: number
  cameras: Camera[]
}

export const CameraMap: React.FC = () => {
  const navigate = useNavigate()

  // Data states
  const [cameras, setCameras] = useState<Camera[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [vehicles, setVehicles] = useState<ObservedVehicle[]>([])
  const [loading, setLoading] = useState(true)

  // Selection states
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [liveStreamCamera, setLiveStreamCamera] = useState<Camera | null>(null)
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null)
  const [selectedVehicleReg, setSelectedVehicleReg] = useState<string | null>(null)

  // Map control states
  const [currentZoom, setCurrentZoom] = useState<number>(8)
  const [centerTarget, setCenterTarget] = useState<[number, number] | null>(null)
  const [targetZoom, setTargetZoom] = useState<number | null>(null)

  // Layer toggles
  const [showFilterPanel, setShowFilterPanel] = useState<boolean>(true)
  const [showAlertsLayer, setShowAlertsLayer] = useState<boolean>(true)
  const [showObservationSequence, setShowObservationSequence] = useState<boolean>(false)

  // Filter states
  const [search, setSearch] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [typeFilter, setTypeFilter] = useState<string>("ALL")
  const [aiFilter, setAiFilter] = useState<string>("ALL")
  const [alertFilter, setAlertFilter] = useState<string>("ALL")

  // Load backend camera catalogue, alerts, and vehicles
  const loadMapData = async () => {
    setLoading(true)
    try {
      const [camsData, alertsData, vehsData] = await Promise.all([
        api.getCameras().catch(() => []),
        api.getAlerts().catch(() => []),
        api.getVehicles({ limit: 50 }).catch(() => []),
      ])
      setCameras(camsData)
      setAlerts(alertsData)
      setVehicles(vehsData)
    } catch (e) {
      console.error("Failed to load GIS map data", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadMapData()
  }, [])

  // Spatial vs Non-spatial cameras
  const spatialCameras = useMemo(() => {
    return cameras.filter((c) => c.is_spatial && c.latitude != null && c.longitude != null)
  }, [cameras])

  const nonSpatialCameras = useMemo(() => {
    return cameras.filter((c) => !c.is_spatial || c.latitude == null || c.longitude == null)
  }, [cameras])

  // Camera alert map: cameraId -> Alert[]
  const cameraAlertsMap = useMemo(() => {
    const map: Record<string, Alert[]> = {}
    alerts.forEach((a) => {
      if (a.camera_id) {
        map[a.camera_id] = map[a.camera_id] || []
        map[a.camera_id].push(a)
      }
    })
    return map
  }, [alerts])

  // Filter logic
  const filteredSpatialCameras = useMemo(() => {
    return spatialCameras.filter((c) => {
      // 1. Text Search (Camera ID, Name, Location, Department)
      if (search.trim()) {
        const q = search.toLowerCase()
        const matchesText =
          c.camera_id.toLowerCase().includes(q) ||
          c.name.toLowerCase().includes(q) ||
          (c.location && c.location.toLowerCase().includes(q)) ||
          (c.department && c.department.toLowerCase().includes(q))
        if (!matchesText) return false
      }

      // 2. Status Filter
      if (statusFilter !== "ALL") {
        if (statusFilter === "ACTIVE_ALERT") {
          const hasAlert = (cameraAlertsMap[c.camera_id]?.length || 0) > 0 || c.status === "active_alert"
          if (!hasAlert) return false
        } else if (c.status.toLowerCase() !== statusFilter.toLowerCase()) {
          return false
        }
      }

      // 3. Camera Type Filter
      if (typeFilter !== "ALL") {
        const cType = (c.camera_type || "Fixed").toLowerCase()
        if (cType !== typeFilter.toLowerCase()) return false
      }

      // 4. AI Capability Filter
      if (aiFilter !== "ALL") {
        const caps = c.ai_capabilities || ["Vehicle Detection", "ANPR"]
        if (!caps.some((cap) => cap.toLowerCase().includes(aiFilter.toLowerCase()))) {
          return false
        }
      }

      // 5. Alert Filter
      if (alertFilter === "WITH_ALERTS") {
        const hasAlert = (cameraAlertsMap[c.camera_id]?.length || 0) > 0 || c.status === "active_alert"
        if (!hasAlert) return false
      }

      return true
    })
  }, [spatialCameras, search, statusFilter, typeFilter, aiFilter, alertFilter, cameraAlertsMap])

  // Dynamic Geographic Regional Clusters for Zoom < 11
  const regionalClusters = useMemo(() => {
    const clusterMap: Record<string, RegionalCluster> = {
      ahmedabad: { id: "ahmedabad", name: "Ahmedabad Metro", lat: 23.045, lon: 72.570, cameras: [] },
      junagadh: { id: "junagadh", name: "Junagadh Division", lat: 21.520, lon: 70.460, cameras: [] },
      navsari: { id: "navsari", name: "Navsari / Bilimora", lat: 20.800, lon: 72.980, cameras: [] },
      rajkot: { id: "rajkot", name: "Rajkot Sector", lat: 22.302, lon: 70.800, cameras: [] },
      gandhinagar: { id: "gandhinagar", name: "Gandhinagar Capital", lat: 23.167, lon: 72.696, cameras: [] },
      girsomnath: { id: "girsomnath", name: "Gir Somnath Coastal", lat: 20.900, lon: 70.367, cameras: [] },
      northgujarat: { id: "northgujarat", name: "North Gujarat", lat: 23.850, lon: 72.300, cameras: [] },
      kutch: { id: "kutch", name: "Kutch / Gandhidham", lat: 23.076, lon: 70.133, cameras: [] },
    }

    filteredSpatialCameras.forEach((cam) => {
      const lat = cam.latitude!
      const lon = cam.longitude!

      if (lat >= 22.95 && lat <= 23.12 && lon >= 72.50 && lon <= 72.65) {
        clusterMap.ahmedabad.cameras.push(cam)
      } else if (lat >= 21.45 && lat <= 21.60 && lon >= 70.40 && lon <= 70.55) {
        clusterMap.junagadh.cameras.push(cam)
      } else if (lat >= 20.70 && lat <= 20.90 && lon >= 72.90 && lon <= 73.10) {
        clusterMap.navsari.cameras.push(cam)
      } else if (lat >= 22.20 && lat <= 22.40 && lon >= 70.70 && lon <= 70.90) {
        clusterMap.rajkot.cameras.push(cam)
      } else if (lat >= 23.13 && lat <= 23.25 && lon >= 72.55 && lon <= 72.90) {
        clusterMap.gandhinagar.cameras.push(cam)
      } else if (lat >= 20.80 && lat <= 21.00 && lon >= 70.25 && lon <= 70.45) {
        clusterMap.girsomnath.cameras.push(cam)
      } else if (lat >= 23.50 && lon <= 72.50) {
        clusterMap.northgujarat.cameras.push(cam)
      } else {
        clusterMap.kutch.cameras.push(cam)
      }
    })

    return Object.values(clusterMap).filter((cl) => cl.cameras.length > 0)
  }, [filteredSpatialCameras])

  // Summary Metrics Bar values
  const metrics = useMemo(() => {
    let online = 0
    let degraded = 0
    let offline = 0
    let activeAlerts = 0

    cameras.forEach((c) => {
      const hasAlert = (cameraAlertsMap[c.camera_id]?.length || 0) > 0 || c.status === "active_alert"
      if (hasAlert) {
        activeAlerts++
      } else if (c.status === "degraded") {
        degraded++
      } else if (c.status === "offline") {
        offline++
      } else {
        online++
      }
    })

    return {
      total: cameras.length,
      online,
      degraded,
      offline,
      activeAlerts,
    }
  }, [cameras, cameraAlertsMap])

  // Observation Sequence data calculation
  const sequenceData = useMemo(() => {
    if (!showObservationSequence || !selectedVehicleReg) return null

    const veh = vehicles.find(
      (v) => v.registration_number === selectedVehicleReg || v.normalized_registration_number === selectedVehicleReg
    )
    if (!veh || !veh.timeline || veh.timeline.length < 2) return null

    // Map each timeline observation to its camera coordinates if verified
    const points: Array<{
      camera_id: string
      name: string
      lat: number
      lon: number
      pts_ms?: number
      track_id: string
      consensus: number
      evidence_image?: string
    }> = []

    veh.timeline.forEach((seg) => {
      const cam = cameras.find((c) => c.camera_id === seg.camera_id)
      if (cam && cam.latitude != null && cam.longitude != null) {
        points.push({
          camera_id: cam.camera_id,
          name: cam.name,
          lat: cam.latitude,
          lon: cam.longitude,
          pts_ms: seg.first_seen_pts_ms,
          track_id: seg.track_id,
          consensus: seg.consensus_score,
          evidence_image: seg.evidence_image,
        })
      }
    })

    if (points.length < 2) return null

    return {
      vehicle: veh,
      points,
      polylineCoords: points.map((p) => [p.lat, p.lon] as [number, number]),
    }
  }, [showObservationSequence, selectedVehicleReg, vehicles, cameras])

  // Handlers
  const handleZoomToCamera = (cam: Camera) => {
    if (cam.latitude != null && cam.longitude != null) {
      setCenterTarget([cam.latitude, cam.longitude])
      setTargetZoom(14)
      setSelectedCamera(cam)
    }
  }

  const handleClusterClick = (cluster: RegionalCluster) => {
    setCenterTarget([cluster.lat, cluster.lon])
    setTargetZoom(12)
  }

  return (
    <div className="space-y-3 max-w-[1700px] mx-auto h-[calc(100vh-5.5rem)] flex flex-col">
      {/* ── 1. Top Tactical Summary Bar & Command Controls ────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-police-950/90 border border-police-800 rounded-xl shadow-lg shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-400">
              <Compass className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                GIS Tactical Surveillance Command
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-police-800 text-police-300 border border-police-700">
                  GUJARAT SECTOR
                </span>
              </h2>
              <p className="text-[11px] text-slate-400">
                Hybrid Model 5 Architecture: CCTV Registry + GIS + Live Inference Telemetry
              </p>
            </div>
          </div>
        </div>

        {/* Live Metrics Chips */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-lg bg-police-900 border border-police-700/80 flex items-center gap-2 text-slate-300">
            <CameraIcon className="w-3.5 h-3.5 text-police-400" />
            <span>TOTAL: <strong className="text-white">{metrics.total}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-emerald-950/50 border border-emerald-600/40 flex items-center gap-2 text-emerald-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>ONLINE: <strong className="text-emerald-200">{metrics.online}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-amber-950/50 border border-amber-600/40 flex items-center gap-2 text-amber-300">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>DEGRADED: <strong className="text-amber-200">{metrics.degraded}</strong></span>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 flex items-center gap-2 text-slate-400">
            <span className="w-2 h-2 rounded-full bg-slate-500"></span>
            <span>OFFLINE: <strong className="text-slate-300">{metrics.offline}</strong></span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            metrics.activeAlerts > 0
              ? "bg-red-950/80 border-red-600 text-red-300 shadow-sm shadow-red-950/50 animate-pulse"
              : "bg-police-900 border-police-800 text-slate-400"
          }`}>
            <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
            <span>ALERTS: <strong className="text-red-200">{metrics.activeAlerts}</strong></span>
          </div>
        </div>

        {/* Action Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              showFilterPanel
                ? "bg-police-800 text-cyan-300 border-cyan-500/40 shadow"
                : "bg-police-900 text-slate-400 border-police-700 hover:text-white"
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Panel</span>
          </button>

          <button
            onClick={() => setShowAlertsLayer(!showAlertsLayer)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              showAlertsLayer
                ? "bg-red-950/80 text-red-300 border-red-600 shadow"
                : "bg-police-900 text-slate-400 border-police-700 hover:text-white"
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Watchlist Layer</span>
          </button>

          <button
            onClick={() => {
              setShowObservationSequence(!showObservationSequence)
              if (!showObservationSequence && !selectedVehicleReg) {
                // Auto-select first vehicle with multi-camera sightings
                const candidate = vehicles.find((v) => v.timeline && v.timeline.length >= 2)
                if (candidate) setSelectedVehicleReg(candidate.registration_number)
              }
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition border ${
              showObservationSequence
                ? "bg-blue-950 text-blue-300 border-blue-500 shadow"
                : "bg-police-900 text-slate-400 border-police-700 hover:text-white"
            }`}
          >
            <Route className="w-3.5 h-3.5" />
            <span>Observation Sequence</span>
          </button>

          <button
            onClick={loadMapData}
            title="Refresh GIS Feeds"
            className="p-1.5 rounded-lg bg-police-900 hover:bg-police-800 text-slate-400 hover:text-white border border-police-700"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>
      </div>

      {/* ── 2. Observation Sequence Disclaimer Notice (When Enabled) ──────── */}
      {showObservationSequence && (
        <div className="px-4 py-2.5 rounded-xl bg-blue-950/70 border border-blue-600/60 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shrink-0">
          <div className="flex items-center gap-2.5">
            <Route className="w-4 h-4 text-blue-400 shrink-0" />
            <div>
              <span className="font-bold text-blue-200 mr-2">Observation Sequence Mode Active:</span>
              <span className="text-blue-300/80 text-[11px]">
                Showing camera checkpoints ordered by local media PTS. (Time Basis: Camera-local media PTS — Unverified spatial continuous route. Does not claim a verified physical journey).
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[11px] text-slate-300 font-mono font-semibold">Select Target:</span>
            <select
              value={selectedVehicleReg || ""}
              onChange={(e) => setSelectedVehicleReg(e.target.value)}
              className="px-2 py-1 bg-police-950 border border-blue-500/50 rounded text-xs text-white font-mono focus:outline-none"
            >
              {vehicles
                .filter((v) => v.timeline && v.timeline.length >= 2)
                .map((v) => (
                  <option key={v.vehicle_id} value={v.registration_number}>
                    {v.registration_number} ({v.camera_count} Cameras)
                  </option>
                ))}
            </select>
          </div>
        </div>
      )}

      {/* ── 3. Main Workstation Grid: Filter Panel + Map + Intel Drawer ──── */}
      <div className="flex-1 flex overflow-hidden rounded-xl border border-police-800 bg-police-950 relative">

        {/* Collapsible Left Filter Panel */}
        {showFilterPanel && (
          <div className="w-72 sm:w-80 h-full bg-police-900/90 border-r border-police-800 flex flex-col shrink-0 z-10 backdrop-blur">
            <div className="p-3 border-b border-police-800 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-police-300 flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-cyan-400" />
                GIS Filter Controls
              </span>
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-police-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 space-y-3 overflow-y-auto flex-1 text-xs">
              {/* Search Bar */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                  Search Registry
                </label>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-police-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Camera ID, Junction, Dept..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 bg-police-950 border border-police-700/80 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                  />
                  {search && (
                    <button onClick={() => setSearch("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                  Operational Status
                </label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-police-950 border border-police-700/80 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Statuses</option>
                  <option value="ONLINE">🟢 Online (Nominal)</option>
                  <option value="DEGRADED">🟡 Degraded Feed</option>
                  <option value="OFFLINE">🔴 Offline</option>
                  <option value="ACTIVE_ALERT">🚨 Active Alert</option>
                </select>
              </div>

              {/* Camera Type Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                  Camera Architecture
                </label>
                <select
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-police-950 border border-police-700/80 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Architecture Types</option>
                  <option value="ANPR">ANPR (Automated Number Plate)</option>
                  <option value="PTZ">PTZ (Pan-Tilt-Zoom)</option>
                  <option value="Fixed">Fixed Bullet</option>
                  <option value="Traffic">Traffic / Toll Junction</option>
                  <option value="Public Area">Public Sector / Transit</option>
                </select>
              </div>

              {/* AI Capability Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                  AI Analytics Engine
                </label>
                <select
                  value={aiFilter}
                  onChange={(e) => setAiFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-police-950 border border-police-700/80 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All AI Modules</option>
                  <option value="Vehicle Detection">Vehicle Classification</option>
                  <option value="ANPR">ANPR / Deep OCR</option>
                  <option value="Multi-Object">Multi-Object Tracking</option>
                  <option value="Event Detection">Event Detection</option>
                  <option value="Speed">Speed Estimation</option>
                </select>
              </div>

              {/* Alert Mode Filter */}
              <div className="space-y-1">
                <label className="text-[10px] font-semibold uppercase text-slate-400 font-mono">
                  Watchlist Correlation
                </label>
                <select
                  value={alertFilter}
                  onChange={(e) => setAlertFilter(e.target.value)}
                  className="w-full px-2.5 py-1.5 bg-police-950 border border-police-700/80 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="ALL">All Cameras</option>
                  <option value="WITH_ALERTS">Only Cameras with Active Alerts</option>
                </select>
              </div>

              {/* Matching Cameras Quick-List */}
              <div className="pt-2 border-t border-police-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400">
                  <span>Matching Cameras</span>
                  <span className="font-mono text-cyan-400 font-bold">{filteredSpatialCameras.length}</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredSpatialCameras.slice(0, 20).map((cam) => {
                    const hasAlert = (cameraAlertsMap[cam.camera_id]?.length || 0) > 0 || cam.status === "active_alert"
                    return (
                      <div
                        key={cam.camera_id}
                        onClick={() => handleZoomToCamera(cam)}
                        className="p-1.5 rounded bg-police-950/80 hover:bg-police-800 border border-police-800/60 cursor-pointer flex items-center justify-between text-[11px] transition"
                      >
                        <div className="truncate mr-2">
                          <span className="font-mono font-bold text-white mr-1.5 uppercase">{cam.camera_id}</span>
                          <span className="text-slate-400">{cam.name}</span>
                        </div>
                        <span className={`w-2 h-2 rounded-full shrink-0 ${hasAlert ? "bg-red-500 animate-ping" : cam.status === "online" ? "bg-emerald-400" : "bg-amber-400"}`}></span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Reset Filters */}
            <div className="p-2.5 border-t border-police-800 bg-police-950 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">
                {spatialCameras.length} verified pins plotted
              </span>
              <button
                onClick={() => {
                  setSearch("")
                  setStatusFilter("ALL")
                  setTypeFilter("ALL")
                  setAiFilter("ALL")
                  setAlertFilter("ALL")
                }}
                className="text-[10px] text-cyan-400 hover:text-cyan-300 font-mono font-semibold"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* ── Map Canvas ─────────────────────────────────────────────────── */}
        <div className="flex-1 h-full relative">
          <MapContainer
            center={[22.8, 71.8]} // Centered on Gujarat
            zoom={8}
            className="w-full h-full z-0"
            style={{ background: "#060d1b" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> Voyager'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            <MapEventsHandler
              onZoomChange={setCurrentZoom}
              centerTarget={centerTarget}
              targetZoom={targetZoom}
            />

            {/* ── A. Regional Clusters (When Zoom < 11) ────────────────────── */}
            {currentZoom < 11 &&
              regionalClusters.map((cluster) => {
                const hasAlert = cluster.cameras.some(
                  (c) => (cameraAlertsMap[c.camera_id]?.length || 0) > 0 || c.status === "active_alert"
                )
                return (
                  <Marker
                    key={cluster.id}
                    position={[cluster.lat, cluster.lon]}
                    icon={createClusterIcon({
                      name: cluster.name,
                      count: cluster.cameras.length,
                      hasAlert,
                    })}
                    eventHandlers={{
                      click: () => handleClusterClick(cluster),
                    }}
                  >
                    <Popup className="custom-tactical-popup">
                      <div className="p-2 font-sans text-xs space-y-1">
                        <div className="font-bold text-police-900 uppercase font-mono">{cluster.name}</div>
                        <div className="text-[11px] text-slate-700">Cluster: {cluster.cameras.length} CCTV Cameras</div>
                        {hasAlert && <div className="text-[11px] font-bold text-red-600">🚨 Active Watchlist Match Detected!</div>}
                        <button
                          onClick={() => handleClusterClick(cluster)}
                          className="mt-1.5 w-full py-1 bg-police-800 text-white rounded text-[10px] font-semibold"
                        >
                          Zoom into Sector →
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}

            {/* ── B. Individual Camera Markers (When Zoom >= 11) ───────────── */}
            {currentZoom >= 11 &&
              filteredSpatialCameras.map((cam) => {
                const hasAlert = (cameraAlertsMap[cam.camera_id]?.length || 0) > 0 || cam.status === "active_alert"
                const isSelected = selectedCamera?.camera_id === cam.camera_id

                return (
                  <Marker
                    key={cam.camera_id}
                    position={[cam.latitude!, cam.longitude!]}
                    icon={createCameraIcon(cam.status, hasAlert, isSelected)}
                    eventHandlers={{
                      click: () => setSelectedCamera(cam),
                    }}
                  >
                    <Popup className="custom-tactical-popup">
                      <div className="p-2 font-sans text-xs space-y-1">
                        <div className="flex items-center justify-between font-mono font-bold text-police-900">
                          <span>{cam.camera_id.toUpperCase()}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded text-white ${hasAlert ? "bg-red-600" : "bg-emerald-700"}`}>
                            {hasAlert ? "ALERT" : cam.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="font-semibold text-slate-800">{cam.name}</div>
                        <div className="text-[10px] text-slate-600">{cam.location}</div>
                        <div className="pt-2 flex gap-1.5">
                          <button
                            onClick={() => setLiveStreamCamera(cam)}
                            className="flex-1 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-[10px] font-bold"
                          >
                            Watch Live
                          </button>
                          <button
                            onClick={() => setSelectedCamera(cam)}
                            className="flex-1 py-1 bg-police-800 hover:bg-police-700 text-white rounded text-[10px] font-medium"
                          >
                            Dossier
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}

            {/* ── C. Watchlist Alert Layer Pins ───────────────────────────── */}
            {showAlertsLayer &&
              alerts
                .filter((a) => a.camera_id)
                .map((alert) => {
                  const cam = cameras.find((c) => c.camera_id === alert.camera_id)
                  if (!cam || cam.latitude == null || cam.longitude == null) return null

                  // Offset slightly so it doesn't completely block the camera pin
                  const alertLat = cam.latitude + 0.0015
                  const alertLon = cam.longitude + 0.0015

                  return (
                    <Marker
                      key={alert.alert_id}
                      position={[alertLat, alertLon]}
                      icon={createAlertIcon()}
                      eventHandlers={{
                        click: () => setSelectedAlert(alert),
                      }}
                    >
                      <Popup className="custom-tactical-popup">
                        <div className="p-2 font-sans text-xs space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-bold text-red-700 uppercase">🚨 WATCHLIST ALERT</span>
                            <span className="text-[9px] px-1 bg-red-100 text-red-800 rounded font-bold font-mono">{alert.priority}</span>
                          </div>
                          <div className="font-mono font-black text-sm text-slate-900">{alert.registration_number}</div>
                          <div className="text-[11px] text-slate-700 font-semibold">{alert.category.replace(/_/g, " ")}</div>
                          <div className="text-[10px] text-slate-500 font-mono">Camera: {alert.camera_id} • Conf: {Math.round(alert.recognition_confidence * 100)}%</div>
                          <div className="flex gap-1 pt-1">
                            <button
                              onClick={() => setSelectedAlert(alert)}
                              className="flex-1 py-1 bg-red-700 text-white rounded text-[10px] font-bold"
                            >
                              Alert Intel
                            </button>
                            <button
                              onClick={() => navigate(`/vehicles/${encodeURIComponent(alert.registration_number)}`)}
                              className="px-2 py-1 bg-police-800 text-white rounded text-[10px]"
                            >
                              Investigate
                            </button>
                          </div>
                        </div>
                      </Popup>
                    </Marker>
                  )
                })}

            {/* ── D. Observation Sequence Mode Polyline & Checkpoints ─────── */}
            {sequenceData && (
              <>
                <Polyline
                  positions={sequenceData.polylineCoords}
                  pathOptions={{
                    color: "#3b82f6",
                    weight: 3.5,
                    dashArray: "6, 8",
                    opacity: 0.85,
                  }}
                />

                {sequenceData.points.map((pt, idx) => (
                  <Marker
                    key={`seq-${pt.camera_id}-${idx}`}
                    position={[pt.lat, pt.lon]}
                    icon={createSequenceIcon(idx + 1)}
                  >
                    <Popup className="custom-tactical-popup">
                      <div className="p-2 font-sans text-xs space-y-1">
                        <div className="font-bold text-blue-900 font-mono">
                          CHECKPOINT #{idx + 1}: {pt.camera_id.toUpperCase()}
                        </div>
                        <div className="text-slate-800 font-medium">{pt.name}</div>
                        {pt.pts_ms != null && (
                          <div className="text-[10px] text-slate-600 font-mono">
                            PTS: {(pt.pts_ms / 1000).toFixed(1)}s (Local Clock)
                          </div>
                        )}
                        <div className="text-[10px] text-emerald-700 font-mono">
                          Consensus Score: {Math.round(pt.consensus * 100)}%
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </>
            )}
          </MapContainer>

          {/* ── Tactical Map Legend (Bottom Right) ───────────────────────── */}
          <div className="absolute bottom-3 right-3 z-10 bg-police-950/90 backdrop-blur border border-police-800 p-2.5 rounded-lg text-[10px] font-mono space-y-1 shadow-xl">
            <div className="text-slate-300 font-bold border-b border-police-800 pb-1 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-3 h-3 text-cyan-400" />
              GIS Tactical Legend
            </div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1 pt-0.5">
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Online Pin</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Degraded Pin</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                <span>Offline Pin</span>
              </div>
              <div className="flex items-center gap-1.5 text-red-300">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Active Alert</span>
              </div>
              <div className="flex items-center gap-1.5 text-cyan-300">
                <span className="w-2.5 h-2.5 rounded-full border border-cyan-400 flex items-center justify-center text-[7px]">#</span>
                <span>Cluster Node</span>
              </div>
              <div className="flex items-center gap-1.5 text-blue-300">
                <span className="text-blue-400 font-bold font-mono">---</span>
                <span>Obs Sequence</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── 4. Slide-in Camera Intelligence Dossier Panel (Right) ──────── */}
        {selectedCamera && (
          <div className="w-80 sm:w-96 h-full bg-police-900/95 border-l border-police-800 flex flex-col shrink-0 z-20 backdrop-blur shadow-2xl">
            {/* Header */}
            <div className="p-3.5 border-b border-police-800 flex items-center justify-between bg-police-950/80">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-police-800 px-2 py-0.5 rounded border border-police-700 uppercase">
                  {selectedCamera.camera_id}
                </span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                  (cameraAlertsMap[selectedCamera.camera_id]?.length || 0) > 0 || selectedCamera.status === "active_alert"
                    ? "bg-red-950 text-red-300 border border-red-700"
                    : selectedCamera.status === "online"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-700"
                    : "bg-amber-950 text-amber-300 border border-amber-700"
                }`}>
                  {(cameraAlertsMap[selectedCamera.camera_id]?.length || 0) > 0 ? "🚨 ACTIVE ALERT" : selectedCamera.status.toUpperCase()}
                </span>
              </div>
              <button
                onClick={() => setSelectedCamera(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-police-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content Body */}
            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">{selectedCamera.name}</h3>
                <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-police-400 shrink-0" />
                  <span>{selectedCamera.location || "Gujarat Infrastructure Node"}</span>
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Coordinates: {selectedCamera.latitude?.toFixed(4)}° N, {selectedCamera.longitude?.toFixed(4)}° E
                </p>
              </div>

              {/* Hardware & Protocol Specs */}
              <div className="p-3 rounded-lg bg-police-950 border border-police-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  Hardware & Ingestion Spec
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div>
                    <span className="text-slate-500 block text-[9px]">TYPE</span>
                    <span className="text-white font-bold">{selectedCamera.camera_type || "Fixed"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">INGESTION</span>
                    <span className="text-cyan-400 font-bold">RTSP / TCP</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">RESOLUTION</span>
                    <span className="text-white">{selectedCamera.width || 1920}x{selectedCamera.height || 1080}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9px]">FPS</span>
                    <span className="text-white">{selectedCamera.fps || 30} FPS</span>
                  </div>
                </div>
              </div>

              {/* AI Analytics Capabilities */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">
                  AI Edge Capabilities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {(selectedCamera.ai_capabilities || ["Vehicle Detection", "ANPR"]).map((cap) => (
                    <span
                      key={cap}
                      className="px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-600/40 text-cyan-300 font-mono text-[10px]"
                    >
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              {/* Real Intelligence Indicators */}
              <div className="p-3 rounded-lg bg-police-950 border border-police-800 space-y-2">
                <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Intelligence Indicators</span>
                  <Activity className="w-3 h-3 text-emerald-400" />
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded bg-police-900 border border-police-800">
                    <span className="text-slate-500 block text-[9px]">ACTIVE ALERTS</span>
                    <span className={`text-base font-bold ${(cameraAlertsMap[selectedCamera.camera_id]?.length || 0) > 0 ? "text-red-400" : "text-slate-400"}`}>
                      {cameraAlertsMap[selectedCamera.camera_id]?.length || 0}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-police-900 border border-police-800">
                    <span className="text-slate-500 block text-[9px]">OBSERVATIONS</span>
                    <span className="text-base font-bold text-cyan-400">
                      {selectedCamera.observation_count || "Available"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Department Ownership */}
              <div className="text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Department:</span>
                  <span className="text-white font-medium">{selectedCamera.department}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Stream Status:</span>
                  <span className="text-emerald-400 font-mono">WHEP/HLS Ready</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2">
                <button
                  onClick={() => setLiveStreamCamera(selectedCamera)}
                  className="w-full py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold transition flex items-center justify-center gap-2 shadow-lg shadow-cyan-950/40"
                >
                  <Video className="w-4 h-4" />
                  View Live Video Stream
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => navigate(`/cameras/${selectedCamera.camera_id}`)}
                    className="py-1.5 bg-police-800 hover:bg-police-700 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Camera Dossier
                  </button>

                  <button
                    onClick={() => navigate(`/alerts?cameraId=${selectedCamera.camera_id}`)}
                    className="py-1.5 bg-police-800 hover:bg-police-700 text-white rounded-lg text-xs font-medium transition flex items-center justify-center gap-1.5"
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    View Alerts
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 5. Watchlist Alert Intelligence Card Modal (When Clicked) ──── */}
        {selectedAlert && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-police-950 border border-red-700 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl space-y-3">
              <div className="p-3.5 bg-red-950/80 border-b border-red-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-red-400" />
                  <span className="text-sm font-bold text-white font-mono">
                    WATCHLIST TARGET SIGHTING ({selectedAlert.alert_id})
                  </span>
                </div>
                <button onClick={() => setSelectedAlert(null)} className="text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-4 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-lg bg-police-900 border border-police-800">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-mono">REGISTRATION NUMBER</span>
                    <span className="text-xl font-black text-white font-mono tracking-wider">
                      {selectedAlert.registration_number}
                    </span>
                  </div>
                  <span className="px-2 py-1 rounded bg-red-900/80 text-red-200 font-mono font-bold text-[11px] border border-red-600">
                    {selectedAlert.category.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono text-[11px]">
                  <div>Camera ID: <strong className="text-white">{selectedAlert.camera_id}</strong></div>
                  <div>Priority: <strong className="text-red-400">{selectedAlert.priority}</strong></div>
                  <div>Confidence: <strong className="text-emerald-400">{Math.round(selectedAlert.recognition_confidence * 100)}%</strong></div>
                  <div>Status: <strong className="text-cyan-400">{selectedAlert.status}</strong></div>
                </div>

                {selectedAlert.evidence_image && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-slate-400 font-mono">Plate Evidence Crop:</span>
                    <div className="h-24 w-full bg-black rounded border border-police-700 flex items-center justify-center overflow-hidden">
                      <img
                        src={getEvidenceUrl(selectedAlert.evidence_image)}
                        alt="Plate evidence"
                        className="h-full object-contain"
                      />
                    </div>
                  </div>
                )}

                <div className="pt-2 flex gap-2">
                  <button
                    onClick={() => {
                      const cam = cameras.find((c) => c.camera_id === selectedAlert.camera_id)
                      if (cam) setLiveStreamCamera(cam)
                      setSelectedAlert(null)
                    }}
                    className="flex-1 py-2 bg-police-800 hover:bg-police-700 text-white rounded-lg text-xs font-semibold"
                  >
                    View Camera Stream
                  </button>
                  <button
                    onClick={() => {
                      navigate(`/vehicles/${encodeURIComponent(selectedAlert.registration_number)}`)
                      setSelectedAlert(null)
                    }}
                    className="flex-1 py-2 bg-red-700 hover:bg-red-600 text-white rounded-lg text-xs font-bold"
                  >
                    Investigate Vehicle →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── 6. Live HLS Stream Modal ────────────────────────────────────── */}
        {liveStreamCamera && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-police-950 border border-police-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
              <div className="p-3 border-b border-police-800 flex items-center justify-between bg-police-900/80">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-mono text-xs font-bold text-white bg-police-800 px-2 py-0.5 rounded uppercase">
                    {liveStreamCamera.camera_id}
                  </span>
                  <span className="text-sm font-semibold text-white truncate">{liveStreamCamera.name}</span>
                </div>
                <button
                  onClick={() => setLiveStreamCamera(null)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-police-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-[440px] w-full bg-black">
                <HlsPlayer
                  cameraId={liveStreamCamera.camera_id}
                  cameraName={liveStreamCamera.name}
                  autoPlay={true}
                  className="w-full h-full rounded-none"
                />
              </div>

              <div className="p-3 bg-police-950 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  RTSP over TCP ➔ WHEP/HLS Gateway Proxy
                </span>
                <button
                  onClick={() => {
                    navigate(`/cameras/${liveStreamCamera.camera_id}`)
                    setLiveStreamCamera(null)
                  }}
                  className="text-cyan-400 hover:text-cyan-300 font-mono font-medium underline"
                >
                  Open Full Diagnostic View →
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CameraMap
