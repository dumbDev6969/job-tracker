import { Loader2 } from "lucide-react"
import type { Row } from "@tanstack/react-table"

import { TableCell, TableRow } from "@/components/ui/table"
import type { JobApplication } from "../types"
import type { JobsTableFeatures } from "./Jobs"

type JobsTableBodyProps = {
  isLoading: boolean
  rows: Row<JobsTableFeatures, JobApplication>[]
  columnsCount: number
  FlexRender: any
  onRowClick: (job: JobApplication) => void
}

export function JobsTableBody({
  isLoading,
  rows,
  columnsCount,
  FlexRender,
  onRowClick,
}: JobsTableBodyProps) {
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={columnsCount} className="h-32 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading job applications...
          </span>
        </TableCell>
      </TableRow>
    )
  }

  if (rows.length === 0) {
    return (
      <TableRow>
        <TableCell colSpan={columnsCount} className="h-32 text-center text-sm text-muted-foreground">
          No results.
        </TableCell>
      </TableRow>
    )
  }

  return (
    <>
      {rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() ? "selected" : undefined}
          className="cursor-pointer hover:bg-muted/50"
          onClick={(event) => {
            const target = event.target as HTMLElement
            if (
              target.closest('[role="checkbox"]') ||
              target.closest("button") ||
              target.closest('[role="menuitem"]')
            ) {
              return
            }
            onRowClick(row.original)
          }}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              <FlexRender cell={cell} />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  )
}
