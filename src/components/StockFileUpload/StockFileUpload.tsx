import { useState } from 'react'
import { Button } from '@/components/Button/button'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu'
import { Badge } from '../ui/badge'
import type { HospitalData } from '@/common/HospitalData'
import FileUpload from '../FileUpload/FileUpload'
import { Card, CardHeader, CardTitle, CardAction, CardFooter } from '../ui/card'
import { ChevronDown, Info } from 'lucide-react'

const StockFileUpload = ({ hospitals }: { hospitals: HospitalData[] }) => {
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(
    hospitals.length === 1 ? hospitals[0].id : null
  )

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId)

  if (hospitals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carga de datos oficiales</CardTitle>
          <CardAction>
            <Badge variant="destructive" className="p-4 rounded-sm">
              No hay hospitales disponibles
            </Badge>
          </CardAction>
        </CardHeader>
        <FileUpload variant="csv" label="Sube el archivo CSV con tus datos" />
        <CardFooter>
          <Button variant="default" size="lg" className="w-full">
            <Info />
            Descarga la plantilla aquí.
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de datos oficiales</CardTitle>
        {hospitals.length === 1 ? (
          <CardAction>
            <Badge variant="secondary" className="p-4 rounded-sm">
              {selectedHospital?.name}
            </Badge>
          </CardAction>
        ) : (
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary">
                  {selectedHospital?.name ?? 'Hospitales'} <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={selectedHospitalId ?? undefined}
                  onValueChange={setSelectedHospitalId}
                >
                  {hospitals.map((hospital) => (
                    <DropdownMenuRadioItem
                      key={hospital.id}
                      value={hospital.id}
                    >
                      {hospital.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        )}
      </CardHeader>
      <FileUpload variant="csv" label="Sube el archivo CSV con tus datos" />
      <CardFooter>
        <Button variant="default" size="lg" className="w-full">
          <Info />
          Descarga la plantilla aquí.
        </Button>
      </CardFooter>
    </Card>
  )
}

export default StockFileUpload
