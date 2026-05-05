import * as React from 'react'
import { cn } from '@/lib/utils'

// ─── Shared base ────────────────────────────────────────────────────────────

interface StatCardBase {
  /** Etiqueta superior en mayúsculas (ej. "ABASTO PROMEDIO") */
  label: string
  /** Ícono en la esquina superior derecha */
  icon?: React.ReactNode
  className?: string
}

// ─── Variant: progress ──────────────────────────────────────────────────────

interface StatCardProgressProps extends StatCardBase {
  variant: 'progress'
  /** Valor principal (ej. "74.2%") */
  value: string
  /** Delta positivo/negativo (ej. "+2.1%") */
  delta?: string
  /** Valor numérico 0-100 para la barra */
  progress: number
}

// ─── Variant: number ────────────────────────────────────────────────────────

interface StatCardNumberProps extends StatCardBase {
  variant: 'number'
  /** Valor principal (ej. "12" o "1.2M") */
  value: string
  /** Etiqueta inline junto al valor (ej. "Consultar" o "Unidades") */
  valueLabel?: string
  /** Texto descriptivo debajo del valor */
  description?: string
}

export type StatCardProps = StatCardProgressProps | StatCardNumberProps

// ─── Component ──────────────────────────────────────────────────────────────

export function StatCard(props: StatCardProps) {
  const { label, icon, className } = props

  return (
    <div
      className={cn(
        'flex flex-col gap-3 rounded-2xl bg-white px-5 py-4 shadow-sm ring-1 ring-border',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          {label}
        </p>
        {icon && <span className="shrink-0 text-muted-foreground">{icon}</span>}
      </div>

      {/* Body */}
      {props.variant === 'progress' ? (
        <ProgressBody {...props} />
      ) : (
        <NumberBody {...props} />
      )}
    </div>
  )
}

// ─── Progress body ───────────────────────────────────────────────────────────

function ProgressBody({
  value,
  delta,
  progress,
}: StatCardProgressProps) {
  return (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {delta && (
          <span className="text-sm font-medium text-green-600">{delta}</span>
        )}
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </>
  )
}

// ─── Number body ─────────────────────────────────────────────────────────────

function NumberBody({ value, valueLabel, description }: StatCardNumberProps) {
  return (
    <>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {valueLabel && (
          <span className="text-sm font-medium text-muted-foreground">
            {valueLabel}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
    </>
  )
}
