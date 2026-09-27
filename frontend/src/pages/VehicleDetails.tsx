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
  X,
  AlertOctagon,
  CheckCircle2,
  ChevronRight,
  Maximize2
} from "lucide-react"
import { api } from "../services/api"
import { ObservedVehicle, WatchlistEntry, JourneyDossier, Alert } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { SeverityBadge } from "../components/common/SeverityBadge"

import { FALLBACK_VEHICLES, FALLBACK_ALERTS } from "../data/fallbackData"
import { EmptyState } from "../components/common/EmptyState"

export const VehicleDetails: React.FC = () => {
  const { reg } = useParams<{ reg: string }>()
  const navigate = useNavigate()
  const [vehicle, setVehicle] = useState<ObservedVehicle | null>(null)
  const [watchlistTarget, setWatchlistTarget] = useState<WatchlistEntry | null>(null)
  const [journey, setJourney] = useState<JourneyDossier | null>(null)
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    if (!reg) return
    const fetchAllData = async () => {
      try {
        const [vData, wData, jData, aData] = await Promise.allSettled([
          api.getVehicle(reg),
          api.getWatchlist(),
          api.getVehicleJourney(reg),
          api.getAlerts({ search: reg }),
        ])

        if (vData.status === "fulfilled" && vData.value) {
          setVehicle(vData.value)
        } else {
          const fallbackVeh = FALLBACK_VEHICLES.find(
            (v) => v.registration_number.toLowerCase() === reg.toLowerCase()
          )
          if (fallbackVeh) setVehicle(fallbackVeh)
        }

        if (wData.status === "fulfilled" && Array.isArray(wData.value)) {
          const cleanReg = reg.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
          const match = wData.value.find(
            (w) => w.registration_number.replace(/[^A-Za-z0-9]/g, "").toUpperCase() === cleanReg
          )
          setWatchlistTarget(match || null)
        }

        if (jData.status === "fulfilled" && jData.value) {
          setJourney(jData.value)
        }

        if (aData.status === "fulfilled" && Array.isArray(aData.value) && aData.value.length > 0) {
          setActiveAlert(aData.value[0])
        } else {
          const fallbackAlert = FALLBACK_ALERTS.find(
            (a) => a.registration_number.toLowerCase() === reg.toLowerCase()
          )
          if (fallbackAlert) setActiveAlert(fallbackAlert)
        }
      } catch (err) {
        console.error("Error fetching vehicle detail:", err)
        const fallbackVeh = FALLBACK_VEHICLES.find(
          (v) => v.registration_number.toLowerCase() === reg.toLowerCase()
        )
        if (fallbackVeh) setVehicle(fallbackVeh)
        const fallbackAlert = FALLBACK_ALERTS.find(
          (a) => a.registration_number.toLowerCase() === reg.toLowerCase()
        )
        if (fallbackAlert) setActiveAlert(fallbackAlert)
      } finally {
        setLoading(false)
      }
    }
    fetchAllData()
  }, [reg])

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
        Loading vehicle intelligence dossier...
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <EmptyState
          title="Vehicle registration not found"
          description={`No recorded observations match plate "${reg}".`}
          action={{
            label: "Return to Vehicle Intelligence",
            onClick: () => navigate("/vehicles"),
          }}
        />
      </div>
    )
  }

  const lastSeenCamera = vehicle.last_seen?.camera_id || vehicle.cameras[vehicle.cameras.length - 1] || "cam01"
  const lastSeenTime = formatIST(vehicle.last_seen?.source_time || vehicle.updated_at_utc)
  const lastSeenPts = vehicle.last_seen?.pts_ms ? `PTS ${(vehicle.last_seen.pts_ms / 1000).toFixed(1)}s` : null

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/vehicles")}
            className="p-2 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div>
            <div className="flex items-center gap-3">
              {/* Plate Banner */}
              <div className="inline-flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow-sm">
                <div className="bg-blue-800 px-1.5 py-0.5 text-[8px] font-bold text-white flex flex-col items-center justify-center leading-none">
                  <span>IND</span>
                </div>
                <div className="px-3 py-0.5 font-mono text-base sm:text-lg font-bold tracking-wider text-slate-900 uppercase">
                  {vehicle.registration_number}
                </div>
              </div>

              {watchlistTarget ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-red-950/60 border border-red-500/60 text-red-300 font-mono text-xs font-bold">
                  <AlertOctagon className="w-3.5 h-3.5" />
                  WATCHLIST: MATCH ({watchlistTarget.category.replace(/_/g, " ")})
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900/60 border border-slate-700 text-slate-400 font-mono text-xs font-semibold">
                  WATCHLIST: NO MATCH
                </span>
              )}
            </div>

            <p className="text-xs text-slate-400 mt-1 font-mono">
              Vehicle Record ID: {vehicle.vehicle_id} ΓÇó Tracked across {vehicle.camera_count} surveillance node(s)
            </p>
          </div>
        </div>

        {/* Navigation Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          {activeAlert && (
            <button
              type="button"
              onClick={() => navigate(`/alerts/${activeAlert.alert_id}`)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-xs font-semibold text-red-200 transition cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Active Incident Alert ({activeAlert.priority})</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate(`/journey/${vehicle.registration_number}`)}
            className="flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 hover:bg-amber-500 text-xs font-semibold text-slate-950 transition shadow-sm cursor-pointer"
          >
            <Route className="w-4 h-4 text-slate-950" />
            <span>Reconstruct Journey Trajectory</span>
          </button>
        </div>
      </div>

      {/* 2. Key Dossier Facts (Answers What, Where, When, Watchlist) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Last Seen Location */}
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Current / Last Seen Node
          </span>
          <div className="text-lg font-bold text-white font-mono uppercase">
            {lastSeenCamera}
          </div>
          <div className="text-xs text-slate-400">
            Node in Gujarat CCTV Network
          </div>
        </div>

        {/* Last Seen Timestamp */}
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Last Sighting Timestamp
          </span>
          <div className="text-sm font-bold text-white font-mono">
            {lastSeenTime || "Stream local"}
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {lastSeenPts || "Active stream PTS"}
          </div>
        </div>

        {/* Multi-Frame Character Consensus */}
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            OCR Consensus Quality
          </span>
          <div className="text-lg font-bold text-emerald-400 font-mono">
            {(vehicle.best_consensus_score * 100).toFixed(1)}%
          </div>
          <div className="text-xs text-slate-400">
            Multi-frame majority consensus
          </div>
        </div>

        {/* Total Sightings */}
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Recorded Observations
          </span>
          <div className="text-lg font-bold text-white font-mono">
            {vehicle.observation_count} sightings
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Across {vehicle.cameras.length} camera(s)
          </div>
        </div>
      </div>

      {/* 3. Forensic Ground Rules Note (Separating PTS vs Wall Clock) */}
      <div className="p-3.5 rounded-lg bg-[#08101e] border border-[#1e3a6a]/60 text-xs flex items-start gap-3 text-slate-300">
        <Clock className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-white">Forensic Timestamp Note:</span>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            Media PTS measures relative elapsed stream duration from camera start. Ingestion time reflects when the frame was processed by the inference engine and is preserved for chain-of-custody verification.
          </p>
        </div>
      </div>

      {/* 4. Journey Movement Preview (if journey data exists) */}
      {journey && journey.legs && journey.legs.length > 0 && (
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/60">
            <div className="flex items-center gap-2">
              <Route className="w-4 h-4 text-amber-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
                Multi-Camera Route Transitions ({journey.legs.length} legs)
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate(`/journey/${vehicle.registration_number}`)}
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Open Full Forensic Journey ΓåÆ
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {journey.legs.slice(0, 3).map((leg, idx) => (
              <div
                key={idx}
                className="p-3 rounded bg-[#08101e] border border-[#1e3a6a]/60 text-xs space-y-1 font-mono"
              >
                <div className="flex items-center justify-between text-slate-300">
                  <span className="font-bold text-white uppercase">{leg.from_camera}</span>
                  <span className="text-slate-500">ΓåÆ</span>
                  <span className="font-bold text-white uppercase">{leg.to_camera}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Plausibility:</span>
                  <span className="text-emerald-400 font-semibold">{leg.plausibility}</span>
                </div>
                {leg.implied_speed_kmh && (
                  <div className="text-[10px] text-slate-500">
                    Est. Speed: {leg.implied_speed_kmh.toFixed(1)} km/h
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Chronological Sighting Observations & Evidence */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
          Chronological Sighting Log ({vehicle.timeline.length})
        </h2>

        <div className="space-y-2.5">
          {vehicle.timeline.map((item, idx) => {
            const pts = item.first_seen_pts_ms ? `${(item.first_seen_pts_ms / 1000).toFixed(2)}s` : "0s"
            const ist = formatIST(item.source_time || item.ingested_at_utc)

            return (
              <div
                key={idx}
                className="p-3.5 sm:p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] hover:border-sky-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4 min-w-0">
                  {/* Plate Crop Thumbnail */}
                  {item.evidence_url ? (
                    <div
                      onClick={() => setSelectedImage(item.evidence_url || null)}
                      className="w-28 h-16 rounded overflow-hidden border border-[#1e3a6a] bg-black cursor-pointer hover:border-sky-400 transition shrink-0 group relative"
                    >
                      <img
                        src={item.evidence_url}
                        alt="Plate Crop"
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          ;(e.currentTarget as HTMLElement).style.display = "none"
                        }}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <Maximize2 className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-28 h-16 rounded border border-[#1e3a6a] bg-[#08101e] flex items-center justify-center text-slate-500 text-[10px] shrink-0 font-mono">
                      NO FRAME
                    </div>
                  )}

                  <div className="space-y-1 min-w-0 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white uppercase">
                        {item.camera_id}
                      </span>
                      <span className="text-slate-600">|</span>
                      <span className="font-mono text-slate-400">Track ID: {item.track_id}</span>
                    </div>

                    <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span>PTS: <strong className="text-white">{pts}</strong></span>
                      {ist && <span>Time: <strong className="text-slate-300">{ist}</strong></span>}
                      <span>Source Time: <strong className="text-amber-400">{item.source_time_status}</strong></span>
                    </div>

                    <div className="text-[10px] text-slate-500 font-mono">
                      Ingested UTC: {item.ingested_at_utc}
                    </div>
                  </div>
                </div>

                <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1e3a6a]/60">
                  <div className="text-left sm:text-right">
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {(item.consensus_score * 100).toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">Consensus</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/cameras/${item.camera_id}`)}
                    className="sm:mt-2 text-xs text-sky-400 hover:text-white font-medium flex items-center gap-1"
                  >
                    <span>View Camera</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 6. Image Zoom Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#0b1528] border border-[#1e3a6a] rounded-lg p-4 shadow-2xl space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]">
              <span className="text-xs font-mono font-bold uppercase text-slate-200">
                Forensic License Plate Snapshot Evidence
              </span>
              <button
                type="button"
                onClick={() => setSelectedImage(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black rounded border border-[#1e3a6a] p-2 flex items-center justify-center">
              <img
                src={selectedImage}
                alt="License Plate Evidence Frame"
                className="max-h-[400px] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
