import { render, screen } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldSet,
  FieldLegend,
  FieldContent,
} from './field';

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

jest.mock('@/components/ui/separator', () => ({
  Separator: ({
    children,
    ...props
  }: { children?: ReactNode; [key: string]: unknown }) => (
    <hr data-slot="separator" {...(props as React.ComponentProps<'hr'>)}>
      {children}
    </hr>
  ),
}));

jest.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: { children?: ReactNode; [key: string]: unknown }) => (
    <label data-slot="label" {...(props as React.ComponentProps<'label'>)}>
      {children}
    </label>
  ),
}));

describe('Field', () => {
  it('renders Field component as div with data-slot', () => {
    const { container } = render(<Field />);
    expect(
      container.querySelector('[data-slot="field"]')
    ).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Field>
        <span data-testid="child">content</span>
      </Field>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('renders FieldLabel with data-slot', () => {
    const { container } = render(<FieldLabel>Label</FieldLabel>);
    expect(
      container.querySelector('[data-slot="field-label"]')
    ).toBeInTheDocument();
  });

  it('renders FieldLabel text', () => {
    render(<FieldLabel>Test Label</FieldLabel>);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('renders FieldDescription with data-slot', () => {
    const { container } = render(
      <FieldDescription>Helper text</FieldDescription>
    );
    expect(
      container.querySelector('[data-slot="field-description"]')
    ).toBeInTheDocument();
  });

  it('renders FieldDescription text', () => {
    render(<FieldDescription>Helper text</FieldDescription>);
    expect(screen.getByText('Helper text')).toBeInTheDocument();
  });

  it('renders FieldError with data-slot', () => {
    const { container } = render(<FieldError>Error message</FieldError>);
    expect(
      container.querySelector('[data-slot="field-error"]')
    ).toBeInTheDocument();
  });

  it('renders FieldError text', () => {
    render(<FieldError>Error message</FieldError>);
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('renders FieldGroup', () => {
    const { container } = render(<FieldGroup />);
    expect(
      container.querySelector('[data-slot="field-group"]')
    ).toBeInTheDocument();
  });

  it('renders FieldSet with legend', () => {
    const { container } = render(
      <FieldSet>
        <FieldLegend>Legend text</FieldLegend>
      </FieldSet>
    );
    expect(
      container.querySelector('[data-slot="field-set"]')
    ).toBeInTheDocument();
    expect(screen.getByText('Legend text')).toBeInTheDocument();
  });

  it('renders FieldContent', () => {
    const { container } = render(<FieldContent />);
    expect(
      container.querySelector('[data-slot="field-content"]')
    ).toBeInTheDocument();
  });
});