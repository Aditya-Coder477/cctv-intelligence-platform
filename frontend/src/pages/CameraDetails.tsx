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
  Check,
  MapPin,
  ExternalLink,
  Clock,
  Video
} from "lucide-react"
import { api } from "../services/api"
import { Camera, CameraHealth, ObservedVehicle } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { HlsPlayer } from "../components/player/HlsPlayer"
import { DataTable } from "../components/common/DataTable"

import { FALLBACK_CAMERAS, FALLBACK_VEHICLES } from "../data/fallbackData"
import { EmptyState } from "../components/common/EmptyState"

export const CameraDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [camera, setCamera] = useState<Camera | null>(null)
  const [health, setHealth] = useState<CameraHealth | null>(null)
  const [vehicles, setVehicles] = useState<ObservedVehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    const fetchData = async () => {
      try {
        const [c, h, v] = await Promise.allSettled([
          api.getCamera(id),
          api.getCameraHealth(id),
          api.getVehicles({ cameraId: id }),
        ])

        if (c.status === "fulfilled" && c.value) {
          setCamera(c.value)
        } else {
          const fallbackCam = FALLBACK_CAMERAS.find(
            (cam) => cam.camera_id.toLowerCase() === id.toLowerCase()
          )
          if (fallbackCam) setCamera(fallbackCam)
        }

        if (h.status === "fulfilled" && h.value) {
          setHealth(h.value)
        }

        if (v.status === "fulfilled" && Array.isArray(v.value) && v.value.length > 0) {
          setVehicles(v.value)
        } else {
          const fallbackVehs = FALLBACK_VEHICLES.filter((veh) =>
            veh.cameras.some((cid) => cid.toLowerCase() === id.toLowerCase())
          )
          if (fallbackVehs.length > 0) setVehicles(fallbackVehs)
        }
      } catch (err) {
        console.error("Error loading camera:", err)
        const fallbackCam = FALLBACK_CAMERAS.find(
          (cam) => cam.camera_id.toLowerCase() === id.toLowerCase()
        )
        if (fallbackCam) setCamera(fallbackCam)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

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

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400 font-mono">
        Loading camera node console...
      </div>
    )
  }

  if (!camera) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <EmptyState
          title="Camera node not found"
          description={`No registered camera endpoint matches ID "${id}".`}
          action={{
            label: "Return to Camera Registry",
            onClick: () => navigate("/cameras"),
          }}
        />
      </div>
    )
  }

  const status = camera.status || "ONLINE"
  const recentVehicle = vehicles[0]
  const lastEventTime =
    formatIST(recentVehicle?.last_seen?.source_time || recentVehicle?.updated_at_utc) ||
    "Continuous ingestion active"

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/cameras")}
            className="p-2 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#132442] text-sky-400 border border-sky-500/40 uppercase">
                {camera.camera_id}
              </span>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {camera.name}
              </h1>
              <StatusBadge type="health" value={status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {camera.location || "Gujarat Road Network Surveillance Checkpoint"} ΓÇó Department: {camera.department || "Traffic Enforcement"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/map?camera=${encodeURIComponent(camera.camera_id)}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map View</span>
          </button>
          <button
            type="button"
            onClick={() => navigate("/videowall")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#132442] hover:bg-[#1a3159] border border-sky-500/40 text-xs font-semibold text-sky-200 transition cursor-pointer"
          >
            <Video className="w-3.5 h-3.5 text-sky-400" />
            <span>Video Wall</span>
          </button>
        </div>
      </div>

      {/* 2. Primary Video Stream + Operational Overview Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Video Feed Player */}
        <div className="lg:col-span-2 space-y-3">
          <div className="h-[420px] w-full rounded-lg overflow-hidden border border-[#1e3a6a] bg-black shadow-lg">
            <HlsPlayer
              cameraId={camera.camera_id}
              cameraName={camera.name}
              autoPlay={true}
              className="w-full h-full"
            />
          </div>

          {/* Stream Technical Integration Endpoints */}
          <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-2 text-xs">
            <h2 className="font-bold text-slate-200 uppercase font-mono text-[11px] tracking-wider">
              Integration Endpoints & Protocols
            </h2>
            <div className="space-y-2 font-mono text-[11px]">
              <div className="flex items-center justify-between p-2.5 rounded bg-[#08101e] border border-[#1e3a6a]/60">
                <span className="text-slate-400">Authenticated HLS Stream:</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-200 truncate max-w-sm sm:max-w-md">
                    /api/cameras/{camera.camera_id}/hls/index.m3u8
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      copyToClipboard(`/api/cameras/${camera.camera_id}/hls/index.m3u8`, "hls")
                    }
                    className="p-1 text-slate-400 hover:text-white"
                    title="Copy URL"
                  >
                    {copiedKey === "hls" ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-[#08101e] border border-[#1e3a6a]/60">
                <span className="text-slate-400">RTSP Gateway Source:</span>
                <span className="text-slate-400 truncate max-w-sm sm:max-w-md">
                  {camera.rtsp_url || `rtsp://cctv.corp8.cloud:8554/${camera.camera_id}`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Consolidated Node Operational Summary */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <Activity className="w-4 h-4 text-sky-400" />
              <span>Node Technical Status</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/40">
                <span className="text-slate-400">Status:</span>
                <StatusBadge type="health" value={status} size="sm" />
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/40">
                <span className="text-slate-400">Stream Protocol:</span>
                <span className="text-white font-mono font-semibold">
                  {camera.codec ? `${camera.codec.toUpperCase()} / HLS` : "HLS / RTSP"}
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/40">
                <span className="text-slate-400">Analytics Active:</span>
                <span className="text-emerald-400 font-semibold font-mono">
                  ANPR ΓÇó Vehicle Track
                </span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/40">
                <span className="text-slate-400">Last Observation:</span>
                <span className="text-white font-mono">{lastEventTime}</span>
              </div>

              <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/40">
                <span className="text-slate-400">Resolution:</span>
                <span className="text-slate-300 font-mono">
                  {camera.width && camera.height ? `${camera.width}x${camera.height}` : "1080p Full HD"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-400">Decode Errors:</span>
                <span className="text-slate-300 font-mono">
                  {health ? health.decode_errors : 0}
                </span>
              </div>
            </div>
          </div>

          {/* GPS Coordinates & Jurisdiction */}
          <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-2 text-xs font-mono">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Geographic Coordinates
            </span>
            <div className="text-slate-200">
              Latitude: {camera.latitude ?? "23.0225┬░ N"}
            </div>
            <div className="text-slate-200">
              Longitude: {camera.longitude ?? "72.5714┬░ E"}
            </div>
            <div className="text-[11px] text-slate-400 pt-1 border-t border-[#1e3a6a]/40">
              Jurisdiction: Ahmedabad & Gandhinagar Police Command
            </div>
          </div>
        </div>
      </div>

      {/* 3. Recent ANPR Observations at this Camera */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Recent Observations at {camera.camera_id.toUpperCase()} ({vehicles.length})
            </h2>
            <p className="text-xs text-slate-400">
              Vehicles detected and recognized by the ANPR edge pipeline on this camera
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/vehicles")}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold"
          >
            Search all vehicles ΓåÆ
          </button>
        </div>

        <DataTable
          columns={[
            { key: "plate", label: "Registration Plate", width: "160px" },
            { key: "time", label: "Last Seen", width: "180px" },
            { key: "consensus", label: "Consensus Score", width: "140px" },
            { key: "sightings", label: "Observations", width: "120px" },
            { key: "actions", label: "Actions", align: "right", width: "140px" },
          ]}
          isEmpty={vehicles.length === 0}
          emptyTitle="No recent detections on this camera"
          emptyDescription="Vehicle sightings detected by this camera's ANPR pipeline will be listed here."
        >
          {vehicles.slice(0, 10).map((veh) => {
            const time = formatIST(veh.last_seen?.source_time || veh.updated_at_utc)
            return (
              <tr
                key={veh.vehicle_id}
                onClick={() => navigate(`/vehicles/${veh.registration_number}`)}
                className="hover:bg-[#0f1c35]/80 transition cursor-pointer border-b border-[#1e3a6a]/40 group"
              >
                <td className="py-2.5 px-3">
                  <div className="inline-flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow-sm">
                    <div className="bg-blue-800 px-1 py-0.5 text-[8px] font-bold text-white leading-none">
                      IND
                    </div>
                    <div className="px-2 py-0.5 font-mono text-xs font-bold text-slate-900 uppercase">
                      {veh.registration_number}
                    </div>
                  </div>
                </td>
                <td className="py-2.5 px-3 font-mono text-xs text-slate-300">
                  {time || "Recorded"}
                </td>
                <td className="py-2.5 px-3 font-mono text-xs text-emerald-400 font-bold">
                  {(veh.best_consensus_score * 100).toFixed(1)}%
                </td>
                <td className="py-2.5 px-3 font-mono text-xs text-slate-300">
                  {veh.observation_count} times
                </td>
                <td className="py-2.5 px-3 text-right">
                  <span className="text-xs text-sky-400 font-semibold group-hover:underline flex items-center justify-end gap-1">
                    <span>Dossier</span>
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            )
          })}
        </DataTable>
      </div>
    </div>
  )
}
