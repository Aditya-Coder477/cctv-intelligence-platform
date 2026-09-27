import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Route,
  Shield,
  Clock,
  MapPin,
  AlertTriangle,
  AlertOctagon,
  CheckCircle2,
  Activity,
  ArrowRight,
  Camera,
  ExternalLink,
  ChevronRight,
  Maximize2,
  X
} from "lucide-react"
import { api } from "../services/api"
import { JourneyDossier, Alert } from "../types"

import { FALLBACK_VEHICLES, FALLBACK_ALERTS } from "../data/fallbackData"
import { EmptyState } from "../components/common/EmptyState"

export const JourneyView: React.FC = () => {
  const { reg } = useParams<{ reg: string }>()
  const navigate = useNavigate()
  const [journey, setJourney] = useState<JourneyDossier | null>(null)
  const [activeAlert, setActiveAlert] = useState<Alert | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedEvidence, setSelectedEvidence] = useState<string | null>(null)

  useEffect(() => {
    if (!reg) return
    const fetchJourney = async () => {
      try {
        const [jData, aData] = await Promise.allSettled([
          api.getVehicleJourney(reg),
          api.getAlerts({ search: reg }),
        ])

        if (jData.status === "fulfilled" && jData.value) {
          setJourney(jData.value)
        } else {
          const fallbackVeh = FALLBACK_VEHICLES.find(
            (v) => v.registration_number.toLowerCase() === reg.toLowerCase()
          )
          if (fallbackVeh && fallbackVeh.timeline) {
            const segments = fallbackVeh.timeline.map((item, idx) => ({
              segment_id: `seg-${idx}`,
              vehicle_id: fallbackVeh.vehicle_id,
              registration_number: fallbackVeh.registration_number,
              camera_id: item.camera_id,
              track_id: item.track_id,
              first_seen_pts_ms: item.first_seen_pts_ms,
              recognition_pts_ms: item.recognition_pts_ms,
              last_seen_pts_ms: item.last_seen_pts_ms,
              source_time: item.source_time,
              source_time_status: item.source_time_status,
              recognition_status: item.status,
              consensus_score: item.consensus_score,
              ocr_confidence: item.consensus_score,
              camera_name: `Surveillance Checkpoint ${item.camera_id.toUpperCase()}`,
              evidence_url: item.evidence_url,
              supporting_observation_count: 1,
            }))

            setJourney({
              journey_id: `JOURNEY-${fallbackVeh.registration_number}`,
              vehicle_id: fallbackVeh.vehicle_id,
              registration_number: fallbackVeh.registration_number,
              normalized_registration_number: fallbackVeh.normalized_registration_number,
              ordering_mode: "PTS_LOCAL_TIME",
              status: "ANALYZED",
              segments,
              legs: [],
              confidence_score: {
                overall_score: fallbackVeh.best_consensus_score,
                recognition_quality: fallbackVeh.best_consensus_score,
                temporal_resolution: 0.85,
                spatial_resolution: 0.5,
                plausibility_consistency: 0.8,
                notes: ["Fallback trajectory reconstructed from sighting logs"],
                explanations: [],
              },
              time_resolution: "PTS_LOCAL",
              spatial_resolution: "UNANCHORED",
              limitations: ["Derived from local sighting cache (gateway offline)"],
            })
          }
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
        console.error("Error fetching journey:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJourney()
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
        Reconstructing vehicle journey dossier...
      </div>
    )
  }

  if (!journey) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <EmptyState
          title="Journey dossier not found"
          description={`No trajectory or movement history recorded for vehicle "${reg}".`}
          action={{
            label: "Return to Vehicle Intelligence",
            onClick: () => navigate("/vehicles"),
          }}
        />
      </div>
    )
  }

  const segments = journey.segments || []
  const firstSeg = segments[0]
  const lastSeg = segments[segments.length - 1]

  const firstSeenDisplay =
    formatIST(firstSeg?.source_time) ||
    (firstSeg?.first_seen_pts_ms !== undefined
      ? `PTS ${(firstSeg.first_seen_pts_ms / 1000).toFixed(1)}s (Stream relative)`
      : "Unresolved")

  const lastSeenDisplay =
    formatIST(lastSeg?.source_time) ||
    (lastSeg?.last_seen_pts_ms !== undefined
      ? `PTS ${(lastSeg.last_seen_pts_ms / 1000).toFixed(1)}s (Stream relative)`
      : "Unresolved")

  const uniqueCamerasCount = new Set(segments.map((s) => s.camera_id)).size
  const totalObservationsCount = segments.reduce(
    (acc, s) => acc + (s.supporting_observation_count || 1),
    0
  )

  const overallScorePercent = (journey.confidence_score.overall_score * 100).toFixed(0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(`/vehicles/${reg}`)}
            className="p-2 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <Route className="w-5 h-5 text-amber-400" />
                Vehicle Journey Dossier: {journey.registration_number}
              </h1>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-[#0b1528] text-slate-300 border border-[#1e3a6a]">
                {journey.journey_id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Cross-camera chronological reconstruction and movement analysis
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {activeAlert && (
            <button
              type="button"
              onClick={() => navigate(`/alerts/${activeAlert.alert_id}`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-red-950/60 hover:bg-red-900/60 border border-red-500/50 text-xs font-semibold text-red-200 transition cursor-pointer"
            >
              <AlertOctagon className="w-3.5 h-3.5 text-red-400" />
              <span>Active Incident Alert ({activeAlert.priority})</span>
            </button>
          )}
          <button
            type="button"
            onClick={() => navigate(`/map?reg=${encodeURIComponent(journey.registration_number)}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <MapPin className="w-3.5 h-3.5 text-sky-400" />
            <span>GIS Map View</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/vehicles/${journey.registration_number}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#132442] hover:bg-[#1a3159] border border-sky-500/40 text-xs font-semibold text-sky-200 transition cursor-pointer"
          >
            <span>Vehicle Dossier</span>
          </button>
        </div>
      </div>

      {/* 2. Journey Summary Cards (First seen, Last seen, Cameras, Observations) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            First Seen
          </span>
          <div className="text-sm sm:text-base font-bold text-white font-mono truncate">
            {firstSeenDisplay}
          </div>
          <div className="text-xs text-slate-400 font-mono uppercase">
            Node: {firstSeg?.camera_id || "cam01"}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Last Seen
          </span>
          <div className="text-sm sm:text-base font-bold text-white font-mono truncate">
            {lastSeenDisplay}
          </div>
          <div className="text-xs text-slate-400 font-mono uppercase">
            Node: {lastSeg?.camera_id || "cam01"}
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Surveillance Cameras
          </span>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {uniqueCamerasCount}
          </div>
          <div className="text-xs text-slate-400">
            Intersected camera checkpoints
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-1">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Total Observations
          </span>
          <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
            {totalObservationsCount}
          </div>
          <div className="text-xs text-slate-400">
            Overall Confidence: {overallScorePercent}%
          </div>
        </div>
      </div>

      {/* 3. Forensic Ground Truth Constraints Banner */}
      <div className="p-3.5 rounded-lg bg-[#08101e] border border-[#1e3a6a]/60 text-xs space-y-1 text-slate-300">
        <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Forensic Timestamp Note</span>
        </div>
        <p className="text-slate-400 text-[11px] leading-relaxed pl-6">
          Wall-clock timestamps reflect authoritative media container timestamps where available. When stream source wall-clock time is unanchored, relative media PTS (Presentation Timestamps) from camera stream start are displayed to ensure forensic credibility without fabricating times.
        </p>
      </div>

      {/* 4. Forensic Chronological Timeline */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1e3a6a]/60">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-sky-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Chronological Movement Timeline ({segments.length} Checkpoints)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Ordering: {journey.ordering_mode}
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#1e3a6a]">
          {segments.map((seg, idx) => {
            const timeDisplay =
              formatIST(seg.source_time) ||
              (seg.first_seen_pts_ms !== undefined
                ? `PTS ${(seg.first_seen_pts_ms / 1000).toFixed(2)}s`
                : "Relative local")

            return (
              <div key={seg.segment_id} className="relative">
                {/* Timeline circle node */}
                <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#08101e] border-2 border-sky-400 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow">
                  {idx + 1}
                </div>

                {/* Segment Content Card */}
                <div className="p-4 rounded-lg bg-[#08101e] border border-[#1e3a6a] hover:border-sky-500/40 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    {/* Plate snapshot thumbnail */}
                    {seg.evidence_url ? (
                      <div
                        onClick={() => setSelectedEvidence(seg.evidence_url || null)}
                        className="w-24 h-14 rounded overflow-hidden border border-[#1e3a6a] bg-black cursor-pointer hover:border-sky-400 transition shrink-0 group relative"
                      >
                        <img
                          src={seg.evidence_url}
                          alt="Plate"
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            ;(e.currentTarget as HTMLElement).style.display = "none"
                          }}
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                          <Maximize2 className="w-3.5 h-3.5 text-white" />
                        </div>
                      </div>
                    ) : (
                      <div className="w-24 h-14 bg-[#050b14] border border-[#1e3a6a] rounded flex items-center justify-center text-[10px] text-slate-500 font-mono shrink-0">
                        NO IMAGE
                      </div>
                    )}

                    <div className="space-y-1 text-xs min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-white uppercase text-sm">
                          {seg.camera_id}
                        </span>
                        <span className="text-slate-500">┬╖</span>
                        <span className="text-slate-300 font-medium truncate">
                          {seg.camera_name || "Gujarat Road Network Surveillance Checkpoint"}
                        </span>
                      </div>

                      <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-0.5">
                        <span className="text-sky-300 font-bold">{timeDisplay}</span>
                        <span>Track ID: {seg.track_id}</span>
                        <span>Status: <strong className="text-emerald-400">{seg.recognition_status}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col sm:items-end justify-between items-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-[#1e3a6a]/60">
                    <div className="text-left sm:text-right">
                      <div className="text-sm font-mono font-bold text-emerald-400">
                        {(seg.consensus_score * 100).toFixed(1)}% Consensus
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        OCR Conf: {(seg.ocr_confidence * 100).toFixed(1)}%
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => navigate(`/cameras/${seg.camera_id}`)}
                      className="sm:mt-2 text-xs text-sky-400 hover:text-white font-medium flex items-center gap-1"
                    >
                      <span>Camera Feed</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Leg Transition Connector */}
                {idx < segments.length - 1 && (
                  <div className="py-2 pl-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span>
                      Transition to {segments[idx + 1]?.camera_id.toUpperCase()}
                      {segments[idx + 1]?.camera_name ? ` (${segments[idx + 1].camera_name})` : ""}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* 5. Image Zoom Modal */}
      {selectedEvidence && (
        <div
          onClick={() => setSelectedEvidence(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full bg-[#0b1528] border border-[#1e3a6a] rounded-lg p-4 shadow-2xl space-y-3 cursor-default"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]">
              <span className="text-xs font-mono font-bold uppercase text-slate-200">
                Forensic Checkpoint Plate Capture
              </span>
              <button
                type="button"
                onClick={() => setSelectedEvidence(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black rounded border border-[#1e3a6a] p-2 flex items-center justify-center">
              <img
                src={selectedEvidence}
                alt="Plate Capture Zoom"
                className="max-h-[400px] w-auto object-contain rounded"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
