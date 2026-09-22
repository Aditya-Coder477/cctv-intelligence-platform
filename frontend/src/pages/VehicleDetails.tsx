import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Car,
  Clock,
  Camera,
  Shield,
  MapPin,
  ExternalLink,
  Activity,
  Image,
  Route,
  X
} from "lucide-react"
import { api } from "../services/api"
import { ObservedVehicle } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"

export const VehicleDetails: React.FC = () => {
  const { reg } = useParams<{ reg: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<ObservedVehicle | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!reg) return
    const fetchVehicle = async () => {
      try {
        const data = await api.getVehicle(reg)
        setVehicle(data)
      } catch (err) {
        console.error("Error fetching vehicle detail:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchVehicle()
  }, [reg])

  if (loading || !vehicle) {
    return (
      <div className="py-20 text-center text-xs text-police-400 flex items-center justify-center gap-2">
        <Activity className="w-5 h-5 animate-spin" />
        <span>Loading vehicle dossier...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/vehicles")}
            className="p-2 rounded-lg bg-police-900 hover:bg-police-800 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow">
                <div className="bg-blue-800 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                  IND
                </div>
                <div className="px-3 py-0.5 font-mono text-lg font-black tracking-wider text-slate-900 uppercase">
                  {vehicle.registration_number}
                </div>
              </div>
              <StatusBadge type="recognition" value="CONFIRMED" size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Vehicle ID: {vehicle.vehicle_id} • Tracked across {vehicle.camera_count} camera(s)
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/journey/${vehicle.registration_number}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-police-700 hover:bg-police-600 text-xs font-semibold text-white transition shadow"
        >
          <Route className="w-4 h-4 text-amber-300" />
          Reconstruct Journey Dossier
        </button>
      </div>

      {/* Forensic Ground Rules Warning */}
      <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-700/80 text-xs flex items-start gap-3">
        <Clock className="w-5 h-5 text-police-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">
            Temporal Forensic Integrity Note: Separate Media PTS and Ingestion Time
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Media PTS indicates relative elapsed time from stream start for each camera. Wall-clock source time is currently unanchored (<span className="font-mono text-amber-400">NOT_RESOLVED</span>) in the stream header. Ingestion timestamp (<span className="font-mono text-slate-300">{vehicle.ingested_at_utc}</span>) records when the AI pipeline processed the frame and must never be conflated with the vehicle's physical sighting time.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
          <div className="text-xs text-slate-400 font-medium">Multi-Frame Consensus</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {(vehicle.best_consensus_score * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Character-level majority vote</div>
        </div>

        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
          <div className="text-xs text-slate-400 font-medium">Logged Sightings</div>
          <div className="text-2xl font-black text-white font-mono mt-1">
            {vehicle.observation_count}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Recorded vehicle track sequences</div>
        </div>

        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
          <div className="text-xs text-slate-400 font-medium">Cameras Traversing</div>
          <div className="text-2xl font-black text-police-300 font-mono mt-1">
            {vehicle.cameras.join(", ") || "cam01"}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Surveillance nodes</div>
        </div>
      </div>

      {/* Sightings Timeline */}
      <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <Camera className="w-4 h-4 text-police-400" />
          Observation Timeline & Forensic Evidence
        </h3>

        <div className="space-y-4">
          {vehicle.timeline.map((item, idx) => (
            <div
              key={idx}
              className="p-4 rounded-lg bg-police-950/80 border border-police-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-4">
                {/* Plate snapshot */}
                {item.evidence_url ? (
                  <div
                    onClick={() => setSelectedImage(item.evidence_url || null)}
                    className="w-28 h-16 rounded overflow-hidden border border-police-700 bg-black cursor-pointer hover:border-police-400 transition shrink-0 group relative"
                  >
                    <img
                      src={item.evidence_url}
                      alt="Plate Crop"
                      className="w-full h-full object-contain"
                      onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                      <Image className="w-4 h-4 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-28 h-16 rounded border border-police-800 bg-police-900 flex items-center justify-center text-slate-600 text-xs shrink-0 font-mono">
                    NO IMAGE
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-white uppercase text-sm">
                      {item.camera_id}
                    </span>
                    <span className="text-slate-500">|</span>
                    <span className="font-mono text-slate-300">Track: {item.track_id}</span>
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    Relative PTS: {item.first_seen_pts_ms ? `${(item.first_seen_pts_ms / 1000).toFixed(2)}s` : "0s"}
                  </div>
                  <div className="text-slate-400 font-mono text-[11px]">
                    Source Time: <span className="text-amber-400 font-semibold">{item.source_time_status}</span>
                  </div>
                  <div className="text-slate-500 text-[10px]">
                    Ingested at: {item.ingested_at_utc}
                  </div>
                </div>
              </div>

              {/* Consensus & actions */}
              <div className="flex flex-col sm:items-end justify-between shrink-0">
                <div className="text-right">
                  <div className="text-sm font-mono font-bold text-emerald-400">
                    {(item.consensus_score * 100).toFixed(1)}% Consensus
                  </div>
                  <div className="text-[10px] text-slate-500">Recognition Quality</div>
                </div>

                <button
                  onClick={() => navigate(`/cameras/${item.camera_id}`)}
                  className="mt-2 text-xs text-police-400 hover:text-white underline font-medium"
                >
                  View Camera Stream →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Image Zoom Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-police-900 border border-police-700 rounded-xl p-4 shadow-2xl">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 p-1 rounded text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-xs font-mono font-bold uppercase text-slate-300 mb-3">
              Forensic License Plate Snapshot Zoom
            </h4>
            <div className="bg-black rounded-lg overflow-hidden border border-police-800 p-2 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="License Plate Zoom"
                className="max-h-[380px] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
