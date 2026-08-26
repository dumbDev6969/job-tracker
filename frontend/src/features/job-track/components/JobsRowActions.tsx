import { Copy, MoreHorizontal, Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { JobApplication } from "../types"

type JobsRowActionsProps = {
  job: JobApplication
  onEditRequest: (job: JobApplication) => void
  onDeleteRequest: (job: JobApplication) => void
}

export function JobsRowActions({ job, onEditRequest, onDeleteRequest }: JobsRowActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="size-8" aria-label="Open row actions">
            <MoreHorizontal className="size-4" />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuGroupLabel>Actions</DropdownMenuGroupLabel>
          <DropdownMenuItem onClick={() => onEditRequest(job)}>
            <Pencil />
            Edit job
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => navigator.clipboard.writeText(String(job.id))}>
            <Copy />
            Copy job ID
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive" onClick={() => onDeleteRequest(job)}>
          <Trash2 />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
