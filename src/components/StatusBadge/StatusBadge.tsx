import { Badge } from '@/components/ui/badge'

type StatusBadgeVariant = 'Disponible' | 'Limitado' | 'Agotado'

interface StatusBadgeProps {
  variant: StatusBadgeVariant
}

const StatusBadge = ({ variant }: StatusBadgeProps) => {
  const colors = {
    Disponible: 'bg-green-50 text-green-700',
    Agotado: 'bg-red-50 text-red-700',
    Limitado: 'bg-yellow-50 text-yellow-700',
  }

  return <Badge className={`${colors[variant]}`}>{variant}</Badge>
}

export default StatusBadge
