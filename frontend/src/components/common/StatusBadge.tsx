import React from "react"
import clsx from "clsx"

export interface StatusBadgeProps {
  type: "priority" | "health" | "recognition" | "synthetic" | "alert_status" | "general" | "data_source"
  value: string
  size?: "sm" | "md"
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  value,
  size = "md",
  className = "",
}) => {
  const v = (value || "").toUpperCase().trim()
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"

  // Synthetic demo badge
  if (type === "synthetic" || v === "SYNTHETIC_DEMO" || v === "SYNTHETIC") {
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded border border-purple-500/40 bg-purple-950/40 text-purple-300 uppercase tracking-wider font-mono font-medium",
          sizeClasses,
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-purple-400 status-pulse-dot" />
        SYNTHETIC DEMO
      </span>
    )
  }

  // Priority / Severity
  if (type === "priority") {
    const priorityMap: Record<string, { border: string; bg: string; text: string; dot?: string }> = {
      CRITICAL: {
        border: "border-red-500/50",
        bg: "bg-red-950/40",
        text: "text-red-300",
        dot: "bg-red-400",
      },
      HIGH: {
        border: "border-amber-500/50",
        bg: "bg-amber-950/40",
        text: "text-amber-300",
        dot: "bg-amber-400",
      },
      MEDIUM: {
        border: "border-yellow-500/40",
        bg: "bg-yellow-950/30",
        text: "text-yellow-300",
        dot: "bg-yellow-400",
      },
      LOW: {
        border: "border-sky-500/40",
        bg: "bg-sky-950/30",
        text: "text-sky-300",
        dot: "bg-sky-400",
      },
    }

    const style = priorityMap[v] || {
      border: "border-slate-700",
      bg: "bg-slate-900/60",
      text: "text-slate-300",
    }

    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded border uppercase tracking-wider font-mono font-semibold",
          style.border,
          style.bg,
          style.text,
          sizeClasses,
          className
        )}
      >
        {style.dot && <span className={clsx("w-1.5 h-1.5 rounded-full", style.dot, v === "CRITICAL" && "status-pulse-dot")} />}
        {v}
      </span>
    )
  }

  // Device / Stream Health
  if (type === "health") {
    const isOnline = v === "ONLINE" || v === "ACTIVE" || v === "HEALTHY" || v === "CONNECTED"
    const isDegraded = v === "DEGRADED" || v === "WARNING" || v === "UNSTABLE"

    let colorClasses = "border-red-500/40 bg-red-950/30 text-red-300"
    let dotClass = "bg-red-400"

    if (isOnline) {
      colorClasses = "border-emerald-500/40 bg-emerald-950/30 text-emerald-300"
      dotClass = "bg-emerald-400 status-pulse-dot"
    } else if (isDegraded) {
      colorClasses = "border-amber-500/40 bg-amber-950/30 text-amber-300"
      dotClass = "bg-amber-400"
    }

    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded border font-mono tracking-wider font-medium",
          colorClasses,
          sizeClasses,
          className
        )}
      >
        <span className={clsx("w-1.5 h-1.5 rounded-full shrink-0", dotClass)} />
        {v}
      </span>
    )
  }

  // ANPR / OCR Recognition Confidence
  if (type === "recognition") {
    const recogMap: Record<string, string> = {
      CONFIRMED: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
      UNCERTAIN: "border-amber-500/40 bg-amber-950/40 text-amber-300",
      UNREADABLE: "border-slate-700 bg-slate-900/60 text-slate-400",
    }
    return (
      <span
        className={clsx(
          "inline-flex items-center rounded border uppercase font-mono tracking-wider font-semibold",
          recogMap[v] || "border-slate-700 bg-slate-900/60 text-slate-300",
          sizeClasses,
          className
        )}
      >
        {v}
      </span>
    )
  }

  // Incident & Alert Lifecycle Status
  if (type === "alert_status") {
    const alertMap: Record<string, string> = {
      NEW: "border-red-500/60 bg-red-950/50 text-red-200 font-bold",
      ACKNOWLEDGED: "border-sky-500/40 bg-sky-950/40 text-sky-300",
      UNDER_REVIEW: "border-amber-500/40 bg-amber-950/40 text-amber-300",
      ESCALATED: "border-purple-500/50 bg-purple-950/50 text-purple-300",
      RESOLVED: "border-emerald-500/40 bg-emerald-950/40 text-emerald-300",
      DISMISSED: "border-slate-700 bg-slate-900/60 text-slate-400",
    }
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded border uppercase font-mono tracking-wider font-semibold",
          alertMap[v] || "border-slate-700 bg-slate-900/60 text-slate-300",
          v === "NEW" && "critical-pulse",
          sizeClasses,
          className
        )}
      >
        {v === "NEW" && <span className="w-1.5 h-1.5 rounded-full bg-red-400 status-pulse-dot" />}
        {v}
      </span>
    )
  }

  // Data source fallback / demo / live / unavailable
  if (type === "data_source") {
    const dsMap: Record<string, { border: string; bg: string; text: string; dot: string }> = {
      LIVE: { border: "border-emerald-500/40", bg: "bg-emerald-950/40", text: "text-emerald-300", dot: "bg-emerald-400" },
      DEMO: { border: "border-purple-500/40", bg: "bg-purple-950/40", text: "text-purple-300", dot: "bg-purple-400" },
      FALLBACK: { border: "border-amber-500/40", bg: "bg-amber-950/40", text: "text-amber-300", dot: "bg-amber-400" },
      UNAVAILABLE: { border: "border-slate-700", bg: "bg-slate-900/60", text: "text-slate-400", dot: "bg-slate-500" },
    }
    const ds = dsMap[v] || dsMap.UNAVAILABLE
    return (
      <span
        className={clsx(
          "inline-flex items-center gap-1.5 rounded border uppercase font-mono tracking-wider font-semibold",
          ds.border,
          ds.bg,
          ds.text,
          sizeClasses,
          className
        )}
      >
        <span className={clsx("w-1.5 h-1.5 rounded-full", ds.dot, v === "LIVE" && "status-pulse-dot")} />
        {v}
      </span>
    )
  }

  // General / Default
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded border border-slate-700 bg-slate-900/60 text-slate-300 font-mono tracking-wider",
        sizeClasses,
        className
      )}
    >
      {v}
    </span>
  )
}
