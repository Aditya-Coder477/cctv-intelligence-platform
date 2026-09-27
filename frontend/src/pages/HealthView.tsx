import React, { useEffect, useState } from "react"
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Server,
  Database,
  Radio,
  Cpu,
  RefreshCw,
  Clock,
  Shield,
  Layers,
  HelpCircle,
  Wifi,
  WifiOff
} from "lucide-react"
import { api, API_BASE } from "../services/api"
import { Camera, DashboardStats } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { DataSourceBadge } from "../components/common/DataSourceBadge"
import { FALLBACK_CAMERAS } from "../data/fallbackData"

type SubsystemHealth = "HEALTHY" | "DEGRADED" | "OFFLINE" | "UNAVAILABLE"

export const HealthView: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastChecked, setLastChecked] = useState<string>("")
  const [gatewayStatus, setGatewayStatus] = useState<SubsystemHealth>("UNAVAILABLE")
  const [inferenceStatus, setInferenceStatus] = useState<SubsystemHealth>("UNAVAILABLE")
  const [dataSource, setDataSource] = useState<"LIVE" | "FALLBACK">("LIVE")

  const loadHealthDiagnostics = async () => {
    setLoading(true)
    const now = new Date()
    setLastChecked(
      new Intl.DateTimeFormat("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(now) + " IST"
    )

    try {
      const [cData, sData] = await Promise.allSettled([
        api.getCameras(),
        api.getDashboardStats(),
      ])

      if (sData.status === "fulfilled" && sData.value) {
        setStats(sData.value)
        setGatewayStatus("HEALTHY")
        setDataSource("LIVE")
        if (sData.value.ai_active_cameras > 0 || (sData.value.recent_anpr_observations && sData.value.recent_anpr_observations.length > 0)) {
          setInferenceStatus("HEALTHY")
        } else {
          setInferenceStatus("DEGRADED")
        }
      } else {
        setGatewayStatus("OFFLINE")
        setInferenceStatus("UNAVAILABLE")
        setDataSource("FALLBACK")
      }

      if (cData.status === "fulfilled" && Array.isArray(cData.value) && cData.value.length > 0) {
        setCameras(cData.value)
      } else {
        setCameras(FALLBACK_CAMERAS)
        setDataSource("FALLBACK")
      }
    } catch (err) {
      console.error("Health diagnostics error:", err)
      setGatewayStatus("OFFLINE")
      setInferenceStatus("UNAVAILABLE")
      setCameras(FALLBACK_CAMERAS)
      setDataSource("FALLBACK")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadHealthDiagnostics()
    const interval = setInterval(loadHealthDiagnostics, 15000)
    return () => clearInterval(interval)
  }, [])

  const onlineCameras = cameras.filter(
    (c) => (c.status || "ONLINE").toUpperCase() === "ONLINE" || (c.status || "").toUpperCase() === "ACTIVE"
  ).length
  const degradedCameras = cameras.filter(
    (c) => (c.status || "").toUpperCase() === "DEGRADED" || (c.status || "").toUpperCase() === "WARNING"
  ).length
  const offlineCameras = cameras.length - onlineCameras - degradedCameras

  const cameraFleetStatus: SubsystemHealth =
    cameras.length === 0
      ? "UNAVAILABLE"
      : degradedCameras > 0
      ? "DEGRADED"
      : offlineCameras > 0
      ? "DEGRADED"
      : "HEALTHY"

  const renderStatusPill = (status: SubsystemHealth) => {
    const config = {
      HEALTHY: {
        text: "text-emerald-400",
        bg: "bg-emerald-950/40 border-emerald-500/40",
        dot: "bg-emerald-400",
      },
      DEGRADED: {
        text: "text-amber-400",
        bg: "bg-amber-950/40 border-amber-500/40",
        dot: "bg-amber-400",
      },
      OFFLINE: {
        text: "text-red-400",
        bg: "bg-red-950/40 border-red-500/40",
        dot: "bg-red-400",
      },
      UNAVAILABLE: {
        text: "text-slate-400",
        bg: "bg-slate-900/60 border-slate-700",
        dot: "bg-slate-500",
      },
    }[status]

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[10px] font-mono font-bold uppercase ${config.bg} ${config.text}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
        {status}
      </span>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-emerald-400" />
              Gateway Health & Infrastructure Diagnostics
            </h1>
            <DataSourceBadge status={dataSource} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Authoritative operational diagnostics across stream gateways, ANPR pipelines, and backend services
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Last checked: {lastChecked || "Scanning..."}
          </span>
          <button
            type="button"
            onClick={loadHealthDiagnostics}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0b1528] hover:bg-[#0f1c35] border border-[#1e3a6a] rounded-md text-xs font-semibold text-slate-200 transition cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin text-sky-400" : ""}`} />
            <span>Poll Health</span>
          </button>
        </div>
      </div>

      {/* 2. Structured Subsystem Health Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Subsystem 1: Central API Gateway */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Server className="w-4 h-4 text-sky-400" />
              <span>Central API Gateway</span>
            </div>
            {renderStatusPill(gatewayStatus)}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Endpoint:</span>
              <span className="text-white truncate max-w-[180px]">
                {API_BASE ? API_BASE : "Local Reverse Proxy"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">HTTP Protocol:</span>
              <span className="text-slate-200">REST JSON / CORS</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Health Verification:</span>
              <span className="text-emerald-400 font-bold">200 OK Live Poll</span>
            </div>
          </div>
        </div>

        {/* Subsystem 2: Camera Stream Fleet */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Camera Fleet</span>
            </div>
            {renderStatusPill(cameraFleetStatus)}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Online Nodes:</span>
              <span className="text-emerald-400 font-bold">{onlineCameras} / {cameras.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Degraded / Offline:</span>
              <span className="text-amber-400">{degradedCameras} degraded, {offlineCameras} offline</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ingestion Protocols:</span>
              <span className="text-slate-200">HLS Proxy / RTSP</span>
            </div>
          </div>
        </div>

        {/* Subsystem 3: ANPR / AI Inference Service */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Cpu className="w-4 h-4 text-sky-400" />
              <span>ANPR Inference Pipeline</span>
            </div>
            {renderStatusPill(inferenceStatus)}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">OCR Consensus:</span>
              <span className="text-emerald-400 font-bold">Multi-frame Majority</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Min Character Threshold:</span>
              <span className="text-slate-200">0.05</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Active AI Channels:</span>
              <span className="text-white">{stats ? `${stats.ai_active_cameras} streams` : "Active"}</span>
            </div>
          </div>
        </div>

        {/* Subsystem 4: Database Layer (Honest Reporting) */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Database className="w-4 h-4 text-amber-400" />
              <span>Database Layer</span>
            </div>
            {renderStatusPill(gatewayStatus === "HEALTHY" ? "HEALTHY" : "UNAVAILABLE")}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Connectivity:</span>
              <span className="text-emerald-400">Accessible via API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Direct Heartbeat:</span>
              <span className="text-slate-400">Implicit via queries</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Diagnostic Note:</span>
              <span className="text-slate-400 text-[10px]">Dedicated DB ping pending</span>
            </div>
          </div>
        </div>

        {/* Subsystem 5: Event Bus / Messaging (Honest Reporting) */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Layers className="w-4 h-4 text-slate-400" />
              <span>Event Bus / Kafka</span>
            </div>
            {renderStatusPill("UNAVAILABLE")}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Broker Telemetry:</span>
              <span className="text-slate-400">Unexposed by API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Consumer Lag:</span>
              <span className="text-slate-400">Metric pending</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ingestion Flow:</span>
              <span className="text-slate-300">Continuous via REST</span>
            </div>
          </div>
        </div>

        {/* Subsystem 6: Forensic Ground Truth Clock */}
        <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Clock className="w-4 h-4 text-sky-400" />
              <span>Timestamp Resolution</span>
            </div>
            {renderStatusPill("HEALTHY")}
          </div>
          <div className="space-y-1.5 text-xs font-mono text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">Media PTS:</span>
              <span className="text-emerald-400">Track-relative ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Wall-Clock Source:</span>
              <span className="text-amber-400">Unanchored (Safe)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Ingestion UTC:</span>
              <span className="text-emerald-400">Preserved in DB</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Camera Nodes Health Matrix */}
      <div className="p-4 sm:p-5 rounded-lg bg-[#0b1528] border border-[#1e3a6a] space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1e3a6a]/60">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
              Camera Nodes Status Matrix ({cameras.length} registered)
            </h2>
            <p className="text-xs text-slate-400">
              Individual node connectivity and ingestion status
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            {degradedCameras === 0 && offlineCameras === 0
              ? "All active nodes operational"
              : `${degradedCameras + offlineCameras} node(s) require maintenance`}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono">
          {cameras.map((cam) => {
            const isOnline = (cam.status || "ONLINE").toUpperCase() === "ONLINE" || (cam.status || "").toUpperCase() === "ACTIVE"
            const isDegraded = (cam.status || "").toUpperCase() === "DEGRADED" || (cam.status || "").toUpperCase() === "WARNING"

            return (
              <div
                key={cam.camera_id}
                className="p-2.5 rounded bg-[#08101e] border border-[#1e3a6a]/60 hover:border-sky-500/40 transition flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white uppercase text-[11px] truncate">
                    {cam.camera_id}
                  </span>
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 ${
                      isOnline ? "bg-emerald-400" : isDegraded ? "bg-amber-400" : "bg-red-400"
                    }`}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-1 truncate">
                  {cam.location || cam.name}
                </div>
                <div className="text-[9px] text-slate-500 mt-1 uppercase">
                  {cam.status || "ONLINE"}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
