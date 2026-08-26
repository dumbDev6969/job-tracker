import { Check, ChevronDown, PlusCircle } from "lucide-react"
import type { Column } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { JOB_STATUSES, type JobApplication, type JobApplicationStatus } from "../types"
import type { JobsTableFeatures } from "./Jobs"

type StatusFacetedFilterProps = {
  column: Column<JobsTableFeatures, JobApplication, unknown> | undefined
}

export function StatusFacetedFilter({ column }: StatusFacetedFilterProps) {
  if (!column) {
    return null
  }

  const selected = new Set((column.getFilterValue() as JobApplicationStatus[] | undefined) ?? [])
  const facets = column.getFacetedUniqueValues()

  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="outline" size="sm" className="h-8 gap-2 border-dashed">
            <PlusCircle className="size-4" />
            Status
            {selected.size > 0 ? (
              <>
                <Separator orientation="vertical" className="mx-1 h-4" />
                {selected.size > 2 ? (
                  <Badge variant="secondary" className="rounded-sm px-1 font-normal">
                    {selected.size} selected
                  </Badge>
                ) : (
                  JOB_STATUSES.filter((status) => selected.has(status.value)).map((status) => (
                    <Badge
                      key={status.value}
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {status.label}
                    </Badge>
                  ))
                )}
              </>
            ) : null}
          </Button>
        }
      />
      <PopoverContent className="w-56 p-0" align="start">
        <Command>
          <CommandInput placeholder="Filter status..." />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup>
              {JOB_STATUSES.map((status) => {
                const isSelected = selected.has(status.value)
                return (
                  <CommandItem
                    key={status.value}
                    onSelect={() => {
                      const next = new Set(selected)
                      if (isSelected) {
                        next.delete(status.value)
                      } else {
                        next.add(status.value)
                      }
                      const values = Array.from(next)
                      column.setFilterValue(values.length ? values : undefined)
                    }}
                  >
                    <div
                      className={cn(
                        "flex size-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <Check className="size-3.5" />
                    </div>
                    <span>{status.label}</span>
                    <span className="ml-auto flex size-4 items-center justify-center text-xs text-muted-foreground">
                      {facets.get(status.value) ?? 0}
                    </span>
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {selected.size > 0 ? (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    Clear filters
                  </CommandItem>
                </CommandGroup>
              </>
            ) : null}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

type JobsToolbarProps = {
  searchValue: string
  onSearchChange: (value: string) => void
  statusColumn: Column<JobsTableFeatures, JobApplication, unknown> | undefined
  hideableColumns: Column<JobsTableFeatures, JobApplication, unknown>[]
  columnLabels: Record<string, string>
}

export function JobsToolbar({
  searchValue,
  onSearchChange,
  statusColumn,
  hideableColumns,
  columnLabels,
}: JobsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">
        <Input
          placeholder="Filter jobs..."
          value={searchValue}
          onChange={(event) => onSearchChange(event.target.value)}
          className="h-8 max-w-sm"
        />
        <StatusFacetedFilter column={statusColumn} />
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="gap-1.5">
              Columns
              <ChevronDown className="size-3.5" />
            </Button>
          }
        />
        <DropdownMenuContent align="end">
          {hideableColumns.map((column) => (
            <DropdownMenuCheckboxItem
              key={column.id}
              checked={column.getIsVisible()}
              onCheckedChange={(checked) => column.toggleVisibility(checked)}
              className="capitalize"
              onSelect={(event) => event.preventDefault()}
            >
              {columnLabels[column.id] ?? column.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
