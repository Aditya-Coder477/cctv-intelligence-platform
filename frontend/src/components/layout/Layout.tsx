import React, { useState, useEffect } from "react"
import { Outlet, useNavigate, useLocation } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
import { AlertOctagon, ArrowRight, X } from "lucide-react"
import { api } from "../../services/api"
import { Alert } from "../../types"

export const Layout: React.FC = () => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false)
  const [criticalAlerts, setCriticalAlerts] = useState<Alert[]>([])
  const [isTickerDismissed, setIsTickerDismissed] = useState<boolean>(false)
  const navigate = useNavigate()
  const location = useLocation()
  const isMapRoute = location.pathname.startsWith("/map")

  // Poll actual alerts for real operational critical incident ticker
  useEffect(() => {
    let isMounted = true

    const checkCriticalAlerts = async () => {
      try {
        const alerts = await api.getAlerts()
        if (!isMounted) return

        if (Array.isArray(alerts)) {
          // Only actual critical unhandled alerts
          const criticals = alerts.filter(
            (a) => a.priority === "CRITICAL" && (a.status === "NEW" || a.status === "UNDER_REVIEW")
          )
          setCriticalAlerts(criticals)
        }
      } catch {
        // Silently ignore network failures - NEVER fabricate alerts
      }
    }

    checkCriticalAlerts()
    const interval = setInterval(checkCriticalAlerts, 10000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  const latestCritical = criticalAlerts[0]

  return (
    <div className="min-h-screen bg-[#050b14] flex flex-col text-slate-100 selection:bg-sky-500 selection:text-slate-950">
      {/* Top Command Bar */}
      <Navbar
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
      />

      {/* Critical Incident Ticker: ONLY rendered when actual active critical alert data exists */}
      {criticalAlerts.length > 0 && !isTickerDismissed && latestCritical && (
        <div className="bg-red-950/80 border-b border-red-500/50 px-4 py-2 flex items-center justify-between gap-3 text-xs z-30 select-none">
          <div className="flex items-center gap-2.5 min-w-0">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold uppercase text-[10px] shrink-0">
              <AlertOctagon className="w-3.5 h-3.5" />
              CRITICAL INCIDENT ({criticalAlerts.length})
            </span>
            <span className="font-semibold text-red-200 truncate">
              Target Vehicle: {latestCritical.registration_number} ({latestCritical.category || "WATCHLIST TARGET"})
            </span>
            {latestCritical.camera_id && (
              <span className="text-red-300/80 font-mono hidden md:inline truncate">
                • Camera: {latestCritical.camera_id}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => navigate(latestCritical.alert_id ? `/alerts/${latestCritical.alert_id}` : "/alerts")}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-red-800 hover:bg-red-700 text-white text-[11px] font-semibold transition cursor-pointer"
            >
              <span>Dispatch Action</span>
              <ArrowRight className="w-3 h-3" />
            </button>
            <button
              type="button"
              onClick={() => setIsTickerDismissed(true)}
              aria-label="Dismiss operational ticker"
              className="p-1 text-red-300 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Workspace Layout */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isOpen={isMobileSidebarOpen}
          onClose={() => setIsMobileSidebarOpen(false)}
        />
        <main className={`flex-1 ${isMapRoute ? "overflow-hidden p-2 sm:p-3" : "overflow-y-auto p-4 sm:p-6"} bg-[#050b14] command-content-area`}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
