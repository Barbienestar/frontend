import { useState } from 'react';
import { Button } from '@/components/Button/button';
import { Badge } from '../ui/badge';
import FileUpload from '../FileUpload/FileUpload';
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardFooter,
} from '../ui/card';
import { Info, Upload } from 'lucide-react';
import { uploadMedicineStock } from '@/services/medicines/medicinesService';
import { toast } from 'sonner';

interface Props {
  hospitalId?: number;
  hospitalName?: string;
}

const StockFileUpload = ({ hospitalId, hospitalName }: Props) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileUploadKey, setFileUploadKey] = useState(0);

  const handleUpload = async () => {
    if (!file || !hospitalId) return;

    setUploading(true);
    try {
      await uploadMedicineStock(String(hospitalId), file);
      toast.success('Archivo subido con éxito');
      setFile(null);
      setFileUploadKey((prev) => prev + 1);
    } catch (e) {
      console.error('Error uploading stock:', e);
      toast.error(
        'Error al subir el archivo. Revise el formato o la extensión del archivo.'
      );
    } finally {
      setUploading(false);
    }
  };

  if (!hospitalId) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Carga de datos oficiales</CardTitle>
          <CardAction>
            <Badge variant="destructive" className="p-4 rounded-sm">
              No hay hospital seleccionado
            </Badge>
          </CardAction>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de datos oficiales</CardTitle>
        {hospitalName && (
          <CardAction>
            <Badge variant="secondary" className="p-4 rounded-sm">
              {hospitalName}
            </Badge>
          </CardAction>
        )}
      </CardHeader>
      <div className="px-6">
        <FileUpload key={fileUploadKey} variant="csv" onFileChange={setFile} />
      </div>
      <CardFooter className="flex-col gap-2">
        <Button
          variant="default"
          size="lg"
          className="w-full bg-[#065E35] hover:bg-[#065E35]/80"
          onClick={handleUpload}
          disabled={!file || uploading || !hospitalId}
        >
          <Upload />
          {uploading ? 'Subiendo...' : 'Subir archivo'}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full bg-blue-600 text-white rounded-md hover:bg-blue-700"
          asChild
        >
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
