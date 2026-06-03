import { ClipboardList, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../Button/button';
import FileUpload from '../FileUpload/FileUpload';
import { SearchableSelect } from '@/components/SearchableSelect/SearchableSelect';

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
  imageUrl?: string | null;
}

interface FieldErrors {
  medicine?: string;
  hospital?: string;
  description?: string;
  image?: string;
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
  imageUrl = null,
}: ReportCardProps) => {
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleMedicineChange = (value: string) => {
    onMedicineChange(value);
    if (value) setErrors((prev) => ({ ...prev, medicine: undefined }));
  };

  const handleHospitalChange = (value: string) => {
    onHospitalChange(value);
    if (value) setErrors((prev) => ({ ...prev, hospital: undefined }));
  };

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onDescriptionChange(e.target.value);
    if (e.target.value.trim())
      setErrors((prev) => ({ ...prev, description: undefined }));
  };

  const handleFileChange = (file: File | null) => {
    onFileChange(file);
    if (file) setErrors((prev) => ({ ...prev, image: undefined }));
  };

  const handleSubmitClick = () => {
    const newErrors: FieldErrors = {};
    if (!selectedMedicine) newErrors.medicine = 'Selecciona un medicamento.';
    if (!selectedHospital) newErrors.hospital = 'Selecciona una unidad médica.';
    if (!description.trim())
      newErrors.description = 'Escribe una descripción del problema.';
    if (!imageUrl) newErrors.image = 'Adjunta una imagen de la receta.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit?.();
  };

  const isFormComplete =
    !!selectedMedicine &&
    !!selectedHospital &&
    !!description.trim() &&
    !!imageUrl;

  return (
    <div className="bg-card rounded-xl border border-border shadow-sm p-5 w-full">
      <div className="flex items-center gap-2 mb-4">
        <ClipboardList className="size-5 text-foreground" />
        <h2 className="text-lg font-semibold text-foreground">
          Datos del Reporte
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* SearchableSelect necesita poder recibir error y la marca de requerido.
            Si el componente no los acepta aún, ver nota abajo. */}
        <div className="flex flex-col gap-1">
          <SearchableSelect
            label={<RequiredLabel text="Medicamento" />}
            placeholder="Seleccione un medicamento"
            options={medicineOptions}
            value={selectedMedicine}
            onChange={handleMedicineChange}
            error={!!errors.medicine}
          />
          {errors.medicine && <FieldError message={errors.medicine} />}
        </div>

        <div className="flex flex-col gap-1">
          <SearchableSelect
            label={<RequiredLabel text="Hospital o Clínica" />}
            placeholder="Seleccione una unidad médica"
            options={hospitalOptions}
            value={selectedHospital}
            onChange={handleHospitalChange}
            error={!!errors.hospital}
          />
          {errors.hospital && <FieldError message={errors.hospital} />}
        </div>
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium text-foreground">
          <RequiredLabel text="Descripción" />
        </label>
        <textarea
          className={`w-full rounded-md border bg-background px-3 py-2 text-sm
                      text-foreground placeholder:text-muted-foreground focus:outline-none
                      focus:ring-2 resize-none min-h-[90px] transition-colors
                      ${
                        errors.description
                          ? 'border-destructive focus:ring-destructive'
                          : 'border-border focus:ring-ring'
                      }`}
          placeholder="Describe el problema con el abasto del medicamento..."
          value={description}
          onChange={handleDescriptionChange}
        />
        {errors.description && <FieldError message={errors.description} />}
      </div>

      <div className="mb-4 flex flex-col gap-1">
        <label className="block text-sm font-medium text-foreground">
          <RequiredLabel text="Imagen de receta" />
        </label>
        <FileUpload
          variant="receta"
          onFileChange={handleFileChange}
          error={!!errors.image}
        />
        {errors.image && <FieldError message={errors.image} />}
      </div>

      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel} disabled={isLoading}>
          Cancelar
        </Button>
        {(() => {
          const buttonContent = isUploading ? (
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
          );
          return (
            <Button
              variant="default"
              onClick={handleSubmitClick}
              disabled={isLoading || isUploading || !isFormComplete}
            >
              {buttonContent}
            </Button>
          );
        })()}
      </div>
    </div>
  );
};

export default ReportCard;

/** Asterisco rojo estándar de campo obligatorio */
const RequiredLabel = ({ text }: { text: string }) => (
  <>
    {text}
    <span className="text-destructive ml-0.5" aria-hidden="true">
      *
    </span>
  </>
);

/** Mensaje de error debajo del campo */
const FieldError = ({ message }: { message: string }) => (
  <p className="text-xs text-destructive flex items-center gap-1" role="alert">
    {message}
  </p>
);
