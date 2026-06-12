/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ForbiddenPage from '@/pages/forbidden';

describe('ForbiddenPage', () => {
  it('renders 403 message', () => {
    render(
      <MemoryRouter>
        <ForbiddenPage />
      </MemoryRouter>
    );
    expect(screen.getByText('403 - Forbidden')).toBeInTheDocument();
  });
});
