import { PagePlaceholder } from "./PagePlaceholder"
import { ChartBarInteractive } from "../features/stats/components/Chart"
import { KPIs } from "../features/stats/components/KPIs"
export function OverviewPage() {
  return (
    <PagePlaceholder
      title="Job Applications"
      description="Track your job applications and their statuses."
      
    >
      <div className="space-y-4 sm:space-y-6">
        <KPIs />
        <ChartBarInteractive />
      </div>
    </PagePlaceholder>
  )
}
