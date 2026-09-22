import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Car,
  Search,
  SlidersHorizontal,
  ChevronRight,
  ShieldAlert,
  Calendar,
  Layers,
  Eye,
  CheckCircle2
} from "lucide-react"
import { api } from "../services/api"
import { ObservedVehicle } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { FALLBACK_VEHICLES } from "../data/fallbackData"

export const Vehicles: React.FC = () => {
  const [vehicles, setVehicles] = useState<ObservedVehicle[]>([])
  const [search, setSearch] = useState("")
  const [minConsensus, setMinConsensus] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const data = await api.getVehicles({
          search: search || undefined,
          minConsensus: minConsensus > 0 ? minConsensus : undefined,
        })
        if (Array.isArray(data) && data.length > 0) {
          setVehicles(data)
        } else if (!search && minConsensus === 0) {
          setVehicles(FALLBACK_VEHICLES)
        } else {
          setVehicles([])
        }
      } catch (err) {
        console.error("Error fetching vehicles, using fallback:", err)
        if (!search && minConsensus === 0) {
          setVehicles(FALLBACK_VEHICLES)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchVehicles()
  }, [search, minConsensus])

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <Car className="w-5 h-5 text-police-400" />
            Vehicle Intelligence Registry
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed vehicle tracks, multi-frame OCR consensus, and multi-camera sightings
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-police-900/60 border border-police-800 rounded-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-police-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search registration (e.g. CH0BHBGE, CMA66, GJ01)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-police-950/80 border border-police-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-police-400"
            />
          </div>

          {/* Consensus threshold filter */}
          <div className="flex items-center gap-3 w-full sm:w-auto p-2 bg-police-950/80 border border-police-800 rounded-lg text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-police-400" />
            <span className="text-slate-400 whitespace-nowrap">Min Consensus:</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={minConsensus}
              onChange={(e) => setMinConsensus(parseFloat(e.target.value))}
              className="w-24 accent-police-500 cursor-pointer"
            />
            <span className="font-mono text-emerald-400 font-bold w-10">
              {(minConsensus * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Vehicle Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading observed vehicles...</div>
      ) : vehicles.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">
          No vehicles found matching current search or consensus filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vehicles.map((veh) => {
            const firstObs = veh.timeline[0]
            return (
              <div
                key={veh.vehicle_id}
                onClick={() => navigate(`/vehicles/${veh.registration_number}`)}
                className="p-4 rounded-xl bg-police-900/50 hover:bg-police-900 border border-police-800 hover:border-police-500/50 transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  {/* Top card bar: Vehicle Plate Graphic */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow">
                      <div className="bg-blue-800 px-1.5 py-1 text-[9px] font-bold text-white flex flex-col items-center justify-center leading-none">
                        <span>IND</span>
                        <span className="text-[7px]">🇮🇳</span>
                      </div>
                      <div className="px-3 py-1 font-mono text-base font-black tracking-wider text-slate-900 uppercase">
                        {veh.registration_number}
                      </div>
                    </div>

                    <StatusBadge type="recognition" value="CONFIRMED" size="sm" />
                  </div>

                  {/* Recognition & Telemetry Card */}
                  <div className="p-3 bg-police-950/80 border border-police-800/80 rounded-lg space-y-2.5 mb-3">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-400">OCR Consensus:</span>
                        <span className="text-emerald-400 font-mono font-bold">
                          {(veh.best_consensus_score * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-police-900 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all"
                          style={{ width: `${Math.min(Math.max(veh.best_consensus_score * 100, 10), 100)}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-police-800/60">
                      <span className="text-slate-400">Sightings / Nodes:</span>
                      <span className="text-slate-200 font-mono font-semibold">
                        {veh.observation_count} sighting{veh.observation_count > 1 ? "s" : ""} · {veh.camera_count} cam{veh.camera_count > 1 ? "s" : ""}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Cameras:</span>
                      <div className="flex gap-1 flex-wrap justify-end">
                        {veh.cameras && veh.cameras.length > 0 ? (
                          veh.cameras.slice(0, 3).map((cam) => (
                            <span
                              key={cam}
                              className="px-1.5 py-0.5 rounded bg-police-800 text-[10px] font-mono text-police-300 uppercase"
                            >
                              {cam}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[10px] font-mono">cam01</span>
                        )}
                        {veh.cameras && veh.cameras.length > 3 && (
                          <span className="text-slate-500 text-[10px] font-mono">+{veh.cameras.length - 3}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-400">Source PTS:</span>
                      <span className="text-slate-300 font-mono text-[11px]">
                        {firstObs?.first_seen_pts_ms ? `${(firstObs.first_seen_pts_ms / 1000).toFixed(1)}s` : "Local"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom action */}
                <div className="mt-2 pt-3 border-t border-police-800/80 flex items-center justify-between text-xs text-police-400 group-hover:text-white font-medium">
                  <span>Open Vehicle Dossier & Journey</span>
                  <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
