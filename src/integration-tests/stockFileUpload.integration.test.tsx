// --- Mocks de módulos externos ---
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));
jest.mock('sonner', () => ({
  __esModule: true,
  toast: { success: jest.fn(), error: jest.fn() },
}));

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import StockFileUpload from '@/components/StockFileUpload/StockFileUpload';
import api from '@/services/api';
import { toast } from 'sonner';

const mockedApi = api as jest.Mocked<typeof api>;
const mockedToast = toast as jest.Mocked<typeof toast>;

describe('Carga de inventario — integración (HU-15)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sin hospitalId muestra el aviso de hospital requerido', () => {
    render(<StockFileUpload />);
    expect(
      screen.getByText('No hay hospital seleccionado')
    ).toBeInTheDocument();
  });

  it('con hospitalId y archivo llama a api.post con FormData y ruta correcta', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: {} });

    render(<StockFileUpload hospitalId={5} hospitalName="IMSS Zona Norte" />);

    // Seleccionar archivo CSV
    const csvFile = new File(
      ['medicamento,cantidad\nParacetamol,100'],
      'inventario.csv',
      { type: 'text/csv' }
    );
    const fileInput = screen.getByTestId('stock-upload-file-input');
    await user.upload(fileInput, csvFile);

    // Clic en "Subir archivo"
    const uploadBtn = screen.getByTestId('stock-upload-button');
    await waitFor(() => expect(uploadBtn).not.toBeDisabled());
    await user.click(uploadBtn);

    // Confirmar en el modal
    await waitFor(() =>
      expect(screen.getByTestId('confirmation-modal')).toHaveAttribute('open')
    );
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    // Verificar llamada a API
    await waitFor(() => {
      const [url, body] = mockedApi.post.mock.calls[0];
      expect(url).toBe('/medicines/upload-stock/5');
      expect(body).toBeInstanceOf(FormData);
    });
  });

  it('tras subida exitosa muestra toast de éxito', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: {} });

    render(<StockFileUpload hospitalId={5} hospitalName="IMSS Zona Norte" />);

    const csvFile = new File(['medicamento,cantidad'], 'inventario.csv', {
      type: 'text/csv',
    });
    await user.upload(screen.getByTestId('stock-upload-file-input'), csvFile);

    await waitFor(() =>
      expect(screen.getByTestId('stock-upload-button')).not.toBeDisabled()
    );
    await user.click(screen.getByTestId('stock-upload-button'));

    await waitFor(() =>
      expect(screen.getByTestId('confirmation-modal')).toHaveAttribute('open')
    );
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() =>
      expect(mockedToast.success).toHaveBeenCalledWith(
        'Archivo subido con éxito'
      )
    );
  });

  it('cuando api.post falla muestra toast de error', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockRejectedValueOnce(new Error('Upload error'));

    render(<StockFileUpload hospitalId={5} hospitalName="IMSS Zona Norte" />);

    const csvFile = new File(['datos'], 'inventario.csv', {
      type: 'text/csv',
    });
    await user.upload(screen.getByTestId('stock-upload-file-input'), csvFile);

    await waitFor(() =>
      expect(screen.getByTestId('stock-upload-button')).not.toBeDisabled()
    );
    await user.click(screen.getByTestId('stock-upload-button'));

    await waitFor(() =>
      expect(screen.getByTestId('confirmation-modal')).toHaveAttribute('open')
    );
    await user.click(screen.getByTestId('confirmation-modal-confirm-button'));

    await waitFor(() => expect(mockedToast.error).toHaveBeenCalled());
  });
});
