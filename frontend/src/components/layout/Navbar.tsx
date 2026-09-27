import React, { useState, useEffect } from "react"
import { Shield, Bell, UserCheck, Menu, X, Clock } from "lucide-react"
import { useAuth, UserRole } from "../../context/AuthContext"
import { api } from "../../services/api"
import { useNavigate, useLocation } from "react-router-dom"
import { GlobalDataStatus } from "../common/GlobalDataStatus"

interface NavbarProps {
  onToggleMobileSidebar?: () => void
  isMobileSidebarOpen?: boolean
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileSidebar,
  isMobileSidebarOpen = false,
}) => {
  const { role, operatorName, badgeNumber, setRole } = useAuth()
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0)
  const [criticalCount, setCriticalCount] = useState<number>(0)
  const [istTime, setIstTime] = useState<string>("")
  const navigate = useNavigate()
  const location = useLocation()

  const getPageTitle = (path: string): string => {
    if (path === "/" || path === "") return "Operational Dashboard"
    if (path.startsWith("/cameras/") && path !== "/cameras") return "Camera Node Console"
    if (path.startsWith("/cameras")) return "Camera Registry"
    if (path.startsWith("/videowall")) return "Live Video Wall"
    if (path.startsWith("/map")) return "GIS Surveillance Map"
    if (path.startsWith("/vehicles/") && path !== "/vehicles") return "Vehicle Dossier"
    if (path.startsWith("/vehicles")) return "Vehicle Intelligence"
    if (path.startsWith("/journey")) return "Journey Trajectory"
    if (path.startsWith("/watchlist")) return "Watchlist Targets"
    if (path.startsWith("/alerts/") && path !== "/alerts") return "Incident Decision Dossier"
    if (path.startsWith("/alerts")) return "Incident Alerts"
    if (path.startsWith("/health")) return "Gateway Diagnostics"
    if (path.startsWith("/synthetic")) return "Synthetic AI Studio"
    return "Command Centre"
  }

  // Display-only Indian Standard Time (IST) Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      try {
        const formatted = new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(now)
        setIstTime(`${formatted} IST`)
      } catch {
        setIstTime(`${now.toTimeString().split(" ")[0]} IST`)
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // Poll actual alert counts
  useEffect(() => {
    let isMounted = true

    const fetchAlertCount = async () => {
      try {
        const alerts = await api.getAlerts()
        if (!isMounted) return

        if (Array.isArray(alerts)) {
          const unhandled = alerts.filter(
            (a) => a.status === "NEW" || a.status === "UNDER_REVIEW"
          )
          setActiveAlertsCount(unhandled.length)
          const critical = unhandled.filter((a) => a.priority === "CRITICAL")
          setCriticalCount(critical.length)
        }
      } catch {
        // Silently fail on poll without fabricating
      }
    }

    fetchAlertCount()
    const interval = setInterval(fetchAlertCount, 8000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="h-16 bg-[#060d1b] border-b border-[#1e3a6a]/80 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-50 select-none">
      {/* Brand & Crest with Responsive Hamburger */}
      <div className="flex items-center gap-3 min-w-0">
        {/* Mobile toggle button */}
        <button
          type="button"
          onClick={onToggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
          className="lg:hidden p-1.5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] text-slate-300 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Gujarat Police Emblem Crest (Preserved EXACTLY) */}
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#274c8b] to-[#132442] border border-[#5b8be0]/40 flex items-center justify-center shadow-md shrink-0">
          <Shield className="w-5 h-5 text-amber-300" />
        </div>

        {/* Brand Text Hierarchy & Section Context */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold tracking-tight text-white uppercase font-sans truncate">
                Gujarat Police
              </span>
              <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 font-mono font-semibold shrink-0">
                COMMAND CENTRE
              </span>
            </div>
          </div>

          <span className="text-[#1e3a6a] hidden sm:inline">|</span>

          <span className="text-xs font-medium text-slate-300 hidden sm:inline truncate">
            {getPageTitle(location.pathname)}
          </span>
        </div>
      </div>

      {/* Right: Operational Controls, Clock, Status, Alerts, Role */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* IST Clock */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#08101e] border border-[#1e3a6a] text-xs font-mono text-slate-300">
          <Clock className="w-3.5 h-3.5 text-sky-400" />
          <span className="tabular-nums font-semibold tracking-wide text-white">
            {istTime || "--:--:-- IST"}
          </span>
        </div>

        {/* Global Operational Status */}
        <GlobalDataStatus />

        {/* Alerts indicator button */}
        <button
          type="button"
          onClick={() => navigate("/alerts")}
          title={`${activeAlertsCount} active alerts (${criticalCount} critical)`}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] text-slate-200 transition cursor-pointer"
        >
          <Bell className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-semibold hidden md:inline">Alerts</span>
          {activeAlertsCount > 0 && (
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white ${
                criticalCount > 0
                  ? "bg-red-600 status-pulse-dot"
                  : "bg-amber-600"
              }`}
            >
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Operator Role Selector (Preserved with authentic Gujarat Police roles) */}
        <div className="flex items-center gap-2 bg-[#0b1528] border border-[#1e3a6a] rounded-lg px-2.5 py-1 text-left">
          <UserCheck className="w-4 h-4 text-sky-400 shrink-0 hidden sm:block" />
          <div className="text-left">
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              aria-label="Select operator role"
              className="bg-transparent text-[11px] font-bold text-white border-none focus:outline-none cursor-pointer pr-1"
            >
              <option value="Control Room Operator" className="bg-[#0b1528] text-white">
                Control Room Operator
              </option>
              <option value="Senior Investigator" className="bg-[#0b1528] text-white">
                Senior Investigator
              </option>
              <option value="System Administrator" className="bg-[#0b1528] text-white">
                System Administrator
              </option>
              <option value="Field Officer" className="bg-[#0b1528] text-white">
                Field Officer
              </option>
            </select>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              {operatorName} ({badgeNumber})
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
