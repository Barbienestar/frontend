import { useState } from 'react';
import { Button } from '@/components/Button/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from '../ui/dropdown-menu';
import { Badge } from '../ui/badge';
import FileUpload from '../FileUpload/FileUpload';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from '../ui/card';
import { ChevronDown, Info, Upload } from 'lucide-react';
import { useHospitals } from '@/hooks/useHospitals';
import { uploadMedicineStock } from '@/services/medicines/medicinesService';

const StockFileUpload = () => {
  const { hospitals, loading, error } = useHospitals();
  const [selectedHospitalId, setSelectedHospitalId] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const selectedHospital = hospitals.find((h) => h.id === selectedHospitalId);

  const handleUpload = async () => {
    const hospitalId = selectedHospitalId ?? (hospitals.length === 1 ? hospitals[0].id : null);
    if (!file || !hospitalId) return;

    setUploading(true);
    try {
      await uploadMedicineStock(hospitalId, file);
      // éxito — aquí puedes agregar un toast o mensaje después
    } catch (e) {
      // error — aquí puedes agregar un mensaje de error después
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando hospitales...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error al cargar hospitales</CardTitle>
        </CardHeader>
      </Card>
    );
  }

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
        <CardFooter className="flex-col gap-2">
          <Button variant="default" size="lg" className="w-full" asChild>
            <a href="/csvTemplate/formato_abasto.csv" download>
              <Info />
              Descarga la plantilla aquí.
            </a>
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de datos oficiales</CardTitle>
        {hospitals.length === 1 ? (
          <CardAction>
            <Badge variant="secondary" className="p-4 rounded-sm">
              {hospitals[0].name}
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
                    <DropdownMenuRadioItem key={hospital.id} value={hospital.id}>
                      {hospital.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        )}
      </CardHeader>
      <FileUpload
        variant="csv"
        label="Sube el archivo CSV con tus datos"
        onFileChange={setFile}
      />
      <CardFooter className="flex-col gap-2">
        <Button
          variant="default"
          size="lg"
          className="w-full"
          onClick={handleUpload}
          disabled={!file || uploading || (!selectedHospitalId && hospitals.length > 1)}
        >
          <Upload />
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </Button>
        <Button variant="outline" size="lg" className="w-full" asChild>
          <a href="/csvTemplate/formato_abasto.csv" download>
            <Info />
            Descarga la plantilla aquí.
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StockFileUpload;