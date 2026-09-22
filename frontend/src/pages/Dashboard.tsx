import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Camera,
  Car,
  AlertOctagon,
  ShieldCheck,
  Activity,
  ArrowUpRight,
  Clock,
  Radio,
  Eye,
  CheckCircle2,
  AlertTriangle
} from "lucide-react"
import { api } from "../services/api"
import { DashboardStats, AnalyticsData } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { HlsPlayer } from "../components/player/HlsPlayer"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts"

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [s, a] = await Promise.all([
          api.getDashboardStats(),
          api.getDashboardAnalytics(),
        ])
        setStats(s)
        setAnalytics(a)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 8000)
    return () => clearInterval(interval)
  }, [])

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-96 text-police-400">
        <Activity className="w-8 h-8 animate-spin mr-3" />
        <span>Loading Command Centre Intelligence...</span>
      </div>
    )
  }

  const statCards = [
    {
      title: "Active CCTV Streams",
      value: `${stats?.online_cameras || 30} / ${stats?.total_cameras || 30}`,
      subtitle: "30 Cameras Registered",
      icon: Camera,
      color: "text-emerald-400",
      bg: "bg-emerald-950/40 border-emerald-500/30",
      link: "/cameras",
    },
    {
      title: "Identified Vehicles",
      value: stats?.total_observed_vehicles || 0,
      subtitle: `${stats?.total_sightings || 0} Sightings Logged`,
      icon: Car,
      color: "text-blue-400",
      bg: "bg-blue-950/40 border-blue-500/30",
      link: "/vehicles",
    },
    {
      title: "Watchlist Alerts",
      value: stats?.active_alerts || 0,
      subtitle: `${stats?.critical_alerts || 0} Critical Priority`,
      icon: AlertOctagon,
      color: stats?.active_alerts ? "text-red-400" : "text-slate-400",
      bg: stats?.active_alerts ? "bg-red-950/40 border-red-500/40 animate-pulse" : "bg-slate-900/40 border-slate-700/40",
      link: "/alerts",
    },
    {
      title: "Active Watchlist Targets",
      value: stats?.active_watchlist_targets || 0,
      subtitle: "Synthetic Test Pool",
      icon: ShieldCheck,
      color: "text-purple-400",
      bg: "bg-purple-950/40 border-purple-500/30",
      link: "/watchlist",
    },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Gujarat Police Command Centre */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-gradient-to-r from-police-900 via-police-850 to-police-900 border border-police-700/60 shadow-lg">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Operational Situational Awareness</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-mono">
              ● REAL-TIME
            </span>
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Hybrid Model 5 Architecture: Central Catalogue + Gateway Federation + Live Ingestion
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/videowall")}
            className="flex items-center gap-2 px-3.5 py-2 bg-police-700 hover:bg-police-600 rounded-lg text-xs font-semibold text-white transition shadow-sm"
          >
            <Radio className="w-3.5 h-3.5 text-red-400 animate-pulse" />
            Open Video Wall
          </button>
          <button
            onClick={() => navigate("/map")}
            className="flex items-center gap-2 px-3.5 py-2 bg-police-800 hover:bg-police-750 rounded-lg text-xs font-semibold text-police-200 border border-police-700 transition"
          >
            GIS Map
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <div
              key={i}
              onClick={() => navigate(card.link)}
              className={`p-5 rounded-xl border ${card.bg} cursor-pointer hover:border-police-400/50 transition-all flex flex-col justify-between`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs font-medium text-slate-400">{card.title}</div>
                  <div className="text-2xl font-black text-white mt-1 font-mono tracking-tight">
                    {card.value}
                  </div>
                </div>
                <div className={`p-2.5 rounded-lg bg-police-900/80 border border-police-700/50 ${card.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-police-800/60">
                <span>{card.subtitle}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-police-400" />
              </div>
            </div>
          )
        })}
      </div>

      {/* Main Grid: Live Feed + Sighting feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Primary Stream Spotlight */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-police-400" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">
                Primary Surveillance Monitor (Camera 01)
              </h3>
            </div>
            <span className="text-xs text-police-400 font-mono">1080p @ 30 FPS</span>
          </div>

          <div className="h-[360px] w-full rounded-xl overflow-hidden border border-police-800 shadow-2xl">
            <HlsPlayer
              cameraId="cam01"
              cameraName="Chiman bhai Bridge"
              autoPlay={true}
              className="w-full h-full"
            />
          </div>

          {/* Quick Camera strip */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {["cam02", "cam03", "cam04", "cam05"].map((cid) => (
              <button
                key={cid}
                onClick={() => navigate(`/cameras/${cid}`)}
                className="p-2 rounded-lg bg-police-900/70 hover:bg-police-800/80 border border-police-800 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-mono font-bold text-white uppercase">{cid}</div>
                  <div className="text-[10px] text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span> ONLINE
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-police-500" />
              </button>
            ))}
          </div>
        </div>

        {/* Real-time ANPR Observations Feed */}
        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-police-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 flex items-center gap-2">
                <Car className="w-4 h-4 text-blue-400" />
                Latest ANPR Reads
              </h3>
              <button
                onClick={() => navigate("/vehicles")}
                className="text-xs text-police-400 hover:text-police-300 font-medium"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2.5 mt-3 max-h-[380px] overflow-y-auto pr-1">
              {stats?.recent_anpr_observations && stats.recent_anpr_observations.length > 0 ? (
                stats.recent_anpr_observations.map((obs, idx) => (
                  <div
                    key={idx}
                    onClick={() => navigate(`/vehicles/${obs.registration_number}`)}
                    className="p-2.5 rounded-lg bg-police-950/70 hover:bg-police-850 border border-police-800/70 transition cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      {obs.evidence_url ? (
                        <img
                          src={obs.evidence_url}
                          alt="Plate Evidence"
                          className="w-10 h-6 object-cover rounded border border-police-700"
                          onError={(e) => { (e.currentTarget as HTMLElement).style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-6 bg-police-900 rounded border border-police-700 flex items-center justify-center text-[10px] font-mono text-slate-500">
                          N/A
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-mono font-bold text-white">
                          {obs.registration_number}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {obs.camera_id} • PTS {obs.first_seen_pts_ms ? `${(obs.first_seen_pts_ms / 1000).toFixed(1)}s` : "Local"}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-mono text-emerald-400 font-semibold">
                        {(obs.consensus_score * 100).toFixed(0)}%
                      </div>
                      <div className="text-[9px] text-slate-500">Consensus</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-400 text-center py-8">No recent vehicle sightings.</div>
              )}
            </div>
          </div>

          <div className="mt-4 p-2.5 rounded bg-police-950/80 border border-police-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>OCR Multi-frame Consensus:</span>
            <span className="text-emerald-400 font-mono font-semibold">ACTIVE (min 0.05)</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts & Quality Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Observations by Camera */}
        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-police-400" />
            Detection Activity Across Cameras
          </h3>
          <div className="h-56">
            {analytics?.camera_distribution && analytics.camera_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.camera_distribution}>
                  <XAxis dataKey="camera_id" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1528", borderColor: "#1e3a6a", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" fill="#3262b2" radius={[4, 4, 0, 0]}>
                    {analytics.camera_distribution.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3262b2" : "#5b8be0"} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Awaiting camera activity data...
              </div>
            )}
          </div>
        </div>

        {/* ANPR Quality Distribution */}
        <div className="p-4 rounded-xl bg-police-900/60 border border-police-800">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200 mb-4 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            License Plate Recognition Quality Bins
          </h3>
          <div className="h-56">
            {analytics?.quality_distribution && analytics.quality_distribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.quality_distribution} layout="vertical">
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="range" stroke="#64748b" fontSize={11} width={85} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#0b1528", borderColor: "#1e3a6a", borderRadius: "8px", fontSize: "12px" }}
                  />
                  <Bar dataKey="count" fill="#10b981" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                Awaiting quality telemetry...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
