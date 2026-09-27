import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import {
  ArrowLeft,
  AlertOctagon,
  Shield,
  Clock,
  Camera,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Route,
  Car,
  ExternalLink,
  MapPin
} from "lucide-react"
import { api } from "../services/api"
import { Alert } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { SeverityBadge } from "../components/common/SeverityBadge"
import { useAuth } from "../context/AuthContext"

import { FALLBACK_ALERTS } from "../data/fallbackData"
import { EmptyState } from "../components/common/EmptyState"

export const AlertDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { operatorName, badgeNumber } = useAuth()
  const [alert, setAlert] = useState<Alert | null>(null)
  const [loading, setLoading] = useState(true)
  const [notes, setNotes] = useState("")
  const [actionProcessing, setActionProcessing] = useState(false)

  const fetchAlert = async () => {
    if (!id) return
    try {
      const data = await api.getAlert(id)
      setAlert(data)
    } catch (err) {
      console.error("Error loading alert:", err)
      const fallbackAlert = FALLBACK_ALERTS.find(
        (a) => a.alert_id.toLowerCase() === id.toLowerCase()
      )
      if (fallbackAlert) setAlert(fallbackAlert)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlert()
  }, [id])

  const handleAction = async (actionType: "acknowledge" | "escalate" | "resolve" | "dismiss") => {
    if (!alert) return
    setActionProcessing(true)
    try {
      const opInfo = `${operatorName} (${badgeNumber})`
      await api.updateAlertAction(alert.alert_id, actionType, opInfo, notes.trim() || undefined)
      setNotes("")
      fetchAlert()
    } catch (err) {
      console.error("Action execution error:", err)
    } finally {
      setActionProcessing(false)
    }
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
        Loading incident dossier...
      </div>
    )
  }

  if (!alert) {
    return (
      <div className="py-12 max-w-xl mx-auto">
        <EmptyState
          title="Incident alert not found"
          description={`No recorded alert matches ID "${id}".`}
          action={{
            label: "Return to Incident Alerts",
            onClick: () => navigate("/alerts"),
          }}
        />
      </div>
    )
  }

  const istTime = formatIST(alert.matched_at_utc)

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/alerts")}
            className="p-2 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-300 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                Incident Dossier: {alert.registration_number}
              </h1>
              <SeverityBadge severity={alert.priority} size="sm" />
              <StatusBadge type="alert_status" value={alert.status} size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              Alert ID: {alert.alert_id} ΓÇó Matched against Watchlist Target {alert.watchlist_id}
            </p>
          </div>
        </div>

        {/* Quick Nav Action Shortcuts */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(`/vehicles/${alert.registration_number}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-sky-400" />
            <span>Vehicle Dossier</span>
          </button>
          <button
            type="button"
            onClick={() => navigate(`/journey/${alert.registration_number}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#132442] hover:bg-[#1a3159] border border-sky-500/40 text-xs font-semibold text-sky-200 transition cursor-pointer"
          >
            <Route className="w-3.5 h-3.5 text-amber-400" />
            <span>Trace Journey</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Details & Audit Trail + Operational Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Incident Details & Evidence & Audit */}
        <div className="lg:col-span-2 space-y-4">
          {/* Match & Sighting Details */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono">
              Incident Correlation Details
            </h2>

            <div className="flex flex-col sm:flex-row gap-5">
              {/* Evidence Plate Crop */}
              <div className="space-y-1.5 shrink-0">
                {alert.evidence_url ? (
                  <img
                    src={alert.evidence_url}
                    alt="License Plate Evidence"
                    className="w-56 h-32 object-cover rounded border border-[#1e3a6a] bg-black"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLElement).style.display = "none"
                    }}
                  />
                ) : (
                  <div className="w-56 h-32 bg-[#08101e] border border-[#1e3a6a] rounded flex items-center justify-center text-xs text-slate-500 font-mono">
                    NO EVIDENCE IMAGE
                  </div>
                )}
                <div className="text-[10px] text-slate-500 font-mono text-center">
                  Automated OCR Frame Crop
                </div>
              </div>

              {/* Structured Metadata (Answers What, Where, When, Why) */}
              <div className="space-y-2.5 text-xs flex-1">
                <div className="flex items-center justify-between pb-1.5 border-b border-[#1e3a6a]/40">
                  <span className="text-slate-400">Target Registration:</span>
                  <span className="text-white font-mono font-bold text-sm tracking-wider">
                    {alert.registration_number}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-[#1e3a6a]/40">
                  <span className="text-slate-400">Watchlist Classification:</span>
                  <span className="text-amber-300 font-semibold">
                    {alert.category.replace(/_/g, " ")}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-[#1e3a6a]/40">
                  <span className="text-slate-400">Surveillance Camera:</span>
                  <button
                    type="button"
                    onClick={() => navigate(`/cameras/${alert.camera_id}`)}
                    className="text-sky-400 hover:text-white font-mono uppercase font-bold flex items-center gap-1"
                  >
                    <span>{alert.camera_id}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-[#1e3a6a]/40">
                  <span className="text-slate-400">Detection Timestamp:</span>
                  <span className="text-white font-mono">
                    {istTime || alert.matched_at_utc}
                  </span>
                </div>

                <div className="flex items-center justify-between pb-1.5 border-b border-[#1e3a6a]/40">
                  <span className="text-slate-400">Relative Media PTS:</span>
                  <span className="text-slate-300 font-mono">
                    {alert.first_seen_pts_ms ? `${(alert.first_seen_pts_ms / 1000).toFixed(2)}s from stream start` : "Stream relative (0s)"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recognition Confidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {(alert.recognition_confidence * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Incident Audit History */}
          <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-sky-400" />
              <span>Incident Audit Trail ({alert.audit_history?.length || 0})</span>
            </h2>

            {alert.audit_history && alert.audit_history.length > 0 ? (
              <div className="space-y-2">
                {alert.audit_history.map((log, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded bg-[#08101e] border border-[#1e3a6a]/60 text-xs space-y-1 font-mono"
                  >
                    <div className="flex items-center justify-between text-slate-400 text-[11px]">
                      <span className="font-bold text-white uppercase">{log.action}</span>
                      <span>{log.timestamp}</span>
                    </div>
                    <div className="text-sky-300 text-[11px]">
                      Officer: {log.operator}
                    </div>
                    {log.notes && (
                      <div className="text-slate-300 text-xs font-sans pt-1 border-t border-[#1e3a6a]/40">
                        "{log.notes}"
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-slate-400 font-mono py-2">
                No previous operator actions recorded on this alert.
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Operational Actions Console */}
        <div className="space-y-4">
          <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200 font-mono flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-sky-400" />
              <span>Operator Incident Actions</span>
            </h2>

            <div className="text-xs text-slate-400 font-mono">
              Active Officer: <strong className="text-white">{operatorName}</strong> ({badgeNumber})
            </div>

            {/* Operator Notes Input */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">
                Operational Notes / Dispatch Instructions
              </label>
              <textarea
                placeholder="Enter dispatch directives or investigation notes before executing action..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-[#08101e] border border-[#1e3a6a] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 h-24 resize-none font-sans"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleAction("acknowledge")}
                disabled={actionProcessing || alert.status === "ACKNOWLEDGED"}
                className="w-full py-2 px-3 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Acknowledge Alert</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("escalate")}
                disabled={actionProcessing || alert.status === "ESCALATED"}
                className="w-full py-2 px-3 bg-amber-700 hover:bg-amber-600 disabled:opacity-50 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Escalate to PCR / Field Dispatch</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("resolve")}
                disabled={actionProcessing || alert.status === "RESOLVED"}
                className="w-full py-2 px-3 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 rounded text-xs font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Resolved</span>
              </button>

              <button
                type="button"
                onClick={() => handleAction("dismiss")}
                disabled={actionProcessing || alert.status === "DISMISSED"}
                className="w-full py-2 px-3 bg-[#08101e] hover:bg-[#0f1c35] border border-[#1e3a6a] disabled:opacity-50 rounded text-xs font-semibold text-slate-300 hover:text-white transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Dismiss False Alarm</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
