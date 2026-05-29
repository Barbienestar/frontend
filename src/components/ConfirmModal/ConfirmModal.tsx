import { Button } from '@/components/Button/button';

interface ConfirmModalProps {
  /** Controla si el modal es visible */
  isOpen: boolean;
  /** Texto/nodo que se muestra como mensaje de confirmación */
  message: React.ReactNode;
  /** Texto del botón de confirmación (default: "Aceptar") */
  confirmLabel?: string;
  /** Texto del botón de cancelación (default: "Cancelar") */
  cancelLabel?: string;
  /** Clases adicionales para el botón de confirmación */
  confirmClassName?: string;
  /** Callback al confirmar */
  onConfirm: () => void;
  /** Callback al cancelar o cerrar */
  onCancel: () => void;
}

export function ConfirmModal({
  isOpen,
  message,
  confirmLabel = 'Aceptar',
  cancelLabel = 'Cancelar',
  confirmClassName,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    /* Overlay */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
      aria-modal="true"
      role="dialog"
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mensaje */}
        <p className="text-base font-semibold text-foreground text-center mb-6">
          {message}
        </p>

        {/* Acciones */}
        <div className="flex justify-center gap-12">
          <Button variant="outline" size="default" onClick={onCancel}>
            {cancelLabel}
          </Button>
          <Button variant="default" size="default" onClick={onConfirm} className={confirmClassName}>
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
