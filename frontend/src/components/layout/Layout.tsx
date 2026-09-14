import React from "react"
import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-police-950 flex flex-col text-slate-100 selection:bg-police-600 selection:text-white">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-police-950 to-police-900/90">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
