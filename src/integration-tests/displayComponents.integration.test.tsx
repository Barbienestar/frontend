// @jest-environment jsdom

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Footer } from '@/components/Global/footer';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import { PageHeader } from '@/components/PageHeader/pageHeader';
import { EmptySearchCTA } from '@/components/EmptySearchCTA/emptySearchCTA';
import { InformativeCard } from '@/components/InformativeCards/informative-card';
import StatusBadge from '@/components/StatusBadge/StatusBadge';
import { Megaphone } from 'lucide-react';

jest.mock('@/contexts/useAuth', () => ({
  useAuth: jest.fn(() => ({
    isAuthenticated: false,
    user: null,
    isLoading: false,
  })),
}));

describe('Display components', () => {
  describe('Footer', () => {
    it('renders full variant with contact info', () => {
      render(<Footer variant="full" />);
      expect(screen.getByText('Decision 360')).toBeInTheDocument();
      expect(screen.getByText('800 123 4567')).toBeInTheDocument();
      expect(screen.getByText(/contacto@salud.gob.mx/)).toBeInTheDocument();
    });

    it('renders minimal variant', () => {
      render(<Footer variant="minimal" />);
      expect(screen.getByText(/Sistema Nacional de Salud/)).toBeInTheDocument();
      expect(screen.getByText('Aviso de Privacidad')).toBeInTheDocument();
    });
  });

  describe('Breadcrumb', () => {
    it('renders items with separator', () => {
      const items = [
        { label: 'Inicio', href: '/' },
        { label: 'Reportes', href: '/reportes' },
        { label: 'Detalle' },
      ];
      render(<Breadcrumb items={items} />);
      expect(screen.getByText('Inicio')).toBeInTheDocument();
      expect(screen.getByText('Reportes')).toBeInTheDocument();
      expect(screen.getByText('Detalle')).toBeInTheDocument();
    });

    it('renders single item without separator', () => {
      render(<Breadcrumb items={[{ label: 'Solo' }]} />);
      expect(screen.getByText('Solo')).toBeInTheDocument();
      expect(screen.queryByText('/')).not.toBeInTheDocument();
    });

    it('uses link for items with href', () => {
      render(<Breadcrumb items={[{ label: 'Link', href: '/test' }]} />);
      const link = screen.getByText('Link');
      expect(link.closest('a')).toHaveAttribute('href', '/test');
    });
  });

  describe('PageHeader', () => {
    it('renders title', () => {
      render(<PageHeader title="Dashboard" />);
      expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders subtitle when provided', () => {
      render(<PageHeader title="Dashboard" subtitle="Resumen general" />);
      expect(screen.getByText('Resumen general')).toBeInTheDocument();
    });

    it('does not render subtitle when not provided', () => {
      const { container } = render(<PageHeader title="Dashboard" />);
      expect(container.querySelector('p')).not.toBeInTheDocument();
    });
  });

  describe('EmptySearchCTA', () => {
    it('renders heading and button', () => {
      render(
        <MemoryRouter>
          <EmptySearchCTA />
        </MemoryRouter>
      );
      expect(
        screen.getByText('¿No encontraste lo que buscas?')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Iniciar Reporte de Desabasto')
      ).toBeInTheDocument();
    });
  });

  describe('InformativeCard', () => {
    it('renders title and description', () => {
      render(
        <InformativeCard
          title="Transparencia"
          description="Acceso total a datos"
          icon={<Megaphone data-testid="test-icon" />}
        />
      );
      expect(screen.getByText('Transparencia')).toBeInTheDocument();
      expect(screen.getByText('Acceso total a datos')).toBeInTheDocument();
    });
  });

  describe('StatusBadge', () => {
    it('renders each variant', () => {
      const { rerender } = render(<StatusBadge variant="Disponible" />);
      expect(screen.getByText('Disponible')).toBeInTheDocument();

      rerender(<StatusBadge variant="Agotado" />);
      expect(screen.getByText('Agotado')).toBeInTheDocument();

      rerender(<StatusBadge variant="Limitado" />);
      expect(screen.getByText('Limitado')).toBeInTheDocument();
    });
  });
});
