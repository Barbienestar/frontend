import { render } from '@testing-library/react';
import type { ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverAnchor,
} from './popover';

jest.mock('@/lib/utils', () => ({
  cn: (...args: unknown[]) => args.filter(Boolean).join(' '),
}));

jest.mock('radix-ui', () => {
  const Passthrough = ({
    children,
    ...props
  }: { children?: ReactNode; [key: string]: unknown }) => (
    <div {...(props as Record<string, unknown>)}>{children}</div>
  );

  return {
    Popover: {
      Root: Passthrough,
      Trigger: Passthrough,
      Content: Passthrough,
      Anchor: Passthrough,
      Portal: ({ children }: { children?: ReactNode }) => <>{children}</>,
    },
  };
});

describe('Popover', () => {
  it('renders Popover', () => {
    const { container } = render(<Popover />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders PopoverTrigger', () => {
    const { container } = render(<PopoverTrigger />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders PopoverContent', () => {
    const { container } = render(<PopoverContent />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders PopoverAnchor', () => {
    const { container } = render(<PopoverAnchor />);
    expect(container.firstChild).toBeInTheDocument();
  });
});