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
  X
} from "lucide-react"
import { api } from "../services/api"
import { Camera } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { HlsPlayer } from "../components/player/HlsPlayer"
import { FALLBACK_CAMERAS } from "../data/fallbackData"

export const Cameras: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [search, setSearch] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")
  const [loading, setLoading] = useState(true)
  const [previewCamera, setPreviewCamera] = useState<Camera | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await api.getCameras()
        if (Array.isArray(data) && data.length > 0) {
          setCameras(data)
        } else {
          setCameras(FALLBACK_CAMERAS)
        }
      } catch (err) {
        console.error("Error fetching cameras, using fallback:", err)
        setCameras(FALLBACK_CAMERAS)
      } finally {
        setLoading(false)
      }
    }
    fetchCameras()
  }, [])

  const filteredCameras = cameras.filter((cam) => {
    const s = search.toLowerCase().trim()
    if (!s) return true
    return (
      cam.camera_id.toLowerCase().includes(s) ||
      cam.name.toLowerCase().includes(s) ||
      (cam.location && cam.location.toLowerCase().includes(s))
    )
  })

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <CameraIcon className="w-5 h-5 text-police-400" />
            CCTV Camera Inventory
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Centrally registered Sentinel surveillance cameras with authenticated HLS stream proxying
          </p>
        </div>

        {/* View toggle */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-police-900 border border-police-800 rounded-lg">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded text-xs ${viewMode === "grid" ? "bg-police-750 text-white" : "text-slate-400 hover:text-white"}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded text-xs ${viewMode === "table" ? "bg-police-750 text-white" : "text-slate-400 hover:text-white"}`}
              title="Table View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={() => navigate("/videowall")}
            className="flex items-center gap-1.5 px-3 py-2 bg-police-700 hover:bg-police-600 rounded-lg text-xs font-semibold text-white transition"
          >
            <Video className="w-4 h-4 text-red-400" />
            Video Wall
          </button>
        </div>
      </div>

      {/* Filter / Search bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-police-900/60 border border-police-800 rounded-xl">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-police-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by camera ID (e.g. cam01) or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-police-950/80 border border-police-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-police-400"
          />
        </div>
        <div className="text-xs text-police-400 font-mono shrink-0">
          Showing {filteredCameras.length} of {cameras.length} cameras
        </div>
      </div>

      {/* Cameras Content */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading CCTV camera inventory...</div>
      ) : filteredCameras.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">No cameras match your search query.</div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCameras.map((cam) => (
            <div
              key={cam.camera_id}
              className="p-4 rounded-xl bg-police-900/50 hover:bg-police-900 border border-police-800 hover:border-police-600/60 transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-police-300 uppercase tracking-wider">
                    {cam.camera_id}
                  </span>
                  <StatusBadge type="health" value="ONLINE" size="sm" />
                </div>
                <h4 className="text-sm font-semibold text-white line-clamp-1 group-hover:text-police-300 transition">
                  {cam.name}
                </h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                  {cam.location || "Gujarat Road Network"}
                </p>

                {/* Spatial & resolution details */}
                <div className="mt-3 pt-2 border-t border-police-800/80 space-y-1 text-[11px] font-mono text-slate-400">
                  <div className="flex justify-between">
                    <span>Stream:</span>
                    <span className="text-slate-200">{cam.width || 1920}x{cam.height || 1080} @ {cam.fps || 30}fps</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Coordinates:</span>
                    {cam.is_spatial ? (
                      <span className="text-emerald-400">Verified</span>
                    ) : (
                      <span className="text-amber-400/80">Unverified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-3 border-t border-police-800/80 flex items-center gap-2">
                <button
                  onClick={() => setPreviewCamera(cam)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-1.5 bg-police-800 hover:bg-police-700 rounded text-xs font-medium text-white transition"
                >
                  <Play className="w-3.5 h-3.5 text-police-400" />
                  Live Stream
                </button>
                <button
                  onClick={() => navigate(`/cameras/${cam.camera_id}`)}
                  className="p-1.5 bg-police-850 hover:bg-police-750 text-slate-300 rounded hover:text-white transition"
                  title="Camera Details"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="overflow-x-auto rounded-xl border border-police-800 bg-police-900/40">
          <table className="w-full text-left text-xs">
            <thead className="bg-police-950/80 border-b border-police-800 text-police-300 uppercase font-mono tracking-wider">
              <tr>
                <th className="py-3 px-4">Camera ID</th>
                <th className="py-3 px-4">Location Name</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Resolution</th>
                <th className="py-3 px-4">GIS Coordinates</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-police-800/60 font-sans">
              {filteredCameras.map((cam) => (
                <tr key={cam.camera_id} className="hover:bg-police-850/50 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">{cam.camera_id}</td>
                  <td className="py-3 px-4 text-slate-200 font-medium">{cam.name}</td>
                  <td className="py-3 px-4">
                    <StatusBadge type="health" value="ONLINE" size="sm" />
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    {cam.width || 1920}x{cam.height || 1080}
                  </td>
                  <td className="py-3 px-4 font-mono">
                    {cam.is_spatial ? (
                      <span className="text-emerald-400">Verified</span>
                    ) : (
                      <span className="text-amber-400/80">Location unverified</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      onClick={() => setPreviewCamera(cam)}
                      className="px-2 py-1 rounded bg-police-800 hover:bg-police-700 text-slate-200 font-medium transition"
                    >
                      Stream
                    </button>
                    <button
                      onClick={() => navigate(`/cameras/${cam.camera_id}`)}
                      className="px-2 py-1 rounded bg-police-750 hover:bg-police-650 text-white font-medium transition"
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Quick Live Preview Modal */}
      {previewCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-police-900 border border-police-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-3 border-b border-police-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-police-800 px-2 py-0.5 rounded">
                  {previewCamera.camera_id.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-white">{previewCamera.name}</span>
              </div>
              <button
                onClick={() => setPreviewCamera(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-police-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[420px] w-full">
              <HlsPlayer
                cameraId={previewCamera.camera_id}
                cameraName={previewCamera.name}
                autoPlay={true}
                className="w-full h-full rounded-none"
              />
            </div>
            <div className="p-3 bg-police-950 flex items-center justify-between text-xs text-slate-400">
              <span>HLS Gateway Proxy via Authenticated Session</span>
              <button
                onClick={() => navigate(`/cameras/${previewCamera.camera_id}`)}
                className="text-police-400 hover:text-white underline"
              >
                Open Full Camera Dossier →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
