import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  Route,
  Shield,
  Clock,
  MapPin,
  AlertTriangle,
  CheckCircle2,
  Activity,
  ArrowRight,
  Info
} from "lucide-react"
import { api } from "../services/api"
import { JourneyDossier } from "../types"

export const JourneyView: React.FC = () => {
  const { reg } = useParams<{ reg: string }>()
  const navigate = useNavigate()
  const [journey, setJourney] = useState<JourneyDossier | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!reg) return
    const fetchJourney = async () => {
      try {
        const data = await api.getVehicleJourney(reg)
        setJourney(data)
      } catch (err) {
        console.error("Error fetching journey:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchJourney()
  }, [reg])

  if (loading || !journey) {
    return (
      <div className="py-20 text-center text-xs text-police-400 flex items-center justify-center gap-2">
        <Activity className="w-5 h-5 animate-spin" />
        <span>Reconstructing vehicle journey dossier...</span>
      </div>
    )
  }

  const overallScorePercent = (journey.confidence_score.overall_score * 100).toFixed(0)

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(`/vehicles/${reg}`)}
            className="p-2 rounded-lg bg-police-900 hover:bg-police-800 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <Route className="w-5 h-5 text-amber-400" />
                Vehicle Journey Dossier: {journey.registration_number}
              </h2>
              <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-police-800 text-police-300 border border-police-700">
                {journey.journey_id}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Multi-camera transition analysis & forensic trajectory reconstruction
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-police-900 border border-police-700 font-mono text-purple-300">
            Mode: {journey.ordering_mode}
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-950/70 border border-amber-500/40 font-mono text-amber-300">
            {journey.status}
          </span>
        </div>
      </div>

      {/* Limitations & Forensic Caveats Banner */}
      <div className="p-4 rounded-xl bg-police-900/80 border border-amber-500/30 text-xs space-y-2">
        <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Forensic Constraints & Ground Truth Limitations</span>
        </div>
        <div className="space-y-1 text-slate-300 text-[11px] pl-6">
          {journey.limitations && journey.limitations.length > 0 ? (
            journey.limitations.map((lim, idx) => (
              <div key={idx} className="flex items-start gap-1.5">
                <span className="text-amber-400">•</span>
                <span>{lim}</span>
              </div>
            ))
          ) : (
            <div>Source time is unresolved; ordering is local media PTS.</div>
          )}
        </div>
      </div>

      {/* Confidence Score Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Overall Score</div>
          <div className="text-2xl font-black text-amber-300 font-mono mt-1">
            {overallScorePercent}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Weighted Forensic Index</div>
        </div>

        <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Recognition Quality</div>
          <div className="text-2xl font-black text-emerald-400 font-mono mt-1">
            {(journey.confidence_score.recognition_quality * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Weight: 35%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Temporal Resolution</div>
          <div className="text-2xl font-black text-blue-400 font-mono mt-1">
            {(journey.confidence_score.temporal_resolution * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Weight: 30% (PTS local)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Spatial Resolution</div>
          <div className="text-2xl font-black text-slate-400 font-mono mt-1">
            {(journey.confidence_score.spatial_resolution * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Weight: 15% (GPS unanchored)</div>
        </div>

        <div className="p-3.5 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div className="text-xs text-slate-400">Plausibility Consistency</div>
          <div className="text-2xl font-black text-purple-400 font-mono mt-1">
            {(journey.confidence_score.plausibility_consistency * 100).toFixed(0)}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Weight: 20%</div>
        </div>
      </div>

      {/* Trajectory Timeline: Journey Segments */}
      <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
          <Route className="w-4 h-4 text-police-400" />
          Journey Observation Segments ({journey.segments.length})
        </h3>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-police-700">
          {journey.segments.map((seg, idx) => (
            <div key={seg.segment_id} className="relative">
              {/* Timeline marker */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-police-800 border-2 border-police-400 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow">
                {idx + 1}
              </div>

              {/* Segment Content Card */}
              <div className="p-4 rounded-lg bg-police-950/80 border border-police-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {seg.evidence_url ? (
                    <img
                      src={seg.evidence_url}
                      alt="Plate"
                      className="w-24 h-14 object-cover rounded border border-police-700 bg-black"
                    />
                  ) : (
                    <div className="w-24 h-14 bg-police-900 border border-police-800 rounded flex items-center justify-center text-[10px] text-slate-600 font-mono">
                      NO SNAPSHOT
                    </div>
                  )}

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white uppercase text-sm">
                        {seg.camera_id}
                      </span>
                      <span className="text-slate-400 font-medium">
                        {seg.camera_name || "Surveillance Node"}
                      </span>
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Track: {seg.track_id} • PTS: {seg.first_seen_pts_ms ? `${(seg.first_seen_pts_ms / 1000).toFixed(2)}s` : "Local"}
                    </div>
                    <div className="text-slate-400 font-mono text-[11px]">
                      Source Time: <span className="text-amber-400">{seg.source_time_status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end justify-between shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-emerald-400">
                      {(seg.consensus_score * 100).toFixed(1)}% Consensus
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      OCR Conf: {(seg.ocr_confidence * 100).toFixed(1)}%
                    </div>
                  </div>

                  <button
                    onClick={() => navigate(`/cameras/${seg.camera_id}`)}
                    className="mt-2 text-xs text-police-400 hover:text-white underline font-medium"
                  >
                    Open Camera Feed →
                  </button>
                </div>
              </div>

              {/* Leg Transition Connector (if not last) */}
              {idx < journey.segments.length - 1 && (
                <div className="py-2 pl-4 flex items-center gap-2 text-xs text-slate-400 font-mono">
                  <ArrowRight className="w-3.5 h-3.5 text-police-400" />
                  <span>Inter-camera transition: Distance & speed uncalculated (coordinates unanchored)</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
