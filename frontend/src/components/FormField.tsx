import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"

type FormFieldProps = {
  id?: string
  label?: ReactNode
  description?: ReactNode
  error?: ReactNode
  required?: boolean
  children: ReactNode
  className?: string
  labelClassName?: string
  contentClassName?: string
  orientation?: "vertical" | "horizontal" | "responsive"
  hideLabel?: boolean
}

export function FormField({
  id,
  label,
  description,
  error,
  required = false,
  children,
  className,
  labelClassName,
  contentClassName,
  orientation = "responsive",
  hideLabel = false,
}: FormFieldProps) {
  return (
    <Field
      orientation={orientation}
      className={cn("w-full gap-2 sm:gap-3", className)}
    >
      {!hideLabel && label ? (
        <FieldLabel
          htmlFor={id}
          className={cn(
            "min-w-0 text-sm font-medium text-foreground",
            labelClassName
          )}
        >
          <span className="inline-flex items-center gap-1">
            {label}
            {required ? (
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            ) : null}
          </span>
        </FieldLabel>
      ) : null}

      <FieldContent className={cn("min-w-0", contentClassName)}>
        {children}
        {description ? (
          <FieldDescription>{description}</FieldDescription>
        ) : null}
        {error ? <FieldError>{error}</FieldError> : null}
      </FieldContent>
    </Field>
  )
}

export default FormField
