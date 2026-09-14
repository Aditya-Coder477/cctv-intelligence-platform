import React, { useEffect, useState } from "react"
import {
  BookmarkCheck,
  Search,
  Plus,
  Shield,
  AlertTriangle,
  Sparkles,
  Calendar,
  X,
  CheckCircle2
} from "lucide-react"
import { api } from "../services/api"
import { WatchlistEntry } from "../types"
import { StatusBadge } from "../components/common/StatusBadge"

export const Watchlist: React.FC = () => {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>([])
  const [search, setSearch] = useState("")
  const [priorityFilter, setPriorityFilter] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // New target form state
  const [newReg, setNewReg] = useState("")
  const [newCategory, setNewCategory] = useState("DEMO_SUSPECT_VEHICLE")
  const [newPriority, setNewPriority] = useState("HIGH")
  const [newDesc, setNewDesc] = useState("")
  const [addError, setAddError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const fetchWatchlist = async () => {
    try {
      const data = await api.getWatchlist({
        search: search || undefined,
        priority: priorityFilter || undefined,
      })
      setWatchlist(data)
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
        registration_number: newReg.trim(),
        category: newCategory,
        priority: newPriority,
        description: newDesc.trim() || "Operator added demo target",
      })
      setShowAddModal(false)
      setNewReg("")
      setNewDesc("")
      fetchWatchlist()
    } catch (err: any) {
      setAddError(err.message || "Failed to add target")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-purple-400" />
              Watchlist Target Management
            </h2>
            <StatusBadge type="synthetic" value="SYNTHETIC_DEMO" />
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Active synthetic watchlist repository for real-time ANPR target matching (Step 8 & 9)
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-700 hover:bg-purple-600 rounded-lg text-xs font-semibold text-white transition shadow"
        >
          <Plus className="w-4 h-4" />
          Add Demo Watchlist Target
        </button>
      </div>

      {/* Synthetic Demo Disclaimer Alert */}
      <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/40 text-xs flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-purple-200">
            Hackathon Research Data Notice: Synthetic Watchlist Targets
          </div>
          <p className="text-purple-300/80 text-[11px] leading-relaxed">
            All records in this repository are synthetic mock targets tagged with <span className="font-mono text-purple-300 font-bold">SYNTHETIC_DEMO</span> to test real-time license plate detection and matching without utilizing live confidential police hotlists.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-3 bg-police-900/60 border border-police-800 rounded-xl flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-police-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search watchlist registration..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-police-950/80 border border-police-700/60 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            aria-label="Filter by priority"
            className="bg-police-950/80 text-white border border-police-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer"
          >
            <option value="">All Priorities</option>
            <option value="CRITICAL">Critical</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>
      </div>

      {/* Target Cards Grid */}
      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400">Loading watchlist targets...</div>
      ) : watchlist.length === 0 ? (
        <div className="py-16 text-center text-xs text-slate-400">No watchlist targets match current filter.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchlist.map((item) => (
            <div
              key={item.watchlist_id}
              className="p-4 rounded-xl bg-police-900/50 hover:bg-police-900 border border-police-800 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center border border-slate-600 rounded bg-white overflow-hidden shadow">
                    <div className="bg-blue-800 px-1.5 py-0.5 text-[9px] font-bold text-white leading-none">
                      IND
                    </div>
                    <div className="px-3 py-0.5 font-mono text-base font-black tracking-wider text-slate-900 uppercase">
                      {item.registration_number}
                    </div>
                  </div>

                  <StatusBadge type="priority" value={item.priority} size="sm" />
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-slate-200 font-semibold">{item.category.replace(/_/g, " ")}</div>
                  <div className="text-slate-400 text-[11px] line-clamp-2">
                    {item.reason || "Demonstration target"}
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-police-800/80 flex items-center justify-between text-[11px] font-mono">
                <span className="text-police-400">{item.watchlist_id}</span>
                <StatusBadge type="synthetic" value="SYNTHETIC_DEMO" size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Target Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-police-900 border border-police-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center justify-between pb-3 border-b border-police-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Plus className="w-4 h-4 text-purple-400" />
                Add Synthetic Watchlist Target
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddTarget} className="mt-4 space-y-4 text-xs">
              {addError && (
                <div className="p-2 rounded bg-red-950/60 border border-red-500/40 text-red-300">
                  {addError}
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-medium mb-1">
                  Registration Number *
                </label>
                <input
                  type="text"
                  placeholder="e.g. GJ01AB9999"
                  value={newReg}
                  onChange={(e) => setNewReg(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 bg-police-950 border border-police-700 rounded font-mono text-sm text-white focus:outline-none uppercase"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-police-950 text-white border border-police-700 rounded focus:outline-none"
                >
                  <option value="DEMO_SUSPECT_VEHICLE">DEMO_SUSPECT_VEHICLE</option>
                  <option value="DEMO_STOLEN_VEHICLE">DEMO_STOLEN_VEHICLE</option>
                  <option value="DEMO_BLACKLISTED_VEHICLE">DEMO_BLACKLISTED_VEHICLE</option>
                  <option value="DEMO_WANTED_VEHICLE">DEMO_WANTED_VEHICLE</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value)}
                  className="w-full px-3 py-2 bg-police-950 text-white border border-police-700 rounded focus:outline-none"
                >
                  <option value="CRITICAL">Critical</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Reason / Notes</label>
                <textarea
                  placeholder="Reason for surveillance listing..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-police-950 border border-police-700 rounded text-white focus:outline-none h-20 resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-police-800 hover:bg-police-750 text-slate-300 rounded font-medium transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-purple-700 hover:bg-purple-600 text-white rounded font-semibold transition"
                >
                  {submitting ? "Adding..." : "Add to Watchlist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
