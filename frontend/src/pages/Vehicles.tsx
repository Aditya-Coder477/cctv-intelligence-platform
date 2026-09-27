import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Car,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  ShieldCheck,
  Calendar,
  Layers,
  Eye,
  CheckCircle2,
  Route,
  ArrowRight,
  Clock,
  Camera
} from "lucide-react"
import { api } from "../services/api"
import { ObservedVehicle, WatchlistEntry } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { DataSourceBadge } from "../components/common/DataSourceBadge"
import { DataTable } from "../components/common/DataTable"
import { EmptyState } from "../components/common/EmptyState"
import { FALLBACK_VEHICLES } from "../data/fallbackData"

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<ObservedVehicle[]>([])
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [search, setSearch] = useState("")
  const [searchInput, setSearchInput] = useState("")
  const [minConsensus, setMinConsensus] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState<"LIVE" | "FALLBACK">("LIVE")
  const navigate = useNavigate()

  const fetchVehiclesAndWatchlist = async () => {
    try {
      const [vData, wData] = await Promise.allSettled([
        api.getVehicles({
          search: search || undefined,
          minConsensus: minConsensus > 0 ? minConsensus : undefined,
        }),
        api.getWatchlist(),
      ])

      if (vData.status === "fulfilled" && Array.isArray(vData.value) && vData.value.length > 0) {
        setVehicles(vData.value)
        setDataSource("LIVE")
      } else if (!search && minConsensus === 0) {
        setVehicles(FALLBACK_VEHICLES)
        setDataSource("FALLBACK")
      } else {
        setVehicles([])
        setDataSource("LIVE")
      }

      if (wData.status === "fulfilled" && Array.isArray(wData.value)) {
        setWatchlist(wData.value)
      }
    } catch (err) {
      console.error("Error fetching vehicles:", err)
      if (!search && minConsensus === 0) {
        setVehicles(FALLBACK_VEHICLES)
        setDataSource("FALLBACK")
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVehiclesAndWatchlist()
  }, [search, minConsensus])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput.trim())
  }

  const formatIST = (isoString?: string | null) => {
    if (!isoString) return null
    try {
      const d = new Date(isoString)
      if (isNaN(d.getTime())) return isoString
      return (
        new Intl.DateTimeFormat("en-IN", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(d) + " IST"
      )
    } catch {
      return isoString
    }
  }

  // Check if a vehicle is in active watchlist
  const isWatchlistTarget = (reg: string): WatchlistEntry | undefined => {
    const cleanReg = reg.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
    return watchlist.find(
      (w) => w.registration_number.replace(/[^A-Za-z0-9]/g, "").toUpperCase() === cleanReg
    )
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header: Search & Intelligence Workspace */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Car className="w-5 h-5 text-sky-400" />
              Vehicle Intelligence Registry
            </h1>
            <DataSourceBadge status={dataSource} size="sm" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Search registration plates, verify multi-frame character consensus, and cross-reference sightings
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span>Observed records:</span>
          <strong className="text-white font-bold">{vehicles.length}</strong>
        </div>
      </div>

      {/* 2. Intelligence Search Form */}
      <div className="p-4 sm:p-5 bg-[#0b1528] border border-[#1e3a6a] rounded-lg space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registration number (e.g. GJ05CD8921, CMA66, GJ01)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#08101e] border border-[#1e3a6a] rounded-md text-xs font-mono text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 uppercase tracking-wider"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 rounded-md bg-sky-700 hover:bg-sky-600 text-xs font-semibold text-white transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Search Plate</span>
          </button>

          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("")
                setSearchInput("")
              }}
              className="px-3 py-2 rounded-md bg-[#08101e] hover:bg-[#0f1c35] border border-[#1e3a6a] text-xs font-semibold text-slate-300 transition cursor-pointer"
            >
              Clear
            </button>
          )}
        </form>

        {/* Filter Row: Consensus Threshold & Quick Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#1e3a6a]/60 text-xs">
          <div className="flex items-center gap-3">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-400 font-mono text-[11px]">Minimum Consensus Score:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minConsensus}
              onChange={(e) => setMinConsensus(parseFloat(e.target.value))}
              className="w-28 accent-sky-400 cursor-pointer"
            />
            <span className="font-mono text-emerald-400 font-bold w-12 text-[11px]">
              {(minConsensus * 100).toFixed(0)}%
            </span>
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-2">
            <span>Quick Query:</span>
            {["GJ05CD8921", "GJ01AB1234", "CMA66"].map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setSearchInput(example)
                  setSearch(example)
                }}
                className="px-2 py-0.5 rounded bg-[#08101e] border border-[#1e3a6a] text-[10px] text-sky-400 hover:text-white transition cursor-pointer"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Operational Vehicles Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            Observed Vehicles ({vehicles.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Click any row to open full forensic dossier
          </span>
        </div>

        <DataTable
          columns={[
            { key: "registration", label: "Registration Plate", width: "170px" },
            { key: "watchlist", label: "Watchlist Status", width: "130px" },
            { key: "last_seen", label: "Last Seen Node", width: "150px" },
            { key: "time", label: "Timestamp", width: "160px" },
            { key: "consensus", label: "OCR Consensus", width: "130px" },
            { key: "sightings", label: "Sightings", width: "100px" },
            { key: "actions", label: "Actions", align: "right", width: "150px" },
          ]}
          isEmpty={!loading && vehicles.length === 0}
          emptyTitle="No vehicle observations found"
          emptyDescription="Try adjusting your registration query or lowering the consensus threshold."
        >
          {loading ? (
            <tr>
              <td colSpan={7} className="py-16 text-center text-xs text-slate-400 font-mono">
                Loading vehicle intelligence registry...
              </td>
            </tr>
          ) : (
            vehicles.map((veh) => {
              const target = isWatchlistTarget(veh.registration_number)
              const lastSeenNode = veh.last_seen?.camera_id || veh.cameras[veh.cameras.length - 1] || "cam01"
              const istTime = formatIST(veh.last_seen?.source_time || veh.updated_at_utc)
              const ptsText = veh.last_seen?.pts_ms ? `PTS ${(veh.last_seen.pts_ms / 1000).toFixed(1)}s` : null

              return (
                <tr
                  key={veh.vehicle_id}
                  onClick={() => navigate(`/vehicles/${veh.registration_number}`)}
                  className="hover:bg-[#0f1c35]/80 transition cursor-pointer border-b border-[#1e3a6a]/40 group"
                >
                  {/* Plate */}
                  <td className="py-3 px-3">
                    <div className="inline-flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow-sm">
                      <div className="bg-blue-800 px-1 py-0.5 text-[8px] font-bold text-white flex flex-col items-center justify-center leading-none">
                        <span>IND</span>
                      </div>
                      <div className="px-2 py-0.5 font-mono text-xs font-bold text-slate-900 uppercase tracking-wide">
                        {veh.registration_number}
                      </div>
                    </div>
                  </td>

                  {/* Watchlist */}
                  <td className="py-3 px-3">
                    {target ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-red-500/50 bg-red-950/40 text-red-300 font-mono text-[10px] font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 status-pulse-dot" />
                        MATCH
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-slate-700 bg-slate-900/60 text-slate-400 font-mono text-[10px]">
                        NO MATCH
                      </span>
                    )}
                  </td>

                  {/* Camera */}
                  <td className="py-3 px-3 font-mono text-xs">
                    <div className="text-slate-200 font-bold uppercase">{lastSeenNode}</div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {veh.camera_count} camera(s) total
                    </div>
                  </td>

                  {/* Time */}
                  <td className="py-3 px-3 font-mono text-[11px] text-slate-300">
                    <div>{istTime || ptsText || "Recorded"}</div>
                    {ptsText && istTime && <div className="text-[10px] text-slate-500">{ptsText}</div>}
                  </td>

                  {/* Consensus */}
                  <td className="py-3 px-3">
                    <div className="text-xs font-mono font-bold text-emerald-400">
                      {(veh.best_consensus_score * 100).toFixed(1)}%
                    </div>
                    <div className="w-16 h-1 bg-[#1e3a6a] rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.min(100, veh.best_consensus_score * 100)}%` }}
                      />
                    </div>
                  </td>

                  {/* Sightings */}
                  <td className="py-3 px-3 font-mono text-xs text-slate-300">
                    {veh.observation_count} sightings
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          navigate(`/journey/${veh.registration_number}`)
                        }}
                        title="Reconstruct Journey"
                        className="p-1.5 rounded bg-[#08101e] hover:bg-[#132442] border border-[#1e3a6a] text-amber-300 transition"
                      >
                        <Route className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-xs text-sky-400 font-semibold group-hover:underline flex items-center gap-1">
                        <span>Dossier</span>
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </td>
                </tr>
              )
            })
          )}
        </DataTable>
      </div>
    </div>
  )
}
