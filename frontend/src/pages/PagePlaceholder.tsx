import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

type PagePlaceholderProps = {
  title: string
  description?: string
  actions?: ReactNode
  children?: ReactNode
  className?: string
  contentClassName?: string
}

export function PagePlaceholder({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
}: PagePlaceholderProps) {
  return (
    <section className={cn("mx-auto flex w-full max-w-7xl flex-col gap-6", className)}>
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h1>
          {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
        </div>

        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      <div className={cn("rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-6", contentClassName)}>
        {children ?? (
          <div className="rounded-xl border border-dashed border-border bg-muted/20 p-8 text-center sm:p-12">
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
        )}
      </div>
    </section>
  )
}
