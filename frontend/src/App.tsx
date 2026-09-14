import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import { Layout } from "./components/layout/Layout"

// Pages
import { Dashboard } from "./pages/Dashboard"
import { Cameras } from "./pages/Cameras"
import { CameraDetails } from "./pages/CameraDetails"
import { CameraMap } from "./pages/CameraMap"
import { VideoWall } from "./pages/VideoWall"
import { Vehicles } from "./pages/Vehicles"
import { VehicleDetails } from "./pages/VehicleDetails"
import { JourneyView } from "./pages/JourneyView"
import { Watchlist } from "./pages/Watchlist"
import { Alerts } from "./pages/Alerts"
import { AlertDetails } from "./pages/AlertDetails"
import { HealthView } from "./pages/HealthView"
import { SyntheticStudio } from "./pages/SyntheticStudio"

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="cameras" element={<Cameras />} />
            <Route path="cameras/:id" element={<CameraDetails />} />
            <Route path="map" element={<CameraMap />} />
            <Route path="videowall" element={<VideoWall />} />
            <Route path="synthetic" element={<SyntheticStudio />} />
            <Route path="vehicles" element={<Vehicles />} />
            <Route path="vehicles/:reg" element={<VehicleDetails />} />
            <Route path="journey/:reg" element={<JourneyView />} />
            <Route path="watchlist" element={<Watchlist />} />
            <Route path="alerts" element={<Alerts />} />
            <Route path="alerts/:id" element={<AlertDetails />} />
            <Route path="health" element={<HealthView />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
