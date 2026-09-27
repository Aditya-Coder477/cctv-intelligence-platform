import React from "react"
import { StatusBadge } from "./StatusBadge"

export interface DataSourceBadgeProps {
  status: "LIVE" | "FALLBACK" | "UNAVAILABLE" | string
  size?: "sm" | "md"
  className?: string
}

export const DataSourceBadge: React.FC<DataSourceBadgeProps> = ({
  status,
  size = "sm",
  className = "",
}) => {
  return (
    <StatusBadge
      type="data_source"
      value={status}
      size={size}
      className={className}
    />
  )
}
