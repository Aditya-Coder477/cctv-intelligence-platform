import React, { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import L from "leaflet"
import { useNavigate } from "react-router-dom"
import {
  MapPin,
  AlertCircle,
  Video,
  ExternalLink,
  Shield,
  Layers,
  Search,
  CheckCircle2,
  X
} from "lucide-react"
import { api } from "../services/api"
import { Camera } from "../types"
import { HlsPlayer } from "../components/player/HlsPlayer"

// Custom SVG map marker icon
const cameraIcon = L.divIcon({
  className: "custom-camera-marker",
  html: `<div style="background-color: #1e3a6a; border: 2px solid #5b8be0; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 10px rgba(50,98,178,0.8);">
    <div style="background-color: #10b981; width: 10px; height: 10px; border-radius: 50%;"></div>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
  popupAnchor: [0, -14],
})

export const CameraMap: React.FC = () => {
  const [cameras, setCameras] = useState<Camera[]>([])
  const [selectedCamera, setSelectedCamera] = useState<Camera | null>(null)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const data = await api.getCameras()
        setCameras(data)
      } catch (err) {
        console.error("Error fetching map cameras:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchCameras()
  }, [])

  const spatialCameras = cameras.filter((c) => c.is_spatial && c.latitude && c.longitude)
  const nonSpatialCameras = cameras.filter((c) => !c.is_spatial || !c.latitude || !c.longitude)

  const filteredNonSpatial = nonSpatialCameras.filter((c) => {
    const s = search.toLowerCase().trim()
    return !s || c.camera_id.toLowerCase().includes(s) || c.name.toLowerCase().includes(s)
  })

  return (
    <div className="space-y-4 max-w-7xl mx-auto h-[calc(100vh-6rem)] flex flex-col">
      {/* Header & Forensic Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-5 h-5 text-police-400" />
            GIS Surveillance Map
          </h2>
          <p className="text-xs text-slate-400">
            Geographic camera coordinates & spatial correlation layer
          </p>
        </div>
      </div>

      {/* Forensic Policy Alert Banner */}
      <div className="p-3 rounded-lg bg-police-900/90 border border-police-700/80 text-xs flex items-start gap-3 shrink-0 shadow-md">
        <Shield className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-semibold text-slate-200">
            Gujarat Police Forensic Integrity Notice: Spatial Verification Protocol
          </div>
          <p className="text-slate-400 text-[11px] leading-relaxed">
            In compliance with police evidence standards, only CCTV cameras with verified GPS coordinates ({spatialCameras.length}) are rendered as geographical pins. Unverified cameras ({nonSpatialCameras.length}) are managed via the inventory drawer without fabricated spatial pins.
          </p>
        </div>
      </div>

      {/* Main Map View + Non-spatial drawer */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden rounded-xl border border-police-800 bg-police-950">
        {/* Leaflet Map */}
        <div className="lg:col-span-3 h-full relative">
          <MapContainer
            center={[23.0225, 72.5714]} // Ahmedabad, Gujarat
            zoom={12}
            className="w-full h-full z-0"
            style={{ background: "#060d1b" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://carto.com/">CartoDB</a> Dark Matter'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            />

            {spatialCameras.map((cam) => (
              <Marker
                key={cam.camera_id}
                position={[cam.latitude!, cam.longitude!]}
                icon={cameraIcon}
                eventHandlers={{
                  click: () => setSelectedCamera(cam),
                }}
              >
                <Popup className="custom-leaflet-popup">
                  <div className="p-1 font-sans text-xs">
                    <div className="font-bold text-police-900 uppercase font-mono">{cam.camera_id}</div>
                    <div className="font-semibold text-slate-800">{cam.name}</div>
                    <div className="text-[11px] text-slate-600 mt-1">{cam.location}</div>
                    <button
                      onClick={() => setSelectedCamera(cam)}
                      className="mt-2 w-full py-1 bg-police-700 text-white rounded text-[11px] font-medium"
                    >
                      Watch Live Stream
                    </button>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Overlay on bottom left of map */}
          <div className="absolute bottom-3 left-3 z-10 bg-police-950/90 backdrop-blur border border-police-800 p-2.5 rounded-lg text-xs font-mono space-y-1">
            <div className="text-white font-bold">MAP COVERAGE: GUJARAT SECTOR</div>
            <div className="text-emerald-400">● {spatialCameras.length} SPATIAL CAMERAS PLOTTED</div>
            <div className="text-amber-400">○ {nonSpatialCameras.length} CATALOGUED (UNVERIFIED COORDS)</div>
          </div>
        </div>

        {/* Non-Spatial Camera Drawer */}
        <div className="h-full flex flex-col p-3 bg-police-900/60 border-l border-police-800 overflow-hidden">
          <div className="shrink-0 mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center justify-between">
              <span>Unverified Locations</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {nonSpatialCameras.length}
              </span>
            </h3>
            <div className="mt-2 relative">
              <Search className="w-3.5 h-3.5 text-police-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search non-spatial..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-2 py-1.5 bg-police-950/90 border border-police-700/60 rounded text-xs text-white placeholder-slate-500 focus:outline-none"
              />
            </div>
          </div>

          {/* List of unverified cameras */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredNonSpatial.map((cam) => (
              <div
                key={cam.camera_id}
                className="p-2.5 rounded-lg bg-police-950/80 hover:bg-police-850 border border-police-800/80 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-white uppercase">
                      {cam.camera_id}
                    </span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/70 border border-amber-500/30 text-amber-300 font-mono">
                      NO GPS
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 mt-1 line-clamp-1 font-medium">
                    {cam.name}
                  </div>
                  <div className="text-[10px] text-slate-500 line-clamp-1">
                    {cam.location || "Catalogue Node"}
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-police-800/60 flex items-center gap-1.5">
                  <button
                    onClick={() => setSelectedCamera(cam)}
                    className="flex-1 py-1 bg-police-800 hover:bg-police-700 rounded text-[11px] font-medium text-white transition flex items-center justify-center gap-1"
                  >
                    <Video className="w-3 h-3 text-police-400" />
                    Stream
                  </button>
                  <button
                    onClick={() => navigate(`/cameras/${cam.camera_id}`)}
                    className="p-1 bg-police-850 hover:bg-police-750 text-slate-300 rounded hover:text-white"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stream Viewer Modal for Selected Camera */}
      {selectedCamera && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-police-900 border border-police-700 rounded-xl w-full max-w-3xl overflow-hidden shadow-2xl">
            <div className="p-3 border-b border-police-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-white bg-police-800 px-2 py-0.5 rounded">
                  {selectedCamera.camera_id.toUpperCase()}
                </span>
                <span className="text-sm font-semibold text-white">{selectedCamera.name}</span>
              </div>
              <button
                onClick={() => setSelectedCamera(null)}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-police-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="h-[420px] w-full">
              <HlsPlayer
                cameraId={selectedCamera.camera_id}
                cameraName={selectedCamera.name}
                autoPlay={true}
                className="w-full h-full rounded-none"
              />
            </div>
            <div className="p-3 bg-police-950 flex items-center justify-between text-xs text-slate-400">
              <span>{selectedCamera.is_spatial ? "Spatial Coordinates Verified" : "Location Unverified"}</span>
              <button
                onClick={() => navigate(`/cameras/${selectedCamera.camera_id}`)}
                className="text-police-400 hover:text-white underline"
              >
                Camera Details Dossier →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
