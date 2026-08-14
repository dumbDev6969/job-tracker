import { PagePlaceholder } from "./PagePlaceholder"
import { Jobs } from "../features/job-track"
export function OverviewPage() {
  return (
    <PagePlaceholder
      title="Job Applications"
      description="Track your job applications and their statuses."
      
    >
      <Jobs />
    </PagePlaceholder>
  )
}
