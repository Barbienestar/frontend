// src/components/MetricCard/metric-card.tsx
import * as React from 'react'
import {
  MetricCard as MetricCardBase,
  MetricCardHeader,
  MetricCardIcon,
  MetricCardLabel,
  MetricCardTrend,
  MetricCardValue,
} from '@/components/ui/metric-card'
import type { MetricCardVariant } from '@/components/ui/metric-card'
import { cn } from '@/lib/utils'

const trendColorMap: Record<MetricCardVariant, string> = {
  pending: 'text-blue-600',
  approved: 'text-green-600',
  rejected: 'text-red-500',
}

interface MetricCardProps {
  /** Etiqueta superior de la tarjeta (ej. "Pendientes") */
  label: string
  /** Valor numérico principal (ej. 124 o "1,450") */
  value: string | number
  /** Ícono de Lucide u otro ReactNode */
  icon: React.ReactNode
  /** Texto de tendencia (ej. "+12% vs. semana pasada") */
  trend: string
  /** Porción resaltada del texto de tendencia (ej. "+12%") */
  trendHighlight?: string
  /** Variante visual que determina el color del borde y la tendencia */
  variant?: MetricCardVariant
  className?: string
}

export function MetricCard({
  label,
  value,
  icon,
  trend,
  trendHighlight,
  variant = 'pending',
  className,
}: MetricCardProps) {
  // Separar highlight del resto del texto si existe
  const trendRest =
    trendHighlight && trend.startsWith(trendHighlight)
      ? trend.slice(trendHighlight.length)
      : null

  return (
    <MetricCardBase variant={variant} className={className}>
      <MetricCardHeader>
        <MetricCardLabel>{label}</MetricCardLabel>
        <MetricCardIcon className={trendColorMap[variant]}>
          {icon}
        </MetricCardIcon>
      </MetricCardHeader>

      <MetricCardValue>{value}</MetricCardValue>

      <MetricCardTrend>
        {trendHighlight && trendRest !== null ? (
          <>
            <span className={cn('font-semibold', trendColorMap[variant])}>
              {trendHighlight}
            </span>
            {trendRest}
          </>
        ) : (
          trend
        )}
      </MetricCardTrend>
    </MetricCardBase>
  )
}
