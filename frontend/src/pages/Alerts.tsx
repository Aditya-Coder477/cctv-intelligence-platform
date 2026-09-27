import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  AlertOctagon,
  Search,
  CheckCircle2,
  Clock,
  Camera,
  Shield,
  ArrowRight,
  UserCheck,
  Route,
  Car,
  Filter
} from "lucide-react"
import { api } from "../services/api"
import { Alert } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { SeverityBadge } from "../components/common/SeverityBadge"
import { DataSourceBadge } from "../components/common/DataSourceBadge"
import { EmptyState } from "../components/common/EmptyState"
import { useAuth } from "../context/AuthContext"
import { FALLBACK_ALERTS } from "../data/fallbackData"

type TabFilter = "ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "RESOLVED"

export const Alerts: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [search, setSearch] = useState("")
  const [selectedTab, setSelectedTab] = useState<TabFilter>("ALL")
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"LIVE" | "FALLBACK">("LIVE")
  const { operatorName } = useAuth()
  const navigate = useNavigate()

  const fetchAlerts = async () => {
    try {
      const data = await api.getAlerts({
        search: search || undefined,
      })
      if (Array.isArray(data) && data.length > 0) {
        setAlerts(data)
        setDataSource("LIVE")
      } else if (!search) {
        setAlerts(FALLBACK_ALERTS)
        setDataSource("FALLBACK")
      } else {
        setAlerts([])
        setDataSource("LIVE")
      }
    } catch (err) {
      console.error("Error loading alerts, using fallback:", err)
      if (!search) {
        setAlerts(FALLBACK_ALERTS)
        setDataSource("FALLBACK")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAlerts()
    const interval = setInterval(fetchAlerts, 5000)
    return () => clearInterval(interval)
  }, [search])

  const handleQuickAcknowledge = async (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation()
    try {
      await api.updateAlertAction(alertId, "acknowledge", operatorName, "Operational quick-acknowledgement")
      fetchAlerts()
    } catch (err) {
      console.error("Failed to acknowledge alert:", err)
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

  // Filter alerts based on selected severity/status tab
  const filteredAlerts = alerts.filter((alert) => {
    const s = search.toLowerCase().trim()
    const matchesSearch =
      !s ||
      alert.registration_number.toLowerCase().includes(s) ||
      alert.camera_id.toLowerCase().includes(s) ||
      alert.alert_id.toLowerCase().includes(s) ||
      alert.category.toLowerCase().includes(s)

    if (!matchesSearch) return false

    if (selectedTab === "ALL") return true
    if (selectedTab === "RESOLVED") {
      return alert.status === "RESOLVED" || alert.status === "DISMISSED"
    }
    // When filtering by priority, only show non-resolved alerts unless ALL is selected
    if (alert.status === "RESOLVED" || alert.status === "DISMISSED") {
      return false
    }
    return alert.priority === selectedTab
  })

  // Tab counts for quick scanning
  const counts = {
    ALL: alerts.length,
    CRITICAL: alerts.filter((a) => a.priority === "CRITICAL" && a.status !== "RESOLVED" && a.status !== "DISMISSED").length,
    HIGH: alerts.filter((a) => a.priority === "HIGH" && a.status !== "RESOLVED" && a.status !== "DISMISSED").length,
    MEDIUM: alerts.filter((a) => a.priority === "MEDIUM" && a.status !== "RESOLVED" && a.status !== "DISMISSED").length,
    LOW: alerts.filter((a) => a.priority === "LOW" && a.status !== "RESOLVED" && a.status !== "DISMISSED").length,
    RESOLVED: alerts.filter((a) => a.status === "RESOLVED" || a.status === "DISMISSED").length,
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              Incident Alerts & Dispatches
            </h1>
            <DataSourceBadge status={dataSource} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Automated correlation between live ANPR vehicle detections and active police watchlists
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <span>Active requiring attention:</span>
          <strong className="text-red-400 font-bold">{counts.CRITICAL + counts.HIGH}</strong>
        </div>
      </div>

      {/* Severity Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 p-3 bg-[#0b1528] border border-[#1e3a6a] rounded-lg">
        {/* Severity Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
          {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW", "RESOLVED"] as TabFilter[]).map((tab) => {
            const count = counts[tab]
            const isSelected = selectedTab === tab
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-semibold transition cursor-pointer flex items-center gap-1.5 shrink-0 ${
                  isSelected
                    ? tab === "CRITICAL"
                      ? "bg-red-900/60 text-white border border-red-500/60"
                      : "bg-[#132442] text-white border border-sky-400"
                    : "text-slate-400 hover:text-white hover:bg-[#0f1c35] border border-transparent"
                }`}
              >
                <span>{tab}</span>
                {count > 0 && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                      tab === "CRITICAL"
                        ? "bg-red-600 text-white"
                        : tab === "HIGH"
                        ? "bg-amber-600 text-white"
                        : "bg-[#1e3a6a] text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search vehicle plate or camera..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#08101e] border border-[#1e3a6a] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono"
          />
        </div>
      </div>

      {/* Alerts Decision Feed */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 font-mono">
          Loading incident alerts...
        </div>
      ) : filteredAlerts.length === 0 ? (
        <EmptyState
          title="No active alerts matching criteria"
          description="There are currently no alerts requiring attention in this category."
        />
      ) : (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => {
            const isResolved = alert.status === "RESOLVED" || alert.status === "DISMISSED"
            const isCritical = alert.priority === "CRITICAL" && !isResolved
            const istTime = formatIST(alert.matched_at_utc)
            const ptsText = alert.first_seen_pts_ms ? `PTS ${(alert.first_seen_pts_ms / 1000).toFixed(1)}s` : null

            return (
              <div
                key={alert.alert_id}
                onClick={() => navigate(`/alerts/${alert.alert_id}`)}
                className={`p-4 rounded-lg border transition cursor-pointer flex flex-col lg:flex-row lg:items-center justify-between gap-4 ${
                  isCritical
                    ? "bg-red-950/20 border-red-500/50 hover:border-red-400"
                    : isResolved
                    ? "bg-[#08101e]/60 border-[#1e3a6a]/40 opacity-75 hover:opacity-100"
                    : "bg-[#0b1528] border-[#1e3a6a] hover:border-sky-500/40"
                }`}
              >
                {/* Left: What, Where, When */}
                <div className="flex items-start gap-4 min-w-0">
                  {/* Plate Crop or Placeholder */}
                  {alert.evidence_url ? (
                    <img
                      src={alert.evidence_url}
                      alt="Plate Evidence"
                      className="w-24 h-14 object-cover rounded border border-[#1e3a6a] bg-black shrink-0"
                      onError={(e) => {
                        ;(e.currentTarget as HTMLElement).style.display = "none"
                      }}
                    />
                  ) : (
                    <div className="w-24 h-14 bg-[#08101e] border border-[#1e3a6a] rounded flex items-center justify-center text-[10px] text-slate-500 font-mono shrink-0">
                      NO CROP
                    </div>
                  )}

                  <div className="space-y-1.5 min-w-0">
                    {/* Header line: Plate + Priority + Status */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-base font-bold text-white tracking-wider">
                        {alert.registration_number}
                      </span>
                      <SeverityBadge severity={alert.priority} size="xs" />
                      <StatusBadge type="alert_status" value={alert.status} size="sm" />
                    </div>

                    {/* What: Watchlist match description */}
                    <div className="text-xs text-slate-200 font-medium">
                      <span className="text-slate-400">Match Reason:</span>{" "}
                      <strong>{alert.category.replace(/_/g, " ")}</strong>
                    </div>

                    {/* Where & When */}
                    <div className="text-[11px] text-slate-400 font-mono flex flex-wrap items-center gap-x-3 gap-y-1">
                      <span className="flex items-center gap-1">
                        <Camera className="w-3 h-3 text-slate-500" />
                        <span>Camera: <strong className="text-white uppercase">{alert.camera_id}</strong></span>
                      </span>
                      {istTime && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{istTime}</span>
                        </span>
                      )}
                      {ptsText && <span>ΓÇó {ptsText}</span>}
                      <span>
                        ΓÇó Confidence: <strong className="text-emerald-400">{(alert.recognition_confidence * 100).toFixed(0)}%</strong>
                      </span>
                    </div>

                    {alert.acknowledged_by && (
                      <div className="text-[10px] text-sky-300 font-mono flex items-center gap-1 pt-0.5">
                        <UserCheck className="w-3 h-3" />
                        <span>Acknowledged by {alert.acknowledged_by}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Operational Actions (What can I do?) */}
                <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1e3a6a]/60">
                  {alert.status === "NEW" && (
                    <button
                      type="button"
                      onClick={(e) => handleQuickAcknowledge(e, alert.alert_id)}
                      className="px-3 py-1.5 rounded bg-sky-700 hover:bg-sky-600 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/vehicles/${alert.registration_number}`)
                    }}
                    title="View full vehicle dossier"
                    className="px-2.5 py-1.5 rounded bg-[#08101e] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Car className="w-3.5 h-3.5 text-sky-400" />
                    <span className="hidden sm:inline">Vehicle</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation()
                      navigate(`/journey/${alert.registration_number}`)
                    }}
                    title="Trace vehicle journey across cameras"
                    className="px-2.5 py-1.5 rounded bg-[#08101e] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                  >
                    <Route className="w-3.5 h-3.5 text-amber-400" />
                    <span className="hidden sm:inline">Journey</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate(`/alerts/${alert.alert_id}`)}
                    className="px-3 py-1.5 rounded bg-[#132442] hover:bg-[#1a3159] border border-sky-500/40 text-sky-200 text-xs font-semibold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
