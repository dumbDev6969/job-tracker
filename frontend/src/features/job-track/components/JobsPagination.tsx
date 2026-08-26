import { Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

type JobsPaginationProps = {
  selectedCount: number
  totalCount: number
  currentPage: number
  lastPage: number
  total: number
  hasPreviousPage: boolean
  hasNextPage: boolean
  isFetching: boolean
  isLoading: boolean
  onPrevious: () => void
  onNext: () => void
}

export function JobsPagination({
  selectedCount,
  totalCount,
  currentPage,
  lastPage,
  total,
  hasPreviousPage,
  hasNextPage,
  isFetching,
  isLoading,
  onPrevious,
  onNext,
}: JobsPaginationProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">
        {selectedCount} of {totalCount} row(s) selected on this page.
      </p>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          Page {currentPage} of {lastPage} ({total} total)
        </span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onPrevious}
          disabled={!hasPreviousPage || isFetching}
        >
          Previous
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onNext}
          disabled={!hasNextPage || isFetching}
        >
          {isFetching && !isLoading ? <Loader2 className="mr-1 size-3.5 animate-spin" /> : null}
          Next
        </Button>
      </div>
    </div>
  )
}
