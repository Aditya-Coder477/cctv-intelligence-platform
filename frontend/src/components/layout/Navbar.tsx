import React, { useState, useEffect } from "react"
import { Shield, Bell, AlertTriangle, UserCheck, ShieldAlert, Wifi, Sun, Moon } from "lucide-react"
import { useAuth, UserRole } from "../../context/AuthContext"
import { useTheme } from "../../context/ThemeContext"
import { api } from "../../services/api"
import { useNavigate } from "react-router-dom"

export const Navbar: React.FC = () => {
  const { role, operatorName, badgeNumber, setRole } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const [activeAlertsCount, setActiveAlertsCount] = useState<number>(0)
  const [criticalCount, setCriticalCount] = useState<number>(0)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchAlertCount = async () => {
      try {
        const alerts = await api.getAlerts()
        const unhandled = alerts.filter((a) => a.status === "NEW" || a.status === "UNDER_REVIEW")
        setActiveAlertsCount(unhandled.length)
        const critical = unhandled.filter((a) => a.priority === "CRITICAL")
        setCriticalCount(critical.length)
      } catch (err) {
        // silent fail on poll
      }
    }

    fetchAlertCount()
    const interval = setInterval(fetchAlertCount, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="h-16 bg-police-950 border-b border-police-800/80 px-6 flex items-center justify-between sticky top-0 z-50">
      {/* Brand & Crest */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-police-600 to-police-800 border border-police-400/40 flex items-center justify-center shadow-lg shadow-police-900/50">
          <Shield className="w-5 h-5 text-amber-300" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold tracking-tight text-white uppercase font-sans">
              Gujarat Police
            </h1>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-medium">
              COMMAND CENTRE
            </span>
          </div>
          <p className="text-xs text-police-400 font-medium">
            AI-Powered CCTV Intelligence & Multi-Camera Journey Analysis
          </p>
        </div>
      </div>

      {/* Center live badge */}
      <div className="hidden md:flex items-center gap-3 bg-police-900/80 px-4 py-1.5 rounded-full border border-police-700/50 text-xs">
        <div className="flex items-center gap-1.5 text-emerald-400 font-mono">
          <Wifi className="w-3.5 h-3.5" />
          <span>GW CONNECTED</span>
        </div>
        <span className="text-police-600">|</span>
        <span className="text-slate-300 font-mono">30 CAMERAS ACTIVE</span>
        <span className="text-police-600">|</span>
        <span className="text-purple-400 font-mono text-[11px]">HYBRID MODEL 5</span>
      </div>

      {/* Right controls: Theme Toggle, Alerts & Role switcher */}
      <div className="flex items-center gap-3">
        {/* Dark / Light Mode Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-police-900 hover:bg-police-850 border border-police-700/60 text-slate-200 transition cursor-pointer group"
        >
          {theme === "dark" ? (
            <>
              <Sun className="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline text-amber-300">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-cyan-400 group-hover:-rotate-12 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline text-cyan-300">Dark</span>
            </>
          )}
        </button>

        {/* Alerts quick badge */}
        <button
          onClick={() => navigate("/alerts")}
          className="relative flex items-center gap-2 px-3 py-1.5 rounded-md bg-police-900 hover:bg-police-850 border border-police-700/60 text-slate-200 transition cursor-pointer"
        >
          <Bell className="w-4 h-4 text-police-400" />
          <span className="text-xs font-semibold">Alerts</span>
          {activeAlertsCount > 0 && (
            <span className={`px-1.5 py-0.2 rounded-full text-[11px] font-bold text-white ${criticalCount > 0 ? "bg-red-600 animate-pulse" : "bg-amber-600"}`}>
              {activeAlertsCount}
            </span>
          )}
        </button>

        {/* Role Selector */}
        <div className="flex items-center gap-2.5 bg-police-900/90 border border-police-700/60 rounded-lg px-3 py-1.5">
          <UserCheck className="w-4 h-4 text-police-400" />
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                aria-label="Select operator role"
                className="bg-transparent text-xs font-bold text-white border-none focus:outline-none cursor-pointer pr-2"
              >
                <option value="Control Room Operator" className="bg-police-900 text-white">Control Room Operator</option>
                <option value="Senior Investigator" className="bg-police-900 text-white">Senior Investigator</option>
                <option value="System Administrator" className="bg-police-900 text-white">System Administrator</option>
                <option value="Field Officer" className="bg-police-900 text-white">Field Officer</option>
              </select>
            </div>
            <div className="text-[11px] text-police-400 font-mono">
              {operatorName} ({badgeNumber})
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
