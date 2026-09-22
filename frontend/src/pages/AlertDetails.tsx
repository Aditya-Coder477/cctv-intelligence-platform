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
  Send,
  Radio,
  Car
} from "lucide-react"
import { api } from "../services/api"
import { Alert } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { useAuth } from "../context/AuthContext"

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
      console.error("Action error:", err)
    } finally {
      setActionProcessing(false)
    }
  }

  if (loading || !alert) {
    return (
      <div className="py-20 text-center text-xs text-police-400">Loading incident dossier...</div>
    )
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/alerts")}
            className="p-2 rounded-lg bg-police-900 hover:bg-police-800 text-slate-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                Incident Incident Alert: {alert.registration_number}
              </h2>
              <StatusBadge type="priority" value={alert.priority} size="sm" />
              <StatusBadge type="alert_status" value={alert.status} size="sm" />
              <StatusBadge type="synthetic" value="SYNTHETIC_DEMO" size="sm" />
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              Alert ID: {alert.alert_id} • Matched against Watchlist {alert.watchlist_id}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate(`/vehicles/${alert.registration_number}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-police-800 hover:bg-police-700 text-xs font-medium text-slate-200"
        >
          <Car className="w-3.5 h-3.5" />
          Vehicle Dossier
        </button>
      </div>

      {/* Main Grid: Details + Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Audit Trail */}
        <div className="lg:col-span-2 space-y-4">
          {/* Sighting Details Card */}
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              Match Incident Details
            </h3>

            <div className="flex flex-col sm:flex-row gap-4">
              {alert.evidence_url ? (
                <img
                  src={alert.evidence_url}
                  alt="Evidence"
                  className="w-48 h-28 object-cover rounded-lg border border-police-700 bg-black shrink-0"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-48 h-28 bg-police-950 border border-police-800 rounded-lg flex items-center justify-center text-xs text-slate-600 font-mono shrink-0">
                  NO EVIDENCE IMAGE
                </div>
              )}

              <div className="space-y-2 text-xs flex-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Category:</span>
                  <span className="text-white font-medium">{alert.category.replace(/_/g, " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Detection Camera:</span>
                  <button
                    onClick={() => navigate(`/cameras/${alert.camera_id}`)}
                    className="text-police-400 hover:text-white font-mono uppercase font-bold"
                  >
                    {alert.camera_id} →
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Track Reference:</span>
                  <span className="text-slate-300 font-mono">{alert.track_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">OCR Recognition Confidence:</span>
                  <span className="text-emerald-400 font-mono font-bold">
                    {(alert.recognition_confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Relative Media PTS:</span>
                  <span className="text-slate-300 font-mono">
                    {alert.first_seen_pts_ms ? `${(alert.first_seen_pts_ms / 1000).toFixed(2)}s` : "0s"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit History Log */}
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-police-400" />
              Incident Audit Trail ({alert.audit_history.length})
            </h3>

            <div className="space-y-3">
              {alert.audit_history.map((log, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-police-950/80 border border-police-800 text-xs space-y-1 font-mono"
                >
                  <div className="flex items-center justify-between text-slate-400 text-[11px]">
                    <span className="font-bold text-white">{log.action}</span>
                    <span>{log.timestamp}</span>
                  </div>
                  <div className="text-police-300 text-[11px]">
                    Operator: {log.operator}
                  </div>
                  {log.notes && (
                    <div className="text-slate-300 text-[11px] font-sans pt-1 border-t border-police-850">
                      "{log.notes}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Operator Actions */}
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-police-900/60 border border-police-800 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-police-400" />
              Operator Incident Response
            </h3>

            <div className="text-xs text-slate-400">
              Logged in as: <span className="text-white font-semibold">{operatorName}</span> ({badgeNumber})
            </div>

            {/* Operator Notes Input */}
            <div>
              <label className="block text-slate-300 text-xs font-medium mb-1.5">
                Dispatch / Investigation Notes
              </label>
              <textarea
                placeholder="Add notes before executing status transition..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-police-950 border border-police-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none h-24 resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={() => handleAction("acknowledge")}
                disabled={actionProcessing || alert.status === "ACKNOWLEDGED"}
                className="w-full py-2 bg-blue-700 hover:bg-blue-600 disabled:opacity-50 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                Acknowledge Alert
              </button>

              <button
                onClick={() => handleAction("escalate")}
                disabled={actionProcessing || alert.status === "ESCALATED"}
                className="w-full py-2 bg-purple-700 hover:bg-purple-600 disabled:opacity-50 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-2 shadow"
              >
                <AlertTriangle className="w-4 h-4" />
                Escalate to Field Dispatch
              </button>

              <button
                onClick={() => handleAction("resolve")}
                disabled={actionProcessing || alert.status === "RESOLVED"}
                className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 rounded-lg text-xs font-semibold text-white transition flex items-center justify-center gap-2 shadow"
              >
                <CheckCircle2 className="w-4 h-4" />
                Mark as Resolved
              </button>

              <button
                onClick={() => handleAction("dismiss")}
                disabled={actionProcessing || alert.status === "DISMISSED"}
                className="w-full py-2 bg-police-800 hover:bg-police-750 disabled:opacity-50 rounded-lg text-xs font-semibold text-slate-400 hover:text-white transition flex items-center justify-center gap-2"
              >
                Dismiss False Positive
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
