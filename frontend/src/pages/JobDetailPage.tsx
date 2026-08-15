import { Job } from "@/features/job-track"
import { PagePlaceholder } from "./PagePlaceholder"

export function JobDetailPage() {
  return (
    <PagePlaceholder
      title="Job Details"
      description="View full application timeline and notes."
    >
      <Job />
    </PagePlaceholder>
  )
}
