import { useCallback, useState } from 'react'
import { FileUp, X, CloudUpload } from 'lucide-react'
import { FieldLabel } from '../ui/field'

type FileUploadVariant = 'receta' | 'csv'

interface FileUploadProps {
  variant?: FileUploadVariant
  label?: string
  error?: boolean
  onFileChange?: (file: File | null) => void
}

const config = {
  receta: {
    accept: 'image/jpeg,image/png,application/pdf',
    icon: FileUp,
    mainText: <>Arrastre la imagen de su receta aquí o explore archivos</>,
    subText: 'Formatos aceptados: JPG, PNG, PDF (Máx 5MB)',
    defaultLabel: 'Evidencia de Receta (Foto) *',
    button: false,
  },
  csv: {
    accept: '.csv,text/csv',
    icon: CloudUpload, // Changed from CloudDownload to CloudUpload to keep local change
    mainText: <>Arrastra tu archivo CSV </>,
    subText: 'Formato oficial de inventarios',
    defaultLabel: 'Seleccionar archivo *',
    button: true,
  },
}

const FileUpload = ({
  variant = 'receta',
  label,
  error = false,
  onFileChange,
}: FileUploadProps) => {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)

  const cfg = config[variant]
  const Icon = cfg.icon

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped) {
        setFile(dropped)
        onFileChange?.(dropped)
      }
    },
    [onFileChange]
  )

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0] ?? null
      setFile(selected)
      onFileChange?.(selected)
    },
    [onFileChange]
  )

  const handleRemove = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      setFile(null)
      onFileChange?.(null)
    },
    [onFileChange]
  )

  const borderClass = error
    ? 'border-destructive bg-destructive/5'
    : isDragging
      ? 'border-primary bg-primary/5'
      : 'border-muted-foreground/30'

  return (
    <div className="flex flex-col gap-1.5">
      <FieldLabel>{label ?? cfg.defaultLabel}</FieldLabel>

      <label
        className={`relative flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed px-6 py-8 text-center cursor-pointer transition-colors ${borderClass}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept={cfg.accept}
          className="sr-only"
          onChange={handleInputChange}
        />

        {file ? (
          <div className="flex items-center gap-2 text-sm text-foreground">
            <Icon className="size-5 text-primary shrink-0" />
            <span className="max-w-[220px] truncate">{file.name}</span>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-1 rounded-full p-0.5 hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ) : (
          <>
            <Icon
              className={`size-10 ${
                error ? 'text-destructive' : 'text-muted-foreground'
              }`}
              strokeWidth={1.25}
            />
            <div className="space-y-1">
              <p
                className={`text-sm ${
                  error ? 'text-destructive' : 'text-muted-foreground'
                }`}
              >
                {cfg.mainText}
              </p>
              <p
                className={`text-xs ${
                  error ? 'text-destructive/80' : 'text-muted-foreground/70'
                }`}
              >
                {cfg.subText}
              </p>
            </div>
          </>
        )}
      </label>

      {error && (
        <p className="text-xs text-destructive">Este campo es obligatorio.</p>
      )}
    </div>
  )
}

export default FileUpload
