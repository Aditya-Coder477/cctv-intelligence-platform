import React, { useState, useEffect } from "react"
import {
  LayoutGrid,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sliders,
  Radio,
  Eye
} from "lucide-react"
import { api } from "../services/api"
import { Camera } from "../types"
import { HlsPlayer } from "../components/player/HlsPlayer"
import { FALLBACK_CAMERAS } from "../data/fallbackData"

type GridSize = "1x1" | "2x2" | "3x3"

export const VideoWall: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [gridSize, setGridSize] = useState<GridSize>("2x2")
  const [activeSlots, setActiveSlots] = useState<string[]>([
    "cam01",
    "cam02",
    "cam03",
    "cam04",
    "cam05",
    "cam06",
    "cam07",
    "cam08",
    "cam09",
  ])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await api.getCameras()
        if (Array.isArray(data) && data.length > 0) {
          setCameras(data)
        } else {
          setCameras(FALLBACK_CAMERAS)
        }
      } catch (err) {
        console.error("Error fetching cameras, using fallback:", err)
        setCameras(FALLBACK_CAMERAS)
      } finally {
        setLoading(false)
      }
    }
    fetchCameras()
  }, [])

  const handleSlotChange = (slotIndex: number, newCameraId: string) => {
    const updated = [...activeSlots]
    updated[slotIndex] = newCameraId
    setActiveSlots(updated)
  }

  const slotCount = gridSize === "1x1" ? 1 : gridSize === "2x2" ? 4 : 9

  const gridClass =
    gridSize === "1x1"
      ? "grid-cols-1 h-[calc(100vh-12rem)]"
      : gridSize === "2x2"
      ? "grid-cols-1 sm:grid-cols-2 h-[calc(100vh-12rem)]"
      : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 h-[calc(100vh-12rem)]"

  return (
    <div className="space-y-4 max-w-[1600px] mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1e3a6a]/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <LayoutGrid className="w-5 h-5 text-sky-400" />
            Live Multi-Stream Video Wall
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Simultaneous multi-stream HLS monitoring matrix with synchronized playback
          </p>
        </div>

        {/* Layout Grid Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono mr-1">Matrix Layout:</span>
          {(["1x1", "2x2", "3x3"] as GridSize[]).map((sz) => (
            <button
              key={sz}
              type="button"
              onClick={() => setGridSize(sz)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition cursor-pointer ${
                gridSize === sz
                  ? "bg-[#132442] text-white border border-sky-400 shadow-sm"
                  : "bg-[#0b1528] text-slate-400 hover:text-white border border-[#1e3a6a]"
              }`}
            >
              {sz}
            </button>
          ))}
        </div>
      </div>

      {/* Video Wall Matrix */}
      <div className={`grid ${gridClass} gap-3`}>
        {activeSlots.slice(0, slotCount).map((camId, idx) => {
          const cam = cameras.find((c) => c.camera_id === camId)
          return (
            <div
              key={`${camId}-${idx}`}
              className="flex flex-col bg-black rounded-xl overflow-hidden border border-police-800 relative group"
            >
              {/* Slot customizer top bar */}
              <div className="p-1.5 bg-police-950/90 border-b border-police-800 flex items-center justify-between text-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-police-400 px-1 bg-police-900 rounded">
                    SLOT {idx + 1}
                  </span>
                  <select
                    value={camId}
                    onChange={(e) => handleSlotChange(idx, e.target.value)}
                    aria-label={`Select camera for slot ${idx + 1}`}
                    className="bg-police-900 text-white border border-police-700/60 rounded px-2 py-0.5 text-xs font-mono focus:outline-none cursor-pointer"
                  >
                    {cameras.map((c) => (
                      <option key={c.camera_id} value={c.camera_id}>
                        {c.camera_id.toUpperCase()} - {c.name.slice(0, 20)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  LIVE
                </div>
              </div>

              {/* Video Player */}
              <div className="flex-1 w-full h-full min-h-0">
                <HlsPlayer
                  cameraId={camId}
                  cameraName={cam?.name}
                  autoPlay={true}
                  className="w-full h-full rounded-none border-none"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
