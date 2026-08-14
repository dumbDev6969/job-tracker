import type { ChangeEventHandler, InputHTMLAttributes } from "react"
import { Search, X } from "lucide-react"

import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type SearchInputProps = InputHTMLAttributes<HTMLInputElement> & {
  value?: string
  onValueChange?: (value: string) => void
  onClear?: () => void
  containerClassName?: string
}

export function SearchInput({
  value = "",
  onChange,
  onValueChange,
  onClear,
  className,
  containerClassName,
  placeholder = "Search",
  ...props
}: SearchInputProps) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange?.(event)
    onValueChange?.(event.target.value)
  }

  return (
    <div className={cn("relative w-full", containerClassName)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        {...props}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={cn(
          "h-9 rounded-xl border-border bg-background pl-9 pr-9 text-sm shadow-sm",
          className
        )}
      />

      {value ? (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => {
            onClear?.()
            onValueChange?.("")
          }}
          className="absolute right-2.5 top-1/2 inline-flex -translate-y-1/2 items-center justify-center rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3.5" />
        </button>
      ) : null}
    </div>
  )
}

export default SearchInput
