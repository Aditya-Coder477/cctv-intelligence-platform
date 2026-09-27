import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Camera,
  Car,
  AlertOctagon,
  ShieldCheck,
  Activity,
  ArrowRight,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  MapPin,
  ChevronRight
} from "lucide-react"
import { api } from "../services/api"
import { DashboardStats, Camera as CameraType, Alert as AlertType } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { SeverityBadge } from "../components/common/SeverityBadge"
import { DataSourceBadge } from "../components/common/DataSourceBadge"
import { HlsPlayer } from "../components/player/HlsPlayer"
import { DataTable } from "../components/common/DataTable"

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [cameras, setCameras] = useState<CameraType[]>([])
  const [alerts, setAlerts] = useState<AlertType[]>([])
  const [selectedCameraId, setSelectedCameraId] = useState<string>("cam01")
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"LIVE" | "FALLBACK" | "UNAVAILABLE">("UNAVAILABLE")
  const navigate = useNavigate()

  const fetchDashboardData = async () => {
    try {
      const [s, c, a] = await Promise.allSettled([
        api.getDashboardStats(),
        api.getCameras(),
        api.getAlerts(),
      ])

      if (s.status === "fulfilled" && s.value) {
        setStats(s.value)
        setDataSource("LIVE")
      } else {
        setDataSource("FALLBACK")
      }

      if (c.status === "fulfilled" && Array.isArray(c.value) && c.value.length > 0) {
        setCameras(c.value)
        if (!selectedCameraId && c.value[0]?.camera_id) {
          setSelectedCameraId(c.value[0].camera_id)
        }
      }

      if (a.status === "fulfilled" && Array.isArray(a.value)) {
        setAlerts(a.value)
      }
    } catch (err) {
      console.error("Dashboard data load error:", err)
      setDataSource("FALLBACK")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 8000)
    return () => clearInterval(interval)
  }, [])

  // Filter urgent unhandled alerts requiring immediate operator intervention
  const unhandledAlerts = alerts.filter(
    (a) => a.status === "NEW" || a.status === "UNDER_REVIEW"
  )
  const criticalAlerts = unhandledAlerts.filter((a) => a.priority === "CRITICAL")
  const highAlerts = unhandledAlerts.filter((a) => a.priority === "HIGH")
  const urgentAlerts = [...criticalAlerts, ...highAlerts]
  const primaryAlert = urgentAlerts[0]

  const formatIST = (isoString?: string | null) => {
    if (!isoString) return null
    try {
      const d = new Date(isoString)
      if (isNaN(d.getTime())) return isoString
      return (
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(d) + " IST"
      )
    } catch {
      return isoString
    }
  }

  const selectedCamera = cameras.find((c) => c.camera_id === selectedCameraId) || cameras[0]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header: Operational Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Operational Overview
            </h1>
            <DataSourceBadge status={dataSource} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time surveillance monitoring and automated ANPR correlation across Gujarat Police jurisdiction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/videowall")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <Radio className="w-3.5 h-3.5 text-sky-400" />
            <span>Video Wall</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/map")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map</span>
          </button>
        </div>
      </div>

      {/* 2. Operational Summary Metrics (High Value, Real Backend Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Cameras Fleet */}
        <div
          onClick={() => navigate("/cameras")}
          className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] hover:border-sky-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Cameras Registered
              </span>
              <div className="text-2xl font-bold text-white mt-1 font-mono tabular-nums">
                {stats ? `${stats.online_cameras ?? 0} Online` : loading ? "ΓÇö" : "Data unavailable"}
              </div>
            </div>
            <div className="p-2 rounded bg-[#08101e] border border-[#1e3a6a] text-emerald-400">
              <Camera className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e3a6a]/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>
              {stats
                ? `${stats.degraded_cameras || 0} degraded ┬╖ ${stats.offline_cameras || 0} offline`
                : "Awaiting telemetry"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Metric 2: Active Alerts */}
        <div
          onClick={() => navigate("/alerts")}
          className={`p-4 rounded-lg border transition cursor-pointer flex flex-col justify-between ${
            (stats?.active_alerts ?? 0) > 0
              ? "bg-red-950/20 border-red-500/40 hover:border-red-500"
              : "bg-[#0b1528] border-[#1e3a6a] hover:border-sky-500/40"
          }`}
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Active Alerts
              </span>
              <div
                className={`text-2xl font-bold mt-1 font-mono tabular-nums ${
                  (stats?.active_alerts ?? 0) > 0 ? "text-red-300" : "text-white"
                }`}
              >
                {stats ? `${stats.active_alerts ?? 0} Requiring Action` : loading ? "ΓÇö" : "Data unavailable"}
              </div>
            </div>
            <div
              className={`p-2 rounded border ${
                (stats?.active_alerts ?? 0) > 0
                  ? "bg-red-950 border-red-500/40 text-red-400"
                  : "bg-[#08101e] border-[#1e3a6a] text-slate-400"
              }`}
            >
              <AlertOctagon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e3a6a]/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>
              {stats ? `${stats.critical_alerts || 0} critical priority` : "Awaiting alerts"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Metric 3: Vehicles Observed */}
        <div
          onClick={() => navigate("/vehicles")}
          className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] hover:border-sky-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Vehicles Observed
              </span>
              <div className="text-2xl font-bold text-white mt-1 font-mono tabular-nums">
                {stats?.total_observed_vehicles !== undefined
                  ? stats.total_observed_vehicles.toLocaleString()
                  : loading
                  ? "ΓÇö"
                  : "Data unavailable"}
              </div>
            </div>
            <div className="p-2 rounded bg-[#08101e] border border-[#1e3a6a] text-sky-400">
              <Car className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e3a6a]/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>
              {stats?.total_sightings !== undefined
                ? `${stats.total_sightings.toLocaleString()} track sightings`
                : "Tracking active"}
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>

        {/* Metric 4: Watchlist Targets */}
        <div
          onClick={() => navigate("/watchlist")}
          className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] hover:border-sky-500/40 transition cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
                Watchlist Targets
              </span>
              <div className="text-2xl font-bold text-white mt-1 font-mono tabular-nums">
                {stats?.active_watchlist_targets !== undefined
                  ? `${stats.active_watchlist_targets} Active`
                  : loading
                  ? "ΓÇö"
                  : "Data unavailable"}
              </div>
            </div>
            <div className="p-2 rounded bg-[#08101e] border border-[#1e3a6a] text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-[#1e3a6a]/60 text-[11px] text-slate-400 flex items-center justify-between font-mono">
            <span>Active suspect list</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
          </div>
        </div>
      </div>

      {/* 3. Attention Required (Level 1 Operational Alert Banner) */}
      {primaryAlert ? (
        <div className="p-4 sm:p-5 rounded-lg bg-red-950/30 border border-red-500/50 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-red-500/30 pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 status-pulse-dot" />
              <span className="text-xs font-bold font-mono tracking-wider uppercase text-red-300">
                ATTENTION REQUIRED ΓÇö ACTIVE INCIDENT
              </span>
            </div>
            <div className="flex items-center gap-2">
              <SeverityBadge severity={primaryAlert.priority} size="sm" />
              <span className="text-xs text-slate-400 font-mono">
                {formatIST(primaryAlert.matched_at_utc) || "Recent match"}
              </span>
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              {primaryAlert.evidence_url ? (
                <img
                  src={primaryAlert.evidence_url}
                  alt="Incident Evidence Plate"
                  className="w-24 h-14 object-cover rounded border border-red-500/40 bg-black shrink-0"
                  onError={(e) => {
                    ;(e.currentTarget as HTMLElement).style.display = "none"
                  }}
                />
              ) : (
                <div className="w-24 h-14 bg-red-950/60 border border-red-800 rounded flex items-center justify-center text-[10px] text-red-300 font-mono shrink-0">
                  PLATE CROP
                </div>
              )}

              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="text-base sm:text-lg font-bold font-mono text-white tracking-wider">
                    {primaryAlert.registration_number}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded bg-red-900/60 text-red-200 border border-red-700/60 font-semibold">
                    {primaryAlert.category.replace(/_/g, " ")}
                  </span>
                </div>
                <div className="text-xs text-slate-300 flex items-center gap-2">
                  <span>
                    Detected at:{" "}
                    <strong className="text-white font-mono uppercase">{primaryAlert.camera_id}</strong>
                  </span>
                  <span>ΓÇó</span>
                  <span>
                    Confidence:{" "}
                    <strong className="text-emerald-400 font-mono">
                      {(primaryAlert.recognition_confidence * 100).toFixed(0)}%
                    </strong>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => navigate(`/alerts/${primaryAlert.alert_id}`)}
                className="px-3.5 py-2 rounded bg-red-700 hover:bg-red-600 text-white text-xs font-semibold transition cursor-pointer flex items-center gap-1.5"
              >
                <span>View Alert</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => navigate(`/vehicles/${primaryAlert.registration_number}`)}
                className="px-3.5 py-2 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-red-500/40 text-red-200 text-xs font-semibold transition cursor-pointer"
              >
                Trace Vehicle
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-3.5 rounded-lg bg-[#08101e] border border-[#1e3a6a]/60 flex items-center justify-between text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">
              Surveillance normal ΓÇö No unhandled critical incidents currently requiring intervention.
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate("/alerts")}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            Review all alerts ΓåÆ
          </button>
        </div>
      )}

      {/* 4. Core Operational Grid: Live Spotlight + Operational Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live Camera Stream & Quick Selector */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-sky-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
                Live Feed: {selectedCamera?.name || selectedCameraId.toUpperCase()}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-slate-400">
                Camera ID: <strong className="text-white uppercase">{selectedCamera?.camera_id || selectedCameraId}</strong>
              </span>
              <StatusBadge type="health" value={selectedCamera?.status || "ONLINE"} size="sm" />
            </div>
          </div>

          {/* Primary Video Container */}
          <div className="h-[360px] sm:h-[400px] w-full rounded-lg overflow-hidden border border-[#1e3a6a] bg-black shadow-lg">
            <HlsPlayer
              cameraId={selectedCamera?.camera_id || "cam01"}
              cameraName={selectedCamera?.name || "Surveillance Feed"}
              autoPlay={true}
              className="w-full h-full"
            />
          </div>

          {/* Camera Quick Switcher Row */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            {cameras.slice(0, 6).map((cam) => {
              const isSelected = (selectedCamera?.camera_id || selectedCameraId) === cam.camera_id
              return (
                <button
                  key={cam.camera_id}
                  type="button"
                  onClick={() => setSelectedCameraId(cam.camera_id)}
                  className={`px-3 py-1.5 rounded border text-xs font-mono transition text-left shrink-0 cursor-pointer ${
                    isSelected
                      ? "bg-[#132442] border-sky-400 text-white font-semibold"
                      : "bg-[#0b1528] border-[#1e3a6a] text-slate-300 hover:text-white hover:bg-[#0f1c35]"
                  }`}
                >
                  <div className="font-bold uppercase">{cam.camera_id}</div>
                  <div className="text-[10px] text-slate-400 truncate max-w-[120px]">
                    {cam.location || cam.name}
                  </div>
                </button>
              )
            })}
            <button
              type="button"
              onClick={() => navigate("/cameras")}
              className="px-3 py-2 rounded bg-[#08101e] border border-[#1e3a6a] text-xs text-sky-400 hover:text-white shrink-0"
            >
              All Cameras ΓåÆ
            </button>
          </div>
        </div>

        {/* Right Col: Recent Activity (Operational Event Feed) */}
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a6a]/60">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                  Recent Activity Feed
                </h3>
              </div>
              <button
                type="button"
                onClick={() => navigate("/vehicles")}
                className="text-xs text-sky-400 hover:text-sky-300 font-medium"
              >
                Vehicle Registry ΓåÆ
              </button>
            </div>

            {/* Event List */}
            <div className="space-y-2 mt-3 max-h-[420px] overflow-y-auto pr-1">
              {stats?.recent_anpr_observations && stats.recent_anpr_observations.length > 0 ? (
                stats.recent_anpr_observations.slice(0, 8).map((obs) => {
                  const ptsSec = obs.first_seen_pts_ms ? (obs.first_seen_pts_ms / 1000).toFixed(1) : null
                  return (
                    <div
                      key={obs.observation_id}
                      onClick={() => navigate(`/vehicles/${obs.registration_number}`)}
                      className="p-2.5 rounded bg-[#08101e] hover:bg-[#0f1c35] border border-[#1e3a6a]/50 hover:border-sky-500/40 transition cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {obs.evidence_url ? (
                          <img
                            src={obs.evidence_url}
                            alt="Plate Evidence"
                            className="w-10 h-6 object-cover rounded border border-[#1e3a6a] bg-black shrink-0"
                            onError={(e) => {
                              ;(e.currentTarget as HTMLElement).style.display = "none"
                            }}
                          />
                        ) : (
                          <div className="w-10 h-6 bg-[#050b14] rounded border border-[#1e3a6a] flex items-center justify-center text-[9px] font-mono text-slate-500 shrink-0">
                            ANPR
                          </div>
                        )}
                        <div className="min-w-0 truncate">
                          <div className="text-xs font-mono font-bold text-white group-hover:text-sky-300 transition truncate">
                            {obs.registration_number}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono truncate">
                            {obs.camera_id} {ptsSec ? `ΓÇó PTS ${ptsSec}s` : ""}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-xs font-mono font-semibold text-emerald-400">
                          {(obs.consensus_score * 100).toFixed(0)}%
                        </div>
                        <div className="text-[9px] text-slate-500 font-mono">Consensus</div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-xs text-slate-400 text-center py-10 font-mono">
                  No recent vehicle detections recorded.
                </div>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#1e3a6a]/60 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>OCR Consensus Threshold:</span>
            <span className="text-emerald-400 font-semibold">Active (0.05 min)</span>
          </div>
        </div>
      </div>

      {/* 5. Camera Status Table (Compact, Operational, No Card-itis) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Surveillance Camera Nodes
            </h3>
            <p className="text-xs text-slate-400">
              Live operational status and analytics configuration for registered endpoints
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/cameras")}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            View all {cameras.length} cameras ΓåÆ
          </button>
        </div>

        <DataTable
          columns={[
            { key: "camera_id", label: "Camera ID", width: "120px" },
            { key: "name", label: "Name & Location" },
            { key: "status", label: "Status", width: "110px" },
            { key: "stream", label: "Protocol", width: "100px" },
            { key: "analytics", label: "Analytics Active", width: "150px" },
            { key: "actions", label: "Actions", align: "right", width: "110px" },
          ]}
          isEmpty={cameras.length === 0}
          emptyTitle="No cameras registered"
          emptyDescription="Camera endpoints will appear once registered in the central catalogue."
        >
          {cameras.slice(0, 6).map((cam) => (
            <tr
              key={cam.camera_id}
              onClick={() => navigate(`/cameras/${cam.camera_id}`)}
              className="hover:bg-[#0f1c35]/80 transition cursor-pointer border-b border-[#1e3a6a]/40"
            >
              <td className="py-2.5 px-3 font-mono font-bold text-white uppercase text-xs">
                {cam.camera_id}
              </td>
              <td className="py-2.5 px-3 text-xs">
                <div className="font-medium text-slate-200">{cam.name}</div>
                <div className="text-[11px] text-slate-400">{cam.location || "Gujarat Road Network"}</div>
              </td>
              <td className="py-2.5 px-3">
                <StatusBadge type="health" value={cam.status || "ONLINE"} size="sm" />
              </td>
              <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                {cam.codec ? `${cam.codec.toUpperCase()} / HLS` : "HLS"}
              </td>
              <td className="py-2.5 px-3 text-[11px] font-mono text-emerald-400">
                ANPR ΓÇó Vehicle Track
              </td>
              <td className="py-2.5 px-3 text-right">
                <span className="text-xs text-sky-400 font-semibold hover:underline">
                  View Console ΓåÆ
                </span>
              </td>
            </tr>
          ))}
        </DataTable>
      </div>
    </div>
  )
}
