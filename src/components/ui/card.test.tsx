import { render, screen } from '@testing-library/react';
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from './card';

describe('Card', () => {
  it('renders with data-slot="card"', () => {
    const { container } = render(<Card>content</Card>);
    expect(container.querySelector('[data-slot="card"]')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <Card>
        <span>hello</span>
      </Card>
    );
    expect(screen.getByText('hello')).toBeInTheDocument();
  });

  it('size="sm" applies data-size="sm"', () => {
    const { container } = render(<Card size="sm">small</Card>);
    expect(container.querySelector('[data-size="sm"]')).toBeInTheDocument();
  });
});

describe('CardHeader', () => {
  it('renders with data-slot', () => {
    const { container } = render(<CardHeader />);
    expect(
      container.querySelector('[data-slot="card-header"]')
    ).toBeInTheDocument();
  });
});

describe('CardTitle', () => {
  it('renders text', () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('CardDescription', () => {
  it('renders text', () => {
    render(<CardDescription>desc</CardDescription>);
    expect(screen.getByText('desc')).toBeInTheDocument();
  });
});

describe('CardContent', () => {
  it('renders children', () => {
    render(
      <CardContent>
        <span>content</span>
      </CardContent>
    );
    expect(screen.getByText('content')).toBeInTheDocument();
  });
});

describe('CardFooter', () => {
  it('renders', () => {
    const { container } = render(<CardFooter />);
    expect(
      container.querySelector('[data-slot="card-footer"]')
    ).toBeInTheDocument();
  });
});

describe('CardAction', () => {
  it('renders', () => {
    const { container } = render(<CardAction />);
    expect(
      container.querySelector('[data-slot="card-action"]')
    ).toBeInTheDocument();
  });
});
