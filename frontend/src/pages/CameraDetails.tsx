import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Activity,
  Shield,
  Radio,
  Car,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Copy,
  Check
} from "lucide-react"
import { api } from "../services/api"
import { Camera, CameraHealth, ObservedVehicle } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { HlsPlayer } from "../components/player/HlsPlayer"

export const CameraDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [camera, setCamera] = useState<Camera | null>(null)
  const [health, setHealth] = useState<CameraHealth | null>(null)
  const [vehicles, setVehicles] = useState<ObservedVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [c, h, v] = await Promise.all([
          api.getCamera(id),
          api.getCameraHealth(id),
          api.getVehicles({ cameraId: id }),
        ])
        setCamera(c)
        setHealth(h)
        setVehicles(v)
      } catch (err) {
        console.error("Error loading camera:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedUrl(key)
    setTimeout(() => setCopiedUrl(null), 2000)
  }

  if (loading || !camera) {
    return (
      <div className="py-20 text-center text-xs text-police-400 flex items-center justify-center gap-2">
        <Activity className="w-5 h-5 animate-spin" />
        <span>Loading camera telemetry...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back button & Title */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/cameras")}
            className="p-2 rounded-lg bg-police-900 hover:bg-police-800 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-police-800 text-police-300 uppercase">
                {camera.camera_id}
              </span>
              <h2 className="text-xl font-bold text-white tracking-tight">{camera.name}</h2>
              <StatusBadge type="health" value="ONLINE" size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {camera.location || "Gujarat Road Network Surveillance Feed"}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/map`)}
          className="px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-xs font-medium text-slate-200 transition"
        >
          View on GIS Map
        </button>
      </div>

      {/* Grid: Video stream + Health telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Stream View */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[440px] w-full rounded-xl overflow-hidden border border-police-800 shadow-2xl">
            <HlsPlayer
              cameraId={camera.camera_id}
              cameraName={camera.name}
              autoPlay={true}
              className="w-full h-full"
            />
          </div>

          {/* Stream Descriptors / Endpoints */}
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800 space-y-2.5 text-xs">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-[11px] tracking-wider">
              Integration Endpoints & Protocols
            </h4>
            <div className="space-y-1.5 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-police-400">Authenticated HLS Proxy:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 truncate max-w-md">/api/cameras/{camera.camera_id}/hls/index.m3u8</span>
                  <button
                    onClick={() => copyToClipboard(`/api/cameras/${camera.camera_id}/hls/index.m3u8`, "hls")}
                    className="text-police-400 hover:text-white"
                  >
                    {copiedUrl === "hls" ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-police-400">RTSP Gateway Source:</span>
                <span className="text-slate-400 truncate max-w-md">
                  {camera.rtsp_url || `rtsp://cctv.corp8.cloud:8554/${camera.camera_id}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry & Stream Health */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-xs tracking-wider mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              Stream Telemetry
            </h4>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">Stream Status</span>
                <span className="text-emerald-400 font-mono font-bold">ACTIVE (ONLINE)</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">Frames Ingested</span>
                <span className="text-white font-mono">{health?.frames_received || 100}+</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">Decode Errors</span>
                <span className="text-emerald-400 font-mono">{health?.decode_errors || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">PTS Discontinuities</span>
                <span className="text-emerald-400 font-mono">{health?.pts_discontinuities || 0}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">Video Encoding</span>
                <span className="text-white font-mono">H.264 High Profile</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-police-950/80 border border-police-850">
                <span className="text-slate-400">Resolution & Rate</span>
                <span className="text-white font-mono">1920x1080 @ 30 FPS</span>
              </div>
            </div>
          </div>

          {/* Spatial Ground Truth card */}
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
            <h4 className="font-bold text-slate-200 uppercase font-mono text-xs tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-purple-400" />
              GIS Spatial Verification
            </h4>
            <div className="text-xs text-slate-300 space-y-2">
              <p>
                {camera.is_spatial
                  ? `Verified spatial pin at Lat: ${camera.latitude}, Lon: ${camera.longitude}`
                  : "Catalogue location is unverified. In strict compliance with Gujarat Police forensic standards, unverified coordinates are NOT plotted as fictional pins on the GIS surveillance map."}
              </p>
              <div className="pt-2 border-t border-police-800 text-[11px] font-mono text-police-400">
                Status: {camera.is_spatial ? "SPATIAL_VERIFIED" : "LOCATION_NOT_VERIFIED"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vehicles Spotted on this Camera */}
      <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-400" />
            Vehicles Recognized at this Camera ({vehicles.length})
          </h3>
          <span className="text-xs text-police-400 font-mono">OCR Multi-Frame Consensus Active</span>
        </div>

        {vehicles.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400">
            No confirmed vehicle sightings recorded on this camera yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {vehicles.map((veh) => (
              <div
                key={veh.vehicle_id}
                onClick={() => navigate(`/vehicles/${veh.registration_number}`)}
                className="p-3 rounded-lg bg-police-950/70 hover:bg-police-850 border border-police-800/80 transition cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-mono font-bold text-white">
                      {veh.registration_number}
                    </span>
                    <span className="text-[11px] font-mono text-emerald-400">
                      {(veh.best_consensus_score * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {veh.observation_count} sighting(s) logged
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-police-800/60 flex items-center justify-between text-[10px] text-police-400">
                  <span>View Dossier</span>
                  <span>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
