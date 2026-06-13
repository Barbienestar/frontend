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

  it('calls onCancel when backdrop clicked', () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByTestId('confirmation-modal');
    fireEvent.click(dialog);
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('calls onCancel on Escape key', () => {
    render(<ConfirmModal {...defaultProps} />);
    fireEvent.keyDown(screen.getByTestId('confirmation-modal'), {
      key: 'Escape',
    });
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });

  it('does not render when isOpen is false', () => {
    render(<ConfirmModal {...defaultProps} isOpen={false} />);
    const dialog = screen.getByTestId('confirmation-modal');
    expect(dialog).toBeInTheDocument();
    expect(dialog).not.toHaveAttribute('open');
  });

  it('calls onCancel on dialog close event', () => {
    render(<ConfirmModal {...defaultProps} />);
    const dialog = screen.getByTestId('confirmation-modal');
    fireEvent(dialog, new Event('close'));
    expect(defaultProps.onCancel).toHaveBeenCalledTimes(1);
  });
});
