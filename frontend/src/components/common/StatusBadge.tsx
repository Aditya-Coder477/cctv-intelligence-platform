import React from "react"
import clsx from "clsx"

interface StatusBadgeProps {
  type: "priority" | "health" | "recognition" | "synthetic" | "alert_status" | "general"
  value: string
  size?: "sm" | "md"
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ type, value, size = "md" }) => {
  const v = value?.toUpperCase() || ""
  const sizeClasses = size === "sm" ? "px-1.5 py-0.5 text-xs" : "px-2.5 py-1 text-xs font-semibold"

  if (type === "synthetic" || v === "SYNTHETIC_DEMO") {
    return (
      <span className={clsx("inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-950/60 text-purple-300 uppercase tracking-wider font-mono", sizeClasses)}>
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse"></span>
        SYNTHETIC DEMO
      </span>
    )
  }

  if (type === "priority") {
    const map: Record<string, string> = {
      CRITICAL: "border-red-500/50 bg-red-950/60 text-red-300",
      HIGH: "border-orange-500/50 bg-orange-950/60 text-orange-300",
      MEDIUM: "border-yellow-500/50 bg-yellow-950/60 text-yellow-300",
      LOW: "border-blue-500/50 bg-blue-950/60 text-blue-300",
    }
    return (
      <span className={clsx("inline-flex items-center rounded-md border uppercase tracking-wider font-mono", map[v] || "border-slate-600 bg-slate-800 text-slate-300", sizeClasses)}>
        {v}
      </span>
    )
  }

  if (type === "health") {
    const isOnline = v === "ONLINE" || v === "ACTIVE"
    return (
      <span className={clsx(
        "inline-flex items-center gap-1.5 rounded-full border font-mono tracking-wider",
        isOnline ? "border-emerald-500/40 bg-emerald-950/50 text-emerald-300" : "border-red-500/40 bg-red-950/50 text-red-300",
        sizeClasses
      )}>
        <span className={clsx("w-2 h-2 rounded-full", isOnline ? "bg-emerald-400 animate-pulse" : "bg-red-400")} />
        {v}
      </span>
    )
  }

  if (type === "recognition") {
    const map: Record<string, string> = {
      CONFIRMED: "border-emerald-500/50 bg-emerald-950/60 text-emerald-300",
      UNCERTAIN: "border-amber-500/50 bg-amber-950/60 text-amber-300",
      UNREADABLE: "border-slate-600 bg-slate-800 text-slate-400",
    }
    return (
      <span className={clsx("inline-flex items-center rounded border uppercase font-mono tracking-wider", map[v] || "border-slate-600 bg-slate-800 text-slate-300", sizeClasses)}>
        {v}
      </span>
    )
  }

  if (type === "alert_status") {
    const map: Record<string, string> = {
      NEW: "border-red-500 bg-red-950 text-red-200 animate-pulse",
      ACKNOWLEDGED: "border-blue-500/50 bg-blue-950/60 text-blue-300",
      UNDER_REVIEW: "border-amber-500/50 bg-amber-950/60 text-amber-300",
      ESCALATED: "border-purple-500/50 bg-purple-950/60 text-purple-300",
      RESOLVED: "border-emerald-500/50 bg-emerald-950/60 text-emerald-300",
      DISMISSED: "border-slate-600 bg-slate-800 text-slate-400",
    }
    return (
      <span className={clsx("inline-flex items-center rounded-md border uppercase font-mono tracking-wider font-semibold", map[v] || "border-slate-600 bg-slate-800 text-slate-300", sizeClasses)}>
        {v}
      </span>
    )
  }

  return (
    <span className={clsx("inline-flex items-center rounded border border-slate-700 bg-slate-800 text-slate-300 font-mono", sizeClasses)}>
      {v}
    </span>
  )
}
