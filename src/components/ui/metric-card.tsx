// src/components/ui/metric-card.tsx
import * as React from 'react'
import { cn } from '@/lib/utils'

type MetricCardVariant = 'pending' | 'approved' | 'rejected'

const variantStyles: Record<MetricCardVariant, string> = {
  pending: 'border-l-blue-500',
  approved: 'border-l-green-500',
  rejected: 'border-l-red-500',
}

function MetricCard({
  className,
  variant = 'pending',
  ...props
}: React.ComponentProps<'div'> & { variant?: MetricCardVariant }) {
  return (
    <div
      data-slot="metric-card"
      data-variant={variant}
      className={cn(
        'group/metric-card relative flex flex-col gap-3 overflow-hidden rounded-xl bg-card px-5 py-4 text-card-foreground ring-1 ring-foreground/10 border-l-4',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

function MetricCardHeader({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="metric-card-header"
      className={cn('flex items-start justify-between', className)}
      {...props}
    />
  )
}

function MetricCardLabel({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="metric-card-label"
      className={cn(
        'text-xs font-semibold uppercase tracking-widest text-muted-foreground',
        className
      )}
      {...props}
    />
  )
}

function MetricCardIcon({ className, ...props }: React.ComponentProps<'div'>) {
  return (
    <div
      data-slot="metric-card-icon"
      className={cn('shrink-0 text-muted-foreground', className)}
      {...props}
    />
  )
}

function MetricCardValue({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="metric-card-value"
      className={cn(
        'text-4xl font-bold tracking-tight text-foreground',
        className
      )}
      {...props}
    />
  )
}

function MetricCardTrend({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      data-slot="metric-card-trend"
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

export {
  MetricCard,
  MetricCardHeader,
  MetricCardLabel,
  MetricCardIcon,
  MetricCardValue,
  MetricCardTrend,
}
export type { MetricCardVariant }
