import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ConfirmModal } from './ConfirmModal.tsx';
import { Button } from '@/components/Button/button';

const meta: Meta<typeof ConfirmModal> = {
  title: 'Components/ConfirmModal',
  component: ConfirmModal,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Modal de confirmación reutilizable. Acepta un mensaje configurable y expone callbacks para confirmar o cancelar. El fondo se puede cerrar haciendo clic en el overlay.',
      },
    },
  },
  argTypes: {
    isOpen: { control: 'boolean' },
    message: { control: 'text' },
    confirmLabel: { control: 'text' },
    cancelLabel: { control: 'text' },
    onConfirm: { action: 'confirmed' },
    onCancel: { action: 'cancelled' },
  },
};

export default meta;
type Story = StoryObj<typeof ConfirmModal>;

// ─── Helper wrapper que maneja el estado abierto/cerrado ──────────────────────
function ModalWithTrigger(args: React.ComponentProps<typeof ConfirmModal>) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex h-screen items-center justify-center bg-muted/40">
      <Button variant="default" onClick={() => setOpen(true)}>
        Abrir modal
      </Button>
      <ConfirmModal
        {...args}
        isOpen={open}
        onConfirm={() => {
          args.onConfirm();
          setOpen(false);
        }}
        onCancel={() => {
          args.onCancel();
          setOpen(false);
        }}
      />
    </div>
  );
}

// ─── Historia base ────────────────────────────────────────────────────────────
export const Default: Story = {
  render: (args) => <ModalWithTrigger {...args} />,
  args: {
    message: '¿Está seguro que desea continuar?',
    confirmLabel: 'Aceptar',
    cancelLabel: 'Cancelar',
  },
};

// ─── Mensaje personalizado ────────────────────────────────────────────────────
export const MensajePersonalizado: Story = {
  name: 'Mensaje personalizado',
  render: (args) => <ModalWithTrigger {...args} />,
  args: {
    message:
      'Al enviar este reporte lo harás de forma permanente. ¿Deseas proceder?',
    confirmLabel: 'Sí, enviar',
    cancelLabel: 'No, volver',
  },
};

// ─── Acción destructiva ───────────────────────────────────────────────────────
export const AccionDestructiva: Story = {
  name: 'Acción destructiva',
  render: (args) => <ModalWithTrigger {...args} />,
  args: {
    message:
      '¿Está seguro que desea eliminar este reporte? Esta acción no se puede deshacer.',
    confirmLabel: 'Eliminar',
    cancelLabel: 'Cancelar',
  },
};

// ─── Siempre visible (para inspección en Docs) ────────────────────────────────
export const SiempreVisible: Story = {
  name: 'Siempre visible (Docs)',
  args: {
    isOpen: true,
    message: '¿Está seguro que desea continuar?',
    confirmLabel: 'Aceptar',
    cancelLabel: 'Cancelar',
  },
};
