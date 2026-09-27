import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Camera as CameraIcon,
  Search,
  Filter,
  Grid,
  List as ListIcon,
  Play,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Video,
  X,
  Activity,
  ArrowRight,
  Radio,
  MapPin
} from "lucide-react"
import { api } from "../services/api"
import { Camera } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { DataSourceBadge } from "../components/common/DataSourceBadge"
import { DataTable } from "../components/common/DataTable"
import { EmptyState } from "../components/common/EmptyState"
import { HlsPlayer } from "../components/player/HlsPlayer"
import { FALLBACK_CAMERAS } from "../data/fallbackData"

export const Cameras: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [viewMode, setViewMode] = useState<"table" | "grid">("table")
  const [loading, setLoading] = useState(true)
  const [previewCamera, setPreviewCamera] = useState<Camera | null>(null)
  const [dataSource, setDataSource] = useState<"LIVE" | "FALLBACK">("LIVE")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await api.getCameras()
        if (Array.isArray(data) && data.length > 0) {
          setCameras(data)
          setDataSource("LIVE")
        } else {
          setCameras(FALLBACK_CAMERAS)
          setDataSource("FALLBACK")
        }
      } catch (err) {
        console.error("Error fetching cameras, using fallback:", err)
        setCameras(FALLBACK_CAMERAS)
        setDataSource("FALLBACK")
      } finally {
        setLoading(false)
      }
    }
    fetchCameras()
  }, [])

  // Dynamic counts based on actual camera state
  const onlineCount = cameras.filter(
    (c) => (c.status || "ONLINE").toUpperCase() === "ONLINE" || (c.status || "").toUpperCase() === "ACTIVE"
  ).length
  const degradedCount = cameras.filter(
    (c) => (c.status || "").toUpperCase() === "DEGRADED" || (c.status || "").toUpperCase() === "WARNING"
  ).length
  const offlineCount = cameras.length - onlineCount - degradedCount

  const filteredCameras = cameras.filter((cam) => {
    const s = search.toLowerCase().trim()
    const matchesSearch =
      !s ||
      cam.camera_id.toLowerCase().includes(s) ||
      cam.name.toLowerCase().includes(s) ||
      (cam.location && cam.location.toLowerCase().includes(s))

    if (!matchesSearch) return false

    if (statusFilter === "ALL") return true
    const currentStatus = (cam.status || "ONLINE").toUpperCase()
    if (statusFilter === "ONLINE") return currentStatus === "ONLINE" || currentStatus === "ACTIVE"
    if (statusFilter === "DEGRADED") return currentStatus === "DEGRADED" || currentStatus === "WARNING"
    if (statusFilter === "OFFLINE") return currentStatus !== "ONLINE" && currentStatus !== "ACTIVE" && currentStatus !== "DEGRADED" && currentStatus !== "WARNING"

    return true
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Dynamic Counts */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <CameraIcon className="w-5 h-5 text-sky-400" />
              Surveillance Camera Registry
            </h1>
            <DataSourceBadge status={dataSource} size="sm" />
          </div>
          <div className="text-xs text-slate-400 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono">
            <span className="text-white font-semibold">{cameras.length} Total Nodes</span>
            <span>ΓÇó</span>
            <span className="text-emerald-400 font-bold">{onlineCount} Online</span>
            <span>ΓÇó</span>
            <span className="text-amber-400">{degradedCount} Degraded</span>
            <span>ΓÇó</span>
            <span className="text-slate-400">{Math.max(0, offlineCount)} Offline</span>
          </div>
        </div>

        {/* Action shortcuts */}
        <div className="flex items-center gap-2">
          {/* Table vs Grid toggle */}
          <div className="flex items-center p-0.5 bg-[#08101e] border border-[#1e3a6a] rounded-md">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                viewMode === "table" ? "bg-[#132442] text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Operational Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded text-xs transition cursor-pointer ${
                viewMode === "grid" ? "bg-[#132442] text-white" : "text-slate-400 hover:text-white"
              }`}
              title="Visual Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => navigate("/map")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] rounded-md text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/videowall")}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] rounded-md text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span>Video Wall</span>
          </button>
        </div>
      </div>

      {/* 2. Search & Filter Controls */}
      <div className="p-3 bg-[#0b1528] border border-[#1e3a6a] rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by Camera ID (e.g. cam01) or location name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#08101e] border border-[#1e3a6a] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by operational status"
            className="bg-[#08101e] text-white border border-[#1e3a6a] rounded px-3 py-1.5 text-xs font-mono focus:outline-none cursor-pointer"
          >
            <option value="ALL">All Statuses ({cameras.length})</option>
            <option value="ONLINE">Online ({onlineCount})</option>
            <option value="DEGRADED">Degraded ({degradedCount})</option>
            <option value="OFFLINE">Offline ({Math.max(0, offlineCount)})</option>
          </select>

          <span className="text-xs text-slate-400 font-mono whitespace-nowrap pl-2">
            Showing {filteredCameras.length} nodes
          </span>
        </div>
      </div>

      {/* 3. Cameras List / Table */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-mono">
          Loading camera infrastructure registry...
        </div>
      ) : filteredCameras.length === 0 ? (
        <EmptyState
          title="No cameras match search query"
          description="Try clearing your search criteria or resetting the operational status filter."
        />
      ) : viewMode === "table" ? (
        <DataTable
          columns={[
            { key: "camera_id", label: "Camera ID", width: "130px" },
            { key: "name", label: "Name & Location" },
            { key: "status", label: "Status", width: "120px" },
            { key: "stream", label: "Stream Protocol", width: "120px" },
            { key: "analytics", label: "Analytics Active", width: "160px" },
            { key: "actions", label: "Actions", align: "right", width: "160px" },
          ]}
          isEmpty={filteredCameras.length === 0}
        >
          {filteredCameras.map((cam) => {
            const status = cam.status || "ONLINE"
            return (
              <tr
                key={cam.camera_id}
                onClick={() => navigate(`/cameras/${cam.camera_id}`)}
                className="hover:bg-[#0f1c35]/80 transition cursor-pointer border-b border-[#1e3a6a]/40 group"
              >
                <td className="py-2.5 px-3 font-mono font-bold text-white uppercase text-xs">
                  {cam.camera_id}
                </td>
                <td className="py-2.5 px-3 text-xs">
                  <div className="font-semibold text-slate-200 group-hover:text-sky-300 transition">
                    {cam.name}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {cam.location || "Gujarat Road Network Surveillance Feed"}
                  </div>
                </td>
                <td className="py-2.5 px-3">
                  <StatusBadge type="health" value={status} size="sm" />
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-slate-300">
                  {cam.codec ? `${cam.codec.toUpperCase()} / HLS` : "HLS / RTSP"}
                </td>
                <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-400">
                  ANPR ΓÇó Vehicle Track
                </td>
                <td className="py-2.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setPreviewCamera(cam)
                      }}
                      title="Quick Live Preview"
                      className="px-2 py-1 rounded bg-[#08101e] hover:bg-[#132442] border border-[#1e3a6a] text-sky-400 text-xs font-semibold transition"
                    >
                      <Play className="w-3 h-3" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/cameras/${cam.camera_id}`)}
                      className="text-xs text-sky-400 hover:text-white font-semibold flex items-center gap-1"
                    >
                      <span>Console</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </DataTable>
      ) : (
        /* Visual Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCameras.map((cam) => {
            const status = cam.status || "ONLINE"
            return (
              <div
                key={cam.camera_id}
                className="p-4 rounded-lg bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] hover:border-sky-500/40 transition flex flex-col justify-between group cursor-pointer"
                onClick={() => navigate(`/cameras/${cam.camera_id}`)}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-sky-400 uppercase tracking-wider">
                      {cam.camera_id}
                    </span>
                    <StatusBadge type="health" value={status} size="sm" />
                  </div>
                  <h2 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-sky-300 transition">
                    {cam.name}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                    {cam.location || "Gujarat Road Network Surveillance Feed"}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#1e3a6a]/60 flex items-center justify-between text-xs text-slate-400 font-mono">
                  <span>ANPR Active</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      setPreviewCamera(cam)
                    }}
                    className="p-1 rounded bg-[#08101e] hover:bg-[#132442] border border-[#1e3a6a] text-sky-400"
                    title="Live Stream Preview"
                  >
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4. Stream Preview Modal */}
      {previewCamera && (
        <div
          onClick={() => setPreviewCamera(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-3xl w-full bg-[#0b1528] border border-[#1e3a6a] rounded-lg p-4 shadow-2xl space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-white uppercase text-xs">
                  {previewCamera.camera_id}
                </span>
                <span className="text-slate-500">┬╖</span>
                <span className="text-xs text-slate-200 font-medium">
                  {previewCamera.name}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCamera(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="h-[360px] bg-black rounded overflow-hidden border border-[#1e3a6a]">
              <HlsPlayer
                cameraId={previewCamera.camera_id}
                cameraName={previewCamera.name}
                autoPlay={true}
                className="w-full h-full"
              />
            </div>

            <div className="flex items-center justify-between pt-1 text-xs">
              <span className="text-slate-400 font-mono">
                {previewCamera.location || "Gujarat Road Network"}
              </span>
              <button
                type="button"
                onClick={() => navigate(`/cameras/${previewCamera.camera_id}`)}
                className="text-xs text-sky-400 hover:text-white font-semibold flex items-center gap-1"
              >
                <span>Full Camera Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
