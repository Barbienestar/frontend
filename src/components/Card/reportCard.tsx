import { ClipboardList } from "lucide-react";
import InputField from "../Input/inputField";
import FileUpload from "../FileUpload/FileUpload";
import { Button } from "../Button/button";

const hospitalOptions = [
  { value: "imss-1", label: "IMSS — Hospital General de Zona #1" },
  { value: "imss-2", label: "IMSS — Hospital General de Zona #2" },
  { value: "issste-1", label: "ISSSTE — Clínica Hospital Norte" },
  { value: "issste-2", label: "ISSSTE — Clínica Hospital Sur" },
  { value: "ssa-1", label: "SSA — Centro de Salud Tlalpan" },
  { value: "ssa-2", label: "SSA — Centro de Salud Iztapalapa" },
];

interface ReportCardProps {
  onCancel?: () => void;
  onSubmit?: () => void;
  fileUploadError?: boolean;
}

const ReportCard = ({ onCancel, onSubmit, fileUploadError = false }: ReportCardProps) => {
  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-6 w-full max-w-lg">
      <div className="flex items-center gap-2 mb-6">
        <ClipboardList className="size-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          Datos del Reporte
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <InputField
          variant="search"
          label="Nombre del Medicamento"
          placeholder="Ej. Paracetamol 500mg"
          description=""
        />
        <InputField
          variant="select"
          label="Hospital o Clínica"
          placeholder="Seleccione una unidad médica"
          description=""
          options={hospitalOptions}
        />
      </div>

      <div className="mb-6">
        <FileUpload variant="receta" error={fileUploadError} />
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="default" onClick={onSubmit}>
          Enviar Reporte
        </Button>
      </div>
    </div>
  );
};

export default ReportCard;