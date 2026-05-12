// components/informative-card/informative-card.stories.tsx
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Shield, BarChart2, Users, Bell, Lock } from 'lucide-react';
import { InformativeCard } from './informative-card';

const meta = {
  component: InformativeCard,
} satisfies Meta<typeof InformativeCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Transparencia: Story = {
  args: {
    title: 'Transparencia',
    description: 'Acceso total a datos de inventario nacional.',
    icon: <Shield size={28} />,
    className: 'w-[350px]',
  },
};

export const Eficiencia: Story = {
  args: {
    title: 'Eficiencia',
    description: 'Optimización de reportes en tiempo real.',
    icon: <BarChart2 size={28} />,
    className: 'w-[350px]',
  },
};

export const Compromiso: Story = {
  args: {
    title: 'Compromiso',
    description: 'Servicio dedicado al bienestar del pueblo.',
    icon: <Users size={28} />,
    className: 'w-[350px]',
  },
};

export const SinClassName: Story = {
  args: {
    title: 'Notificaciones',
    description: 'Recibe alertas en tiempo real sobre cambios importantes.',
    icon: <Bell size={28} />,
  },
};

export const DescripcionLarga: Story = {
  args: {
    title: 'Seguridad',
    description:
      'Protección avanzada de datos con cifrado de extremo a extremo y autenticación multifactor para todos los usuarios.',
    icon: <Lock size={28} />,
    className: 'w-[350px]',
  },
};
