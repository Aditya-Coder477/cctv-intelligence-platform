import React from "react"
import { NavLink } from "react-router-dom"
import {
  LayoutDashboard,
  Camera,
  MapPin,
  LayoutGrid,
  Car,
  BookmarkCheck,
  AlertOctagon,
  Activity,
  Layers,
  ChevronRight,
  Sparkles
} from "lucide-react"
import clsx from "clsx"

interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  badge?: string
}

export const Sidebar: React.FC = () => {
  const navItems: NavItem[] = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/cameras", label: "Camera Inventory", icon: Camera },
    { to: "/map", label: "GIS Surveillance Map", icon: MapPin },
    { to: "/videowall", label: "Live Video Wall", icon: LayoutGrid, badge: "LIVE" },
    { to: "/synthetic", label: "Synthetic AI Studio", icon: Sparkles, badge: "AI HUD" },
    { to: "/vehicles", label: "Vehicle Intelligence", icon: Car },
    { to: "/watchlist", label: "Watchlist Targets", icon: BookmarkCheck, badge: "DEMO" },
    { to: "/alerts", label: "Alerts & Dispatches", icon: AlertOctagon },
    { to: "/health", label: "Gateway Health", icon: Activity },
  ]

  return (
    <aside className="w-64 bg-police-950/95 border-r border-police-800/80 flex flex-col justify-between p-4 shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold text-police-400 tracking-wider uppercase">
            Surveillance Operations
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  className={({ isActive }) =>
                    clsx(
                      "flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group",
                      isActive
                        ? "bg-police-800 text-white border-l-4 border-police-400 font-semibold shadow-sm shadow-police-900"
                        : "text-slate-400 hover:text-slate-200 hover:bg-police-900/60"
                    )
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 transition-transform group-hover:scale-110 text-police-400 group-hover:text-white" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-police-700 text-police-200 font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* System Architecture Reference Card */}
        <div className="p-3 rounded-lg bg-police-900/60 border border-police-800 text-xs">
          <div className="flex items-center gap-2 text-police-300 font-semibold mb-1">
            <Layers className="w-3.5 h-3.5 text-police-400" />
            <span>Architecture</span>
          </div>
          <div className="text-[11px] text-slate-400 space-y-1">
            <div className="flex justify-between">
              <span>Integration</span>
              <span className="text-police-300 font-mono">Hybrid Model 5</span>
            </div>
            <div className="flex justify-between">
              <span>Catalogue</span>
              <span className="text-police-300 font-mono">30 Cameras</span>
            </div>
            <div className="flex justify-between">
              <span>ANPR Engine</span>
              <span className="text-police-300 font-mono">YOLOv8 + EasyOCR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-police-900 text-[11px] text-police-500 font-mono">
        <div>Gujarat Police Command v1.4.0</div>
        <div className="text-[10px] text-slate-500">Authorized Personnel Only</div>
      </div>
    </aside>
  )
}
