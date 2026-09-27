import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  BookmarkCheck,
  Search,
  Plus,
  Shield,
  AlertTriangle,
  Calendar,
  X,
  CheckCircle2,
  Car,
  Route,
  ArrowRight,
  Filter
} from "lucide-react"
import { api } from "../services/api"
import { WatchlistEntry } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"
import { SeverityBadge } from "../components/common/SeverityBadge"
import { DataTable } from "../components/common/DataTable"
import { EmptyState } from "../components/common/EmptyState"

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const navigate = useNavigate()

  // New target form state
  const [newReg, setNewReg] = useState("")
  const [newCategory, setNewCategory] = useState("SUSPECT_VEHICLE")
  const [newPriority, setNewPriority] = useState<"CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("HIGH")
  const [newDesc, setNewDesc] = useState("")
  const [addError, setAddError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchWatchlist = async () => {
    try {
      const data = await api.getWatchlist({
        search: search || undefined,
        priority: priorityFilter || undefined,
      })
      if (Array.isArray(data)) {
        setWatchlist(data)
      }
    } catch (err) {
      console.error("Error loading watchlist:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWatchlist()
  }, [search, priorityFilter])

  const handleAddTarget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReg.trim()) {
      setAddError("Registration number is required")
      return
    }

    setSubmitting(true)
    setAddError(null)

    try {
      await api.addWatchlistTarget({
        registration_number: newReg.trim().toUpperCase(),
        category: newCategory,
        priority: newPriority,
        description: newDesc.trim() || "Operator listed target",
      })
      setShowAddModal(false)
      setNewReg("")
      setNewDesc("")
      fetchWatchlist()
    } catch (err: any) {
      setAddError(err.message || "Failed to add target to watchlist")
    } finally {
      setSubmitting(false)
    }
  }

  const criticalCount = watchlist.filter((w) => w.priority === "CRITICAL").length
  const highCount = watchlist.filter((w) => w.priority === "HIGH").length

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-amber-400" />
              Watchlist Target Management
            </h1>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#132442] text-sky-400 border border-sky-500/40 font-mono font-semibold">
              ACTIVE REPOSITORY
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Registered vehicle targets for automated real-time cross-camera ANPR correlation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-sky-700 hover:bg-sky-600 rounded-md text-xs font-semibold text-white transition shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Suspect Target</span>
        </button>
      </div>

      {/* 2. Operational Metrics Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a]">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Active Monitored Targets
          </span>
          <div className="text-2xl font-bold text-white font-mono mt-1 tabular-nums">
            {watchlist.length}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Enlisted in state database</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a]">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            Critical Priority Targets
          </span>
          <div className="text-2xl font-bold text-red-400 font-mono mt-1 tabular-nums">
            {criticalCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Immediate intercept protocol</div>
        </div>

        <div className="p-4 rounded-lg bg-[#0b1528] border border-[#1e3a6a]">
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
            High Priority Targets
          </span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1 tabular-nums">
            {highCount}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">Automated alert dispatch</div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="p-3 bg-[#0b1528] border border-[#1e3a6a] rounded-lg flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search watchlist registration or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-[#08101e] border border-[#1e3a6a] rounded text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 font-mono uppercase"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority level"
            className="bg-[#08101e] text-white border border-[#1e3a6a] rounded px-3 py-1.5 text-xs font-mono focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* 4. Operational Target Registry Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-200 font-mono">
            Target Registry ({watchlist.length})
          </h2>
          <span className="text-xs text-slate-400 font-mono">
            Real-time correlation enabled across all active streams
          </span>
        </div>

        <DataTable
          columns={[
            { key: "registration", label: "Registration Plate", width: "170px" },
            { key: "category", label: "Category & Reason" },
            { key: "priority", label: "Priority", width: "130px" },
            { key: "status", label: "Status", width: "110px" },
            { key: "id", label: "Target ID", width: "140px" },
            { key: "actions", label: "Actions", align: "right", width: "160px" },
          ]}
          isEmpty={!loading && watchlist.length === 0}
          emptyTitle="No watchlist targets found"
          emptyDescription="Add a suspect vehicle registration plate to begin tracking."
        >
          {loading ? (
            <tr>
              <td colSpan={6} className="py-16 text-center text-xs text-slate-400 font-mono">
                Loading watchlist repository...
              </td>
            </tr>
          ) : (
            watchlist.map((item) => (
              <tr
                key={item.watchlist_id}
                onClick={() => navigate(`/vehicles/${item.registration_number}`)}
                className="hover:bg-[#0f1c35]/80 transition cursor-pointer border-b border-[#1e3a6a]/40 group"
              >
                {/* Plate */}
                <td className="py-3 px-3">
                  <div className="inline-flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow-sm">
                    <div className="bg-blue-800 px-1 py-0.5 text-[8px] font-bold text-white flex flex-col items-center justify-center leading-none">
                      <span>IND</span>
                    </div>
                    <div className="px-2 py-0.5 font-mono text-xs font-bold text-slate-900 uppercase tracking-wide">
                      {item.registration_number}
                    </div>
                  </div>
                </td>

                {/* Reason & Category */}
                <td className="py-3 px-3 text-xs">
                  <div className="font-semibold text-slate-200">
                    {item.category.replace(/_/g, " ")}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {item.reason || "Active police surveillance bulletin"}
                  </div>
                </td>

                {/* Priority */}
                <td className="py-3 px-3">
                  <SeverityBadge severity={item.priority} size="sm" />
                </td>

                {/* Status */}
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded border border-emerald-500/40 bg-emerald-950/30 text-emerald-300 font-mono text-[10px] font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    ACTIVE
                  </span>
                </td>

                {/* Target ID */}
                <td className="py-3 px-3 font-mono text-[11px] text-slate-400">
                  {item.watchlist_id}
                </td>

                {/* Actions */}
                <td className="py-3 px-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate(`/journey/${item.registration_number}`)
                      }}
                      title="Trace Journey"
                      className="p-1.5 rounded bg-[#08101e] hover:bg-[#132442] border border-[#1e3a6a] text-amber-300 transition"
                    >
                      <Route className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate(`/vehicles/${item.registration_number}`)}
                      className="text-xs text-sky-400 font-semibold group-hover:underline flex items-center gap-1"
                    >
                      <span>Dossier</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </DataTable>
      </div>

      {/* 5. Add Target Modal */}
      {showAddModal && (
        <div
          onClick={() => setShowAddModal(false)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 cursor-pointer"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-[#0b1528] border border-[#1e3a6a] rounded-lg w-full max-w-md overflow-hidden shadow-2xl p-5 space-y-4 cursor-default"
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#1e3a6a]">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-400" />
                <span>Enlist New Watchlist Target</span>
              </h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddTarget} className="space-y-3.5 text-xs">
              {addError && (
                <div className="p-2.5 rounded bg-red-950/60 border border-red-500/40 text-red-300 font-mono">
                  {addError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1 font-mono">
                  Vehicle Registration Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. GJ05CD8921"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-[#08101e] border border-[#1e3a6a] rounded font-mono text-sm text-white focus:outline-none focus:border-sky-400 uppercase tracking-wider"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Surveillance Classification
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-[#08101e] text-white border border-[#1e3a6a] rounded focus:outline-none focus:border-sky-400 font-mono text-xs cursor-pointer"
                >
                  <option value="SUSPECT_VEHICLE">SUSPECT_VEHICLE</option>
                  <option value="STOLEN_VEHICLE">STOLEN_VEHICLE</option>
                  <option value="BLACKLISTED_VEHICLE">BLACKLISTED_VEHICLE</option>
                  <option value="WANTED_VEHICLE">WANTED_VEHICLE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Priority Level
                </label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#08101e] text-white border border-[#1e3a6a] rounded focus:outline-none focus:border-sky-400 font-mono text-xs cursor-pointer"
                >
                  <option value="CRITICAL">CRITICAL (Immediate PCR Intercept)</option>
                  <option value="HIGH">HIGH (Automated Alert Dispatch)</option>
                  <option value="MEDIUM">MEDIUM (Surveillance Log)</option>
                  <option value="LOW">LOW (Informational)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Reason / Operational Bulletin Notes
                </label>
                <textarea
                  placeholder="Enter FIR reference, case number, or reason for surveillance..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#08101e] border border-[#1e3a6a] rounded text-white focus:outline-none focus:border-sky-400 h-20 resize-none font-sans"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-[#08101e] hover:bg-[#132442] text-slate-300 rounded font-medium transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white rounded font-semibold transition cursor-pointer"
                >
                  {submitting ? "Enlisting..." : "Enlist Target"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
