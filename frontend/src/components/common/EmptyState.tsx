import React from "react"
import { AlertCircle } from "lucide-react"

export interface EmptyStateProps {
  title: string
  description?: string
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ReactNode
  className?: string
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  action,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-xl border border-[#1e3a6a]/60 bg-[#070e1b]/80 shadow-md ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#0b1528] border border-[#1e3a6a] flex items-center justify-center mb-3 text-sky-400">
        {icon || <AlertCircle className="w-6 h-6 text-slate-400" />}
      </div>
      <h3 className="text-base font-semibold text-white font-sans mb-1">{title}</h3>
      {description && (
        <p className="text-xs text-slate-400 max-w-sm mb-4 leading-relaxed font-sans">
          {description}
        </p>
      )}
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-4 py-2 text-xs font-semibold rounded-lg bg-[#274c8b] hover:bg-[#3461af] text-white transition border border-[#5b8be0]/40 shadow cursor-pointer font-sans"
        >
          {action.label}
        </button>
      )}
    </div>
  )
}
