import type { Meta, StoryObj } from '@storybook/react';
import { SidebarInfoCard } from './sidebarInfoCard';
import { ShieldCheck, Clock, CheckCircle, Info, Star, Bell } from 'lucide-react';

const meta: Meta<typeof SidebarInfoCard> = {
  title: 'Components/SidebarInfoCard',
  component: SidebarInfoCard,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div className="max-w-xs">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SidebarInfoCard>;

export const Default: Story = {
  args: {
    icon: ShieldCheck,
    title: '¿Por qué reportar?',
    description:
      'Los reportes ciudadanos permiten a la Secretaría de Salud identificar zonas críticas y redistribuir el inventario nacional de manera eficiente.',
    features: [
      { icon: ShieldCheck, text: 'Anónimo y Seguro' },
      { icon: Clock, text: 'Seguimiento en Tiempo Real' },
      { icon: CheckCircle, text: 'Validez Oficial' },
    ],
  },
};

export const CustomContent: Story = {
  args: {
    icon: Info,
    title: '¿Cómo funciona?',
    description:
      'Completa el formulario con los datos del medicamento y la unidad médica donde se detectó el desabasto.',
    features: [
      { icon: Star, text: 'Proceso simple y rápido' },
      { icon: Bell, text: 'Notificaciones de seguimiento' },
      { icon: CheckCircle, text: 'Confirmación inmediata' },
    ],
  },
};

export const NoFeatures: Story = {
  args: {
    icon: Info,
    title: 'Información importante',
    description:
      'Esta sección contiene información relevante para el usuario sobre el proceso de reporte de desabasto.',
    features: [],
  },
};