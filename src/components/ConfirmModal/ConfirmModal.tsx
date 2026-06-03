import { useEffect, useRef } from 'react';
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
}: Readonly<ConfirmModalProps>) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (isOpen && !el.open) {
      el.showModal();
    } else if (!isOpen && el.open) {
      el.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === dialogRef.current) {
      onCancel();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={onCancel}
      onClick={handleBackdropClick}
      className="rounded-2xl bg-background p-6 shadow-xl max-w-sm open:flex open:flex-col backdrop:bg-black/60 backdrop:backdrop-blur-sm"
    >
      <p className="text-base font-semibold text-foreground text-center mb-6">
        {message}
      </p>
      <div className="flex justify-center gap-12">
        <Button variant="outline" size="default" onClick={onCancel}>
          {cancelLabel}
        </Button>
        <Button
          variant="default"
          size="default"
          onClick={onConfirm}
          className={confirmClassName}
        >
          {confirmLabel}
        </Button>
      </div>
    </dialog>
  );
}
