import { render, screen } from '@testing-library/react';
import { Calendar } from './calendar';

describe('Calendar', () => {
  it('renders calendar container', () => {
    const { container } = render(<Calendar />);
    expect(
      container.querySelector('[data-slot="calendar"]')
    ).toBeInTheDocument();
  });

  it('displays month/year in header', () => {
    render(<Calendar />);
    const monthCaption = screen.getByRole('status');
    expect(monthCaption).toBeInTheDocument();
  });

  it('applies className prop', () => {
    const { container } = render(<Calendar className="my-custom-class" />);
    // className is applied to the DayPicker wrapper, not the data-slot="calendar" div directly
    expect(container.querySelector('.my-custom-class')).toBeInTheDocument();
  });
});
