/**
 * @jest-environment jsdom
 */

// HTMLDialogElement polyfill for jsdom
if (typeof HTMLDialogElement !== 'undefined') {
  HTMLDialogElement.prototype.showModal = function (this: HTMLDialogElement) {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function (this: HTMLDialogElement) {
    this.removeAttribute('open');
  };
}

import { render, screen, fireEvent } from '@testing-library/react';
import { ConfirmModal } from './ConfirmModal';

describe('ConfirmModal', () => {
  const defaultProps = {
    isOpen: true,
    message: '¿Confirmar acción?',
    onConfirm: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders message when open', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByText('¿Confirmar acción?')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('confirmation-modal-confirm-button'));
    expect(defaultProps.onConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel when cancel button clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByText('Cancelar'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('uses custom button labels', () => {
    render(
      <ConfirmModal
        {...defaultProps}
        confirmLabel="Sí, eliminar"
        cancelLabel="No, volver"
      />
    );
    expect(screen.getByText('Sí, eliminar')).toBeInTheDocument();
    expect(screen.getByText('No, volver')).toBeInTheDocument();
  });

  it('renders dialog element with testid', () => {
    render(<ConfirmModal {...defaultProps} />);
    expect(screen.getByTestId('confirmation-modal')).toBeInTheDocument();
  });
});
