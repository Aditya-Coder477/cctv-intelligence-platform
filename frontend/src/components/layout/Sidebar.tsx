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
  Sparkles,
  ShieldAlert,
  X
} from "lucide-react"
import clsx from "clsx"

export interface NavItem {
  to: string
  label: string
  icon: React.ElementType
  badge?: string
  badgeVariant?: "live" | "demo" | "hud"
}

interface SidebarProps {
  isOpen?: boolean
  onClose?: () => void
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen = false,
  onClose,
}) => {
  const navGroups: NavGroup[] = [
    {
      title: "OPERATIONS",
      items: [
        { to: "/", label: "Dashboard", icon: LayoutDashboard },
        { to: "/cameras", label: "Cameras", icon: Camera },
        { to: "/videowall", label: "Live Video Wall", icon: LayoutGrid },
        { to: "/map", label: "GIS Surveillance Map", icon: MapPin },
      ],
    },
    {
      title: "INTELLIGENCE",
      items: [
        { to: "/vehicles", label: "Vehicles", icon: Car },
        { to: "/watchlist", label: "Watchlist", icon: BookmarkCheck },
      ],
    },
    {
      title: "RESPONSE",
      items: [
        { to: "/alerts", label: "Alerts & Dispatch", icon: AlertOctagon },
      ],
    },
    {
      title: "SYSTEM",
      items: [
        { to: "/health", label: "Gateway Health", icon: Activity },
        {
          to: "/synthetic",
          label: "AI Studio (Testing)",
          icon: Sparkles,
          badge: "WORKSPACE",
          badgeVariant: "demo",
        },
      ],
    },
  ]

  const renderBadge = (item: NavItem) => {
    if (!item.badge) return null

    if (item.badgeVariant === "live") {
      return (
        <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/40 text-emerald-300 font-mono font-semibold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 status-pulse-dot" />
          {item.badge}
        </span>
      )
    }

    if (item.badgeVariant === "demo") {
      return (
        <span className="text-[9px] px-1.5 py-0.5 rounded border border-purple-500/40 bg-purple-950/40 text-purple-300 font-mono font-semibold">
          {item.badge}
        </span>
      )
    }

    return (
      <span className="text-[9px] px-1.5 py-0.5 rounded border border-sky-500/40 bg-sky-950/40 text-sky-300 font-mono font-semibold">
        {item.badge}
      </span>
    )
  }

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full p-3 select-none">
      <div className="space-y-4">
        {/* Mobile Close header */}
        {onClose && (
          <div className="flex lg:hidden items-center justify-between px-2 pb-2 border-b border-[#1e3a6a]/60">
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase font-mono">
              COMMAND NAVIGATION
            </span>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close navigation"
              className="p-1 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Grouped Navigation */}
        <nav className="space-y-4">
          {navGroups.map((group) => (
            <div key={group.title} className="space-y-1">
              <div className="px-2 py-1 text-[10px] font-bold text-slate-400 font-mono tracking-wider uppercase">
                {group.title}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.to === "/"}
                      onClick={() => {
                        if (onClose) onClose()
                      }}
                      className={({ isActive }) =>
                        clsx(
                          "flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-medium transition-colors group",
                          isActive
                            ? "bg-[#132442] text-white border-l-2 border-sky-400 font-semibold"
                            : "text-slate-300 hover:text-white hover:bg-[#0f1c35]/80"
                        )
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <div className="flex items-center gap-2.5 min-w-0">
                            <Icon
                              className={clsx(
                                "w-4 h-4 shrink-0 transition-colors",
                                isActive
                                  ? "text-sky-400"
                                  : "text-slate-400 group-hover:text-slate-200"
                              )}
                            />
                            <span className="truncate">{item.label}</span>
                          </div>
                          {renderBadge(item)}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* Operational Classification & Footer info */}
      <div className="pt-4 border-t border-[#1e3a6a]/60 space-y-2 text-slate-400 font-mono text-[11px]">
        <div className="flex items-center gap-1.5 text-amber-400/90 text-[10px] font-semibold">
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
          <span>RESTRICTED ACCESS</span>
        </div>
        <div className="text-[10px] text-slate-300 font-semibold">
          Gujarat Police Command v1.4.0
        </div>
        <div className="text-[9px] text-slate-500">
          Authorized Personnel Only // State CCTV Intelligence Network
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Static Sidebar */}
      <aside className="hidden lg:flex w-64 bg-[#060d1b] border-r border-[#1e3a6a]/80 shrink-0 min-h-[calc(100vh-4rem)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer Slide-over */}
      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#060d1b] border-r border-[#1e3a6a] transform transition-transform duration-200 ease-in-out lg:hidden pt-16 shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
