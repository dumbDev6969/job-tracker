import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { useNavigate } from "react-router-dom"

import {
  columnFacetingFeature,
  columnFilteringFeature,
  columnVisibilityFeature,
  createColumnHelper,
  createFacetedRowModel,
  createFacetedUniqueValues,
  createFilteredRowModel,
  createSortedRowModel,
  filterFn_arrIncludesSome,
  filterFn_includesString,
  globalFilteringFeature,
  rowSelectionFeature,
  rowSortingFeature,
  sortFn_alphanumeric,
  tableFeatures,
  useTable,
  type Column,
} from "@tanstack/react-table"
import {
  ArrowUpDown,
  Check,
  ChevronDown,
  Copy,
  Inbox,
  Loader2,
  MoreHorizontal,
  Pencil,
  PlusCircle,
  RefreshCw,
  Trash2,
} from "lucide-react"

import { ConfirmDialog } from "@/components/ConfirmDialog"
import { EditJobModal } from "./EditJobModal"
import { EmptyState } from "@/components/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
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
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import { deleteJobApplication, listJobApplications } from "../services/jobService"
import { JOB_STATUSES, type JobApplication, type JobApplicationStatus } from "../types"

const features = tableFeatures({
  rowSelectionFeature,
  columnVisibilityFeature,
  columnFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
    arrIncludesSome: filterFn_arrIncludesSome,
  },
  globalFilteringFeature,
  columnFacetingFeature,
  facetedRowModel: createFacetedRowModel(),
  facetedUniqueValues: createFacetedUniqueValues(),
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: { alphanumeric: sortFn_alphanumeric },
})

type Features = typeof features

const columnHelper = createColumnHelper<Features, JobApplication>()

const STATUS_BADGE_CLASS: Record<JobApplicationStatus, string> = {
  saved: "bg-muted text-muted-foreground",
  applied: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  interviewing: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  offered: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  rejected: "bg-destructive/10 text-destructive",
}

const STATUS_LABEL = Object.fromEntries(
  JOB_STATUSES.map((status) => [status.value, status.label])
) as Record<JobApplicationStatus, string>

const COLUMN_LABELS: Record<string, string> = {
  status: "Status",
  company: "Company",
  role: "Role",
  applied_date: "Applied",
}

type JobsPagination = {
  currentPage: number
  lastPage: number
  total: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

type JobsCache = {
  jobs: JobApplication[]
  pagination: JobsPagination
}

const DEFAULT_PAGINATION: JobsPagination = {
  currentPage: 1,
  lastPage: 1,
  total: 0,
  hasPreviousPage: false,
  hasNextPage: false,
}

let jobsCacheByPage = new Map<number, JobsCache>()

export function clearJobsCache() {
  jobsCacheByPage.clear()
}

function formatDate(value: string | null) {
  if (!value) {
    return "�"
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function SortableHeader<TValue>({
  label,
  column,
}: {
  label: string
  column: Column<Features, JobApplication, TValue>
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="-ml-2.5 h-8 gap-1.5 px-2.5"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="size-3.5" />
    </Button>
  )
}

type RowActionsProps = {
  job: JobApplication
  onEditRequest: (job: JobApplication) => void
  onDeleteRequest: (job: JobApplication) => void
}

function RowActions({ job, onEditRequest, onDeleteRequest }: RowActionsProps) {
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

function StatusFacetedFilter({
  column,
}: {
  column: Column<Features, JobApplication, unknown> | undefined
}) {
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

export function Jobs() {
  const navigate = useNavigate()
  const initialCache = jobsCacheByPage.get(1)
  const [jobs, setJobs] = useState<JobApplication[]>(() => initialCache?.jobs ?? [])
  const [pagination, setPagination] = useState<JobsPagination>(
    () => initialCache?.pagination ?? DEFAULT_PAGINATION
  )
  const [isLoading, setIsLoading] = useState(() => jobsCacheByPage.size === 0)
  const [isFetchingPage, setIsFetchingPage] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingTarget, setEditingTarget] = useState<JobApplication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadJobs = useCallback(
    async (page = 1, showLoading = false) => {
      const cached = jobsCacheByPage.get(page)

      if (cached) {
        setJobs(cached.jobs)
        setPagination(cached.pagination)
        setIsLoading(false)
      } else if (showLoading || jobsCacheByPage.size === 0) {
        setIsLoading(true)
      }

      setIsFetchingPage(true)
      setError(null)
      try {
        const response = await listJobApplications(page)
        const nextPagination: JobsPagination = {
          currentPage: response.meta.current_page,
          lastPage: response.meta.last_page,
          total: response.meta.total,
          hasPreviousPage: response.links.prev !== null,
          hasNextPage: response.links.next !== null,
        }

        const newCache: JobsCache = {
          jobs: response.data,
          pagination: nextPagination,
        }
        jobsCacheByPage.set(page, newCache)

        setJobs(response.data)
        setPagination(nextPagination)
      } catch {
        if (!cached) {
          setError("Failed to load job applications.")
        }
      } finally {
        setIsLoading(false)
        setIsFetchingPage(false)
      }
    },
    []
  )

  useEffect(() => {
    const hasInitialData = jobsCacheByPage.has(1)
    void loadJobs(1, !hasInitialData)
  }, [loadJobs])

  const columns = useMemo(
    () =>
      columnHelper.columns([
        columnHelper.display({
          id: "select",
          header: ({ table }) => (
            <Checkbox
              checked={table.getIsAllPageRowsSelected()}
              indeterminate={
                table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected()
              }
              onCheckedChange={(checked) => table.toggleAllPageRowsSelected(checked)}
              aria-label="Select all"
            />
          ),
          cell: ({ row }) => (
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(checked) => row.toggleSelected(checked)}
              aria-label="Select row"
            />
          ),
          enableSorting: false,
          enableHiding: false,
        }),
        columnHelper.accessor("status", {
          header: ({ column }) => <SortableHeader label="Status" column={column} />,
          cell: ({ getValue }) => {
            const status = getValue()
            return (
              <Badge variant="secondary" className={cn("capitalize", STATUS_BADGE_CLASS[status])}>
                {STATUS_LABEL[status]}
              </Badge>
            )
          },
          filterFn: "arrIncludesSome",
        }),
        columnHelper.accessor("company", {
          header: ({ column }) => <SortableHeader label="Company" column={column} />,
          cell: ({ getValue }) => <span className="font-medium text-foreground">{getValue()}</span>,
        }),
        columnHelper.accessor("role", {
          header: "Role",
        }),
        columnHelper.accessor("applied_date", {
          header: ({ column }) => <SortableHeader label="Applied" column={column} />,
          cell: ({ getValue }) => formatDate(getValue()),
        }),
        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <RowActions
              job={row.original}
              onEditRequest={setEditingTarget}
              onDeleteRequest={setDeleteTarget}
            />
          ),
          enableHiding: false,
        }),
      ]),
    []
  )

  const table = useTable({
    features,
    columns,
    data: jobs,
    getRowId: (row) => String(row.id),
    globalFilterFn: "includesString",
    getColumnCanGlobalFilter: (column) => column.id === "company" || column.id === "role",
  })

  const hideableColumns = table.getAllColumns().filter((column) => column.getCanHide())
  const rows = table.getRowModel().rows
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount = table.getFilteredRowModel().rows.length

  async function handleConfirmDelete() {
    if (!deleteTarget) {
      return
    }

    setIsDeleting(true)
    try {
      await deleteJobApplication(deleteTarget.id)
      const targetPage =
        pagination.currentPage > 1 && jobs.length === 1
          ? pagination.currentPage - 1
          : pagination.currentPage
      jobsCacheByPage.clear()
      setDeleteTarget(null)
      await loadJobs(targetPage, false)
    } catch {
      setError("Failed to delete the job application. Please try again.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!isLoading && !error && jobs.length === 0) {
    return (
      <EmptyState
        title="No job applications yet"
        description="Jobs you save or apply to will show up here."
        icon={<Inbox className="size-6" />}
      />
    )
  }

  let bodyContent: ReactNode

  if (isLoading) {
    bodyContent = (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-32 text-center">
          <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="size-4 animate-spin" />
            Loading job applications...
          </span>
        </TableCell>
      </TableRow>
    )
  } else if (rows.length === 0) {
    bodyContent = (
      <TableRow>
        <TableCell colSpan={columns.length} className="h-32 text-center text-sm text-muted-foreground">
          No results.
        </TableCell>
      </TableRow>
    )
  } else {
    bodyContent = rows.map((row) => (
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
          navigate(`/jobs/${row.original.id}`)
        }}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell key={cell.id}>
            <table.FlexRender cell={cell} />
          </TableCell>
        ))}
      </TableRow>
    ))
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{error}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => void loadJobs(pagination.currentPage, true)}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <Input
            placeholder="Filter jobs..."
            value={(table.state.globalFilter as string | undefined) ?? ""}
            onChange={(event) => table.setGlobalFilter(event.target.value)}
            className="h-8 max-w-sm"
          />
          <StatusFacetedFilter column={table.getColumn("status")} />
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
                {COLUMN_LABELS[column.id] ?? column.id}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={cn("overflow-hidden rounded-xl border border-border transition-opacity duration-200", isFetchingPage && "opacity-60")}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>{bodyContent}</TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {selectedCount} of {totalCount} row(s) selected on this page.
        </p>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            Page {pagination.currentPage} of {pagination.lastPage} ({pagination.total} total)
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadJobs(pagination.currentPage - 1, false)}
            disabled={!pagination.hasPreviousPage || isFetchingPage}
          >
            Previous
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => void loadJobs(pagination.currentPage + 1, false)}
            disabled={!pagination.hasNextPage || isFetchingPage}
          >
            {isFetchingPage ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
            Next
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete job application?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.role} at ${deleteTarget.company}.`
            : undefined
        }
        confirmLabel="Delete"
        destructive
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <EditJobModal
        job={editingTarget}
        open={editingTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTarget(null)
        }}
        onSuccess={() => {
          jobsCacheByPage.clear()
          void loadJobs(pagination.currentPage, false)
        }}
      />
    </div>
  )
}