import { render } from '@testing-library/react';
import { Separator } from './separator';

describe('Separator', () => {
  it('renders with data-slot="separator"', () => {
    const { container } = render(<Separator />);
    expect(
      container.querySelector('[data-slot="separator"]')
    ).toBeInTheDocument();
  });

  it('renders with horizontal orientation by default', () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    );
  });

  it('applies className', () => {
    const { container } = render(<Separator className="my-4" />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveClass(
      'my-4'
    );
  });

  it('accepts decorative prop', () => {
    const { container } = render(<Separator decorative={false} />);
    expect(
      container.querySelector('[data-slot="separator"]')
    ).toBeInTheDocument();
  });
});
