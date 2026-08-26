import { useCallback, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
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
import { ArrowUpDown, Inbox, RefreshCw } from "lucide-react"

import { ConfirmDialog } from "@/components/ConfirmDialog"
import { EditJobModal } from "./EditJobModal"
import { EmptyState } from "@/components/EmptyState"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

import {
  JOB_APPLICATIONS_KEY,
  deleteJobApplication,
  listJobApplications,
} from "../services/jobService"
import { JOB_STATUSES, type JobApplication, type JobApplicationStatus } from "../types"
import { JobsPagination } from "./JobsPagination"
import { JobsRowActions } from "./JobsRowActions"
import { JobsTableBody } from "./JobsTableBody"
import { JobsToolbar } from "./JobsToolbar"

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

export type JobsTableFeatures = typeof features

const columnHelper = createColumnHelper<JobsTableFeatures, JobApplication>()

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
  created_at: "Date Saved",
}

function formatDate(value: string | null | undefined) {
  if (!value) {
    return "-"
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
  column: Column<JobsTableFeatures, JobApplication, TValue>
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

export function Jobs() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [editingTarget, setEditingTarget] = useState<JobApplication | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<JobApplication | null>(null)

  const {
    data,
    isLoading,
    isFetching,
    isError,
    refetch,
  } = useQuery({
    queryKey: [...JOB_APPLICATIONS_KEY, { page }],
    queryFn: () => listJobApplications(page),
  })

  const jobs = useMemo(() => data?.data ?? [], [data?.data])

  const pagination = useMemo(
    () => ({
      currentPage: data?.meta.current_page ?? 1,
      lastPage: data?.meta.last_page ?? 1,
      total: data?.meta.total ?? 0,
      hasPreviousPage: Boolean(data?.links.prev),
      hasNextPage: Boolean(data?.links.next),
    }),
    [data]
  )

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteJobApplication(id),
    onSuccess: async () => {
      if (page > 1 && jobs.length === 1) {
        setPage((prev) => prev - 1)
      }
      setDeleteTarget(null)
      await queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY })
    },
  })

  const handleConfirmDelete = useCallback(() => {
    if (deleteTarget) {
      deleteMutation.mutate(deleteTarget.id)
    }
  }, [deleteTarget, deleteMutation])

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
          header: ({ column }) => <SortableHeader label="Role" column={column} />,
        }),
        columnHelper.accessor("applied_date", {
          header: ({ column }) => <SortableHeader label="Applied" column={column} />,
          cell: ({ getValue }) => formatDate(getValue()),
        }),
        columnHelper.accessor("created_at", {
          header: ({ column }) => <SortableHeader label="Date Saved" column={column} />,
          cell: ({ getValue }) => formatDate(getValue()),
        }),
        columnHelper.display({
          id: "actions",
          header: () => <span className="sr-only">Actions</span>,
          cell: ({ row }) => (
            <JobsRowActions
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

  const hideableColumns = useMemo(
    () => table.getAllColumns().filter((column) => column.getCanHide()),
    [table]
  )

  const rows = table.getRowModel().rows
  const selectedCount = table.getFilteredSelectedRowModel().rows.length
  const totalCount = table.getFilteredRowModel().rows.length

  const errorMessage = isError
    ? "Failed to load job applications."
    : deleteMutation.isError
      ? "Failed to delete the job application. Please try again."
      : null

  if (!isLoading && !errorMessage && jobs.length === 0) {
    return (
      <EmptyState
        title="No job applications yet"
        description="Jobs you save or apply to will show up here."
        icon={<Inbox className="size-6" />}
      />
    )
  }

  return (
    <div className="space-y-4">
      {errorMessage ? (
        <div className="flex items-center justify-between rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <span>{errorMessage}</span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => void refetch()}
          >
            <RefreshCw className="size-3.5" />
            Retry
          </Button>
        </div>
      ) : null}

      <JobsToolbar
        searchValue={(table.state.globalFilter as string | undefined) ?? ""}
        onSearchChange={(value) => table.setGlobalFilter(value)}
        statusColumn={table.getColumn("status")}
        hideableColumns={hideableColumns}
        columnLabels={COLUMN_LABELS}
      />
      <div
        className={cn(
          "w-full rounded-xl border border-border transition-opacity duration-200",
          isFetching && !isLoading && "opacity-60"
        )}
      >
        <Table className="w-full">
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
          <TableBody>
            <JobsTableBody
              isLoading={isLoading}
              rows={rows}
              columnsCount={columns.length}
              FlexRender={table.FlexRender}
              onRowClick={(job) => navigate(`/jobs/${job.id}`)}
            />
          </TableBody>
        </Table>
      </div>
      <JobsPagination
        selectedCount={selectedCount}
        totalCount={totalCount}
        currentPage={pagination.currentPage}
        lastPage={pagination.lastPage}
        total={pagination.total}
        hasPreviousPage={pagination.hasPreviousPage}
        hasNextPage={pagination.hasNextPage}
        isFetching={isFetching}
        isLoading={isLoading}
        onPrevious={() => setPage((p) => Math.max(1, p - 1))}
        onNext={() => setPage((p) => p + 1)}
      />

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
        isLoading={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          deleteMutation.reset()
          setDeleteTarget(null)
        }}
      />

      <EditJobModal
        job={editingTarget}
        open={editingTarget !== null}
        onOpenChange={(open) => {
          if (!open) setEditingTarget(null)
        }}
        onSuccess={() => {
          void queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY })
        }}
      />
    </div>
  )
}