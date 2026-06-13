import { render, screen } from '@testing-library/react';
import { SidebarInfoCard } from './sidebarInfoCard';
import { AlertCircle, CheckCircle } from 'lucide-react';

jest.mock('lucide-react', () => ({
  AlertCircle: () => <svg data-testid="alert-icon" />,
  CheckCircle: () => <svg data-testid="check-icon" />,
}));

const defaultFeatures = [
  { icon: AlertCircle, text: 'Feature one' },
  { icon: CheckCircle, text: 'Feature two' },
];

const defaultProps = {
  icon: AlertCircle,
  title: 'Test Title',
  description: 'Test Description',
  features: defaultFeatures,
};

describe('SidebarInfoCard', () => {
  it('renders title and description', () => {
    render(<SidebarInfoCard {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('renders feature texts', () => {
    render(<SidebarInfoCard {...defaultProps} />);
    expect(screen.getByText('Feature one')).toBeInTheDocument();
    expect(screen.getByText('Feature two')).toBeInTheDocument();
  });

  it('horizontal=false renders stacked (default) layout', () => {
    const { container } = render(<SidebarInfoCard {...defaultProps} />);
    const ul = container.querySelector('ul');
    expect(ul).toHaveClass('space-y-2');
  });

  it('horizontal=true renders row layout', () => {
    const { container } = render(
      <SidebarInfoCard {...defaultProps} horizontal={true} />
    );
    const ul = container.querySelector('ul');
    expect(ul).toHaveClass('flex', 'flex-wrap');
  });

  it('empty features renders empty ul', () => {
    const { container } = render(
      <SidebarInfoCard {...defaultProps} features={[]} />
    );
    const ul = container.querySelector('ul');
    expect(ul).toBeInTheDocument();
    expect(ul?.children).toHaveLength(0);
  });
});