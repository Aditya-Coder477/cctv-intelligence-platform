import React from "react"
import { StatusBadge } from "./StatusBadge"

export interface SeverityBadgeProps {
  severity: string
  size?: "xs" | "sm" | "md"
  className?: string
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = "sm",
  className = "",
}) => {
  // Map xs to sm for StatusBadge
  const statusSize = size === "xs" ? "sm" : size
  return (
    <StatusBadge
      type="priority"
      value={severity}
      size={statusSize}
      className={className}
    />
  )
}
