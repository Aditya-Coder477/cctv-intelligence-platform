import React, { useState, useEffect } from "react"
import { Wifi, AlertCircle } from "lucide-react"
import { api } from "../../services/api"

export const GlobalDataStatus: React.FC = () => {
  const [status, setStatus] = useState<"LIVE" | "FALLBACK" | "OFFLINE">("LIVE")

  useEffect(() => {
    let mounted = true
    const checkHealth = async () => {
      try {
        await api.getDashboardStats()
        if (mounted) setStatus("LIVE")
      } catch {
        if (mounted) setStatus("FALLBACK")
      }
    }
    checkHealth()
    const timer = setInterval(checkHealth, 30000)
    return () => {
      mounted = false
      clearInterval(timer)
    }
  }, [])

  return (
    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-[#1e3a6a]/60 bg-[#070e1b]/80 text-[11px] font-mono text-slate-300">
      <span
        className={`h-2 w-2 rounded-full ${
          status === "LIVE"
            ? "bg-emerald-400 animate-pulse"
            : status === "FALLBACK"
            ? "bg-amber-400"
            : "bg-rose-500"
        }`}
      />
      <span className="text-[10px] uppercase tracking-wider text-slate-400">Feed:</span>
      <span
        className={
          status === "LIVE"
            ? "text-emerald-400 font-semibold"
            : status === "FALLBACK"
            ? "text-amber-400 font-semibold"
            : "text-rose-400 font-semibold"
        }
      >
        {status}
      </span>
    </div>
  )
}
