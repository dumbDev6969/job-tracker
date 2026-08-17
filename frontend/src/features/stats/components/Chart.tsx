"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { listAllJobApplications } from "@/features/job-track/services/jobService"
import type { JobApplication } from "@/features/job-track/types"

type SeriesKey = "referred" | "cold"

type ChartPoint = {
  date: string
  applications: number
}

const chartConfig = {
  applications: {
    label: "Applications",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

function emptyCounts() {
  return {
    referred: 0,
    cold: 0,
  } satisfies Record<SeriesKey, number>
}

function formatDateBucket(dateValue: string) {
  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return null
  }

  const year = parsedDate.getFullYear()
  const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
  const day = String(parsedDate.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function aggregateApplicationsToChartPoints(applications: JobApplication[]) {
  const groupedByDate = new Map<string, number>()
  const totals = emptyCounts()
  let totalAppliedCount = 0

  for (const application of applications) {
    if (!application.applied_date) {
      continue
    }

    const dateBucket = formatDateBucket(application.applied_date)
    if (!dateBucket) {
      continue
    }

    const seriesKey: SeriesKey = application.referral ? "referred" : "cold"
    totals[seriesKey] += 1
    totalAppliedCount += 1
    groupedByDate.set(dateBucket, (groupedByDate.get(dateBucket) ?? 0) + 1)
  }

  const chartPoints: ChartPoint[] = [...groupedByDate.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, applicationsCount]) => ({
      date,
      applications: applicationsCount,
    }))

  return { chartPoints, totalAppliedCount, totals }
}

export function ChartBarInteractive() {
  const [chartData, setChartData] = React.useState<ChartPoint[]>([])
  const [totals, setTotals] = React.useState<Record<SeriesKey, number>>(emptyCounts())
  const [totalAppliedCount, setTotalAppliedCount] = React.useState(0)
  const [isLoading, setIsLoading] = React.useState(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  React.useEffect(() => {
    let isMounted = true

    async function loadChartData() {
      setIsLoading(true)
      setErrorMessage(null)

      const applications = await listAllJobApplications()
      const aggregated = aggregateApplicationsToChartPoints(applications)

      if (!isMounted) {
        return
      }

      setChartData(aggregated.chartPoints)
      setTotals(aggregated.totals)
      setTotalAppliedCount(aggregated.totalAppliedCount)
      setIsLoading(false)
    }

    loadChartData().catch(() => {
      if (!isMounted) {
        return
      }

      setErrorMessage("Unable to load chart data right now.")
      setIsLoading(false)
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <Card className="py-0">
      <CardHeader className="flex flex-col items-stretch border-b p-0! sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 pt-4 pb-3 sm:py-0!">
          <CardTitle>Daily Applications</CardTitle>
          <CardDescription>
            Bars show how many applications you submitted on each applied date from backend data.{" "}
            Total applied: {totalAppliedCount.toLocaleString()}.
          </CardDescription>
        </div>
        <div className="grid grid-cols-3 border-t sm:border-t-0 sm:border-l">
          {(
            [
              ["applications", "Total Applied", totalAppliedCount],
              ["referred", "Referred Jobs", totals.referred],
              ["cold", "Cold Applies", totals.cold],
            ] as const
          ).map(([key, label, value]) => (
            <div
              key={key}
              className="relative flex flex-1 flex-col justify-center gap-1 border-r px-6 py-4 text-left last:border-r-0 sm:px-8 sm:py-6"
            >
              <span className="text-xs text-muted-foreground">{label}</span>
              <span className="text-lg leading-none font-bold sm:text-3xl">
                {value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        {isLoading ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            Loading chart data...
          </div>
        ) : errorMessage ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-destructive">
            {errorMessage}
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
            No application records with an applied date yet.
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
            <BarChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) =>
                  new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                }
              />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    className="w-[170px]"
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    }
                  />
                }
              />
              <Bar dataKey="applications" fill="var(--color-applications)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
