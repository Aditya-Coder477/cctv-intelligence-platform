import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertOctagon,
  Search,
  CheckCircle,
  Clock,
  Camera,
  Shield,
  Filter,
  ArrowRight,
  UserCheck
} from "lucide-react"
import { api } from "../services/api"
import { Alert } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { useAuth } from "../context/AuthContext"

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  const [loading, setLoading] = useState(true)
  const { operatorName } = useAuth()
  const navigate = useNavigate()

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts({
        search: search || undefined,
        status: statusFilter || undefined,
        priority: priorityFilter || undefined,
      })
      setAlerts(data)
    } catch (err) {
      console.error("Error loading alerts:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [search, statusFilter, priorityFilter])

  const handleQuickAcknowledge = async (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation()
    try {
      await api.updateAlertAction(alertId, "acknowledge", operatorName, "Quick acknowledged from list")
      fetchAlerts()
    } catch (err) {
      console.error("Failed to acknowledge alert:", err)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Surveillance Incident Alerts & Dispatches
            </h2>
            <span className="text-[10px] px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-800 font-mono font-bold">
              STEP 9 MATCHING
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time notifications triggered by automated ANPR watchlist matching
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-police-900/60 border border-police-800 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-police-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle registration or alert ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-police-950/80 border border-police-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by alert status"
            className="bg-police-950/80 text-white border border-police-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="ESCALATED">Escalated</option>
            <option value="RESOLVED">Resolved</option>
            <option value="DISMISSED">Dismissed</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by alert priority"
            className="bg-police-950/80 text-white border border-police-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Scanning for live alerts...</div>
      ) : alerts.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          No watchlist alerts found matching current filters.
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.alert_id}
              onClick={() => navigate(`/alerts/${alert.alert_id}`)}
              className="p-4 rounded-xl bg-police-900/50 hover:bg-police-900 border border-police-800 hover:border-police-600/60 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start gap-4">
                {/* Plate crop */}
                {alert.evidence_url ? (
                  <img
                    src={alert.evidence_url}
                    alt="Alert Plate"
                    className="w-24 h-14 object-cover rounded border border-police-700 bg-black shrink-0"
                  />
                ) : (
                  <div className="w-24 h-14 bg-police-950 border border-police-800 rounded flex items-center justify-center text-[10px] text-slate-600 font-mono shrink-0">
                    NO CROP
                  </div>
                )}

                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-base font-black text-white">
                      {alert.registration_number}
                    </span>
                    <StatusBadge type="priority" value={alert.priority} size="sm" />
                    <StatusBadge type="alert_status" value={alert.status} size="sm" />
                    <StatusBadge type="synthetic" value="SYNTHETIC_DEMO" size="sm" />
                  </div>

                  <div className="text-slate-300 font-medium">
                    {alert.category.replace(/_/g, " ")} • Detected on camera <span className="font-mono font-bold text-white uppercase">{alert.camera_id}</span>
                  </div>

                  <div className="text-slate-400 text-[11px] font-mono">
                    Match Confidence: {(alert.recognition_confidence * 100).toFixed(0)}% • Relative PTS: {alert.first_seen_pts_ms ? `${(alert.first_seen_pts_ms / 1000).toFixed(1)}s` : "Local"}
                  </div>

                  {alert.acknowledged_by && (
                    <div className="text-[10px] text-blue-300 font-mono flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>Acknowledged by {alert.acknowledged_by}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {alert.status === "NEW" && (
                  <button
                    onClick={(e) => handleQuickAcknowledge(e, alert.alert_id)}
                    className="px-3 py-1.5 bg-blue-700 hover:bg-blue-600 rounded text-xs font-semibold text-white transition flex items-center gap-1.5 shadow"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Acknowledge
                  </button>
                )}
                <div className="flex items-center gap-1 text-xs text-police-400 group-hover:text-white font-medium pl-2">
                  <span>Details</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
