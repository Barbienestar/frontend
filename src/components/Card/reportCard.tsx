import { ClipboardList, Loader2 } from 'lucide-react';
import InputField from '../Input/inputField';
import { Button } from '../Button/button';
import FileUpload from '../FileUpload/FileUpload';

interface SelectOption {
  value: string;
  label: string;
}

interface ReportCardProps {
  medicineOptions: SelectOption[];
  hospitalOptions: SelectOption[];
  selectedMedicine: string;
  selectedHospital: string;
  description: string;
  onMedicineChange: (value: string) => void;
  onHospitalChange: (value: string) => void;
  onDescriptionChange: (value: string) => void;
  onFileChange: (file: File | null) => void;
  onCancel?: () => void;
  onSubmit?: () => void;
  isLoading?: boolean;
  isUploading?: boolean;
}

const ReportCard = ({
  medicineOptions,
  hospitalOptions,
  selectedMedicine,
  selectedHospital,
  description,
  onMedicineChange,
  onHospitalChange,
  onDescriptionChange,
  onFileChange,
  onCancel,
  onSubmit,
  isLoading = false,
  isUploading = false,
}: ReportCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 w-full">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="size-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          Datos del Reporte
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <InputField
          variant="select"
          label="Medicamento"
          placeholder="Seleccione un medicamento"
          description=""
          options={medicineOptions}
          value={selectedMedicine}
          onChange={(e) => onMedicineChange(e.target.value)}
        />
        <InputField
          variant="select"
          label="Hospital o Clínica"
          placeholder="Seleccione una unidad médica"
          description=""
          options={hospitalOptions}
          value={selectedHospital}
          onChange={(e) => onHospitalChange(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-foreground mb-1">
          Descripción
        </label>
        <textarea
          className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm
                     text-foreground placeholder:text-muted-foreground focus:outline-none
                     focus:ring-2 focus:ring-ring resize-none min-h-[100px]"
          placeholder="Describe el problema con el abasto del medicamento..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <FileUpload variant="receta" onFileChange={onFileChange} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        <Button variant="default" onClick={onSubmit} disabled={isLoading || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Subiendo imagen...
            </>
          ) : isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Enviando...
            </>
          ) : (
            'Enviar Reporte'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;
