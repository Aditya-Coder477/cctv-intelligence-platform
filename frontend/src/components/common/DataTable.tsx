import React from "react"
import clsx from "clsx"

export interface DataTableColumn {
  key: string
  label: string
  width?: string
  align?: "left" | "right" | "center"
}

export interface DataTableProps {
  columns: DataTableColumn[]
  children: React.ReactNode
  isEmpty?: boolean
  emptyTitle?: string
  emptyDescription?: string
  className?: string
}

export const DataTable: React.FC<DataTableProps> = ({
  columns,
  children,
  isEmpty = false,
  emptyTitle = "No records found",
  emptyDescription = "There are no records matching your current filter criteria.",
  className = "",
}) => {
  return (
    <div className={clsx("w-full overflow-x-auto rounded-lg border border-[#1e3a6a]/60 bg-[#0a1424]", className)}>
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-[#1e3a6a]/80 bg-[#070e1b]">
            {columns.map((col) => (
              <th
                key={col.key}
                style={{ width: col.width }}
                className={clsx(
                  "px-4 py-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 font-mono",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#1e3a6a]/30 text-sm">
          {isEmpty ? (
            <tr>
              <td colSpan={columns.length} className="py-12 text-center">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <p className="text-sm font-semibold text-slate-300 font-mono">{emptyTitle}</p>
                  <p className="text-xs text-slate-500 max-w-md">{emptyDescription}</p>
                </div>
              </td>
            </tr>
          ) : (
            children
          )}
        </tbody>
      </table>
    </div>
  )
}
