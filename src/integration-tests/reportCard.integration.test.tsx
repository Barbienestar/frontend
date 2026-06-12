// --- Mocks de módulos externos ---
jest.mock('@/services/api', () => ({
  __esModule: true,
  default: { get: jest.fn(), post: jest.fn(), put: jest.fn() },
}));

import { useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReportCard from '@/components/Card/reportCard';
import { createReport } from '@/services/report/reportService';
import type { ReportData } from '@/common/ReportData ';
import api from '@/services/api';

const mockedApi = api as jest.Mocked<typeof api>;

const fakeReport: ReportData = {
  id: 42,
  medicineName: 'Paracetamol',
  hospitalName: 'Hospital General',
  status: 'reviewing',
  description: 'No hay existencias desde hace 2 semanas',
  imageUrl: 'https://cdn.example.com/receta.png',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
};

const MEDICINE_OPTIONS = [{ value: '1', label: 'Paracetamol' }];
const HOSPITAL_OPTIONS = [{ value: '2', label: 'Hospital General' }];

/**
 * Wrapper realista que gestiona el estado del formulario y llama
 * a createReport en el submit, igual que haría ReportarPage.
 */
const ReportCardConServicio = ({
  preloadImageUrl = null,
}: {
  preloadImageUrl?: string | null;
}) => {
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl] = useState<string | null>(preloadImageUrl);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      await createReport({
        medicineId: Number(selectedMedicine),
        hospitalId: Number(selectedHospital),
        description,
        imageUrl: imageUrl ?? undefined,
      });
      setStatus('success');
    } catch {
      setStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <ReportCard
        medicineOptions={MEDICINE_OPTIONS}
        hospitalOptions={HOSPITAL_OPTIONS}
        selectedMedicine={selectedMedicine}
        selectedHospital={selectedHospital}
        description={description}
        onMedicineChange={setSelectedMedicine}
        onHospitalChange={setSelectedHospital}
        onDescriptionChange={setDescription}
        onFileChange={() => {}}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        imageUrl={imageUrl}
      />
      {status === 'success' && (
        <p data-testid="form-status-success">Reporte enviado correctamente</p>
      )}
      {status === 'error' && (
        <p data-testid="form-status-error">Error al enviar el reporte</p>
      )}
    </>
  );
};

describe('Flujo de creación de reporte — integración (HU-05)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('el botón "Enviar Reporte" está deshabilitado si falta algún campo', () => {
    render(<ReportCardConServicio />);
    expect(screen.getByTestId('report-submit-button')).toBeDisabled();
  });

  it('submitting con todos los campos llama a api.post con el payload correcto', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: fakeReport });

    render(
      <ReportCardConServicio preloadImageUrl="https://cdn.example.com/receta.png" />
    );

    // Seleccionar medicamento: foco → dropdown → click opción
    await user.click(screen.getByTestId('report-search-medicine-input'));
    await user.click(screen.getByTestId('report-select-medicine-option-1'));

    // Seleccionar hospital
    await user.click(screen.getByTestId('report-search-hospital-input'));
    await user.click(screen.getByTestId('report-select-hospital-option-2'));

    // Escribir descripción
    await user.type(
      screen.getByTestId('report-description-input'),
      'No hay existencias desde hace 2 semanas'
    );

    // El botón debe habilitarse cuando todos los campos están completos
    await waitFor(() =>
      expect(screen.getByTestId('report-submit-button')).not.toBeDisabled()
    );

    await user.click(screen.getByTestId('report-submit-button'));

    await waitFor(() => {
      expect(mockedApi.post).toHaveBeenCalledWith('/reports', {
        medicineId: 1,
        hospitalId: 2,
        description: 'No hay existencias desde hace 2 semanas',
        imageUrl: 'https://cdn.example.com/receta.png',
      });
    });
  });

  it('tras submit exitoso muestra mensaje de éxito en la UI', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockResolvedValueOnce({ data: fakeReport });

    render(
      <ReportCardConServicio preloadImageUrl="https://cdn.example.com/receta.png" />
    );

    await user.click(screen.getByTestId('report-search-medicine-input'));
    await user.click(screen.getByTestId('report-select-medicine-option-1'));
    await user.click(screen.getByTestId('report-search-hospital-input'));
    await user.click(screen.getByTestId('report-select-hospital-option-2'));
    await user.type(
      screen.getByTestId('report-description-input'),
      'Descripción del problema'
    );

    await waitFor(() =>
      expect(screen.getByTestId('report-submit-button')).not.toBeDisabled()
    );
    await user.click(screen.getByTestId('report-submit-button'));

    await waitFor(() =>
      expect(screen.getByTestId('form-status-success')).toBeInTheDocument()
    );
  });

  it('cuando api.post falla muestra mensaje de error en la UI', async () => {
    const user = userEvent.setup();
    mockedApi.post.mockRejectedValueOnce(new Error('Server error'));

    render(
      <ReportCardConServicio preloadImageUrl="https://cdn.example.com/receta.png" />
    );

    await user.click(screen.getByTestId('report-search-medicine-input'));
    await user.click(screen.getByTestId('report-select-medicine-option-1'));
    await user.click(screen.getByTestId('report-search-hospital-input'));
    await user.click(screen.getByTestId('report-select-hospital-option-2'));
    await user.type(
      screen.getByTestId('report-description-input'),
      'Descripción del problema'
    );

    await waitFor(() =>
      expect(screen.getByTestId('report-submit-button')).not.toBeDisabled()
    );
    await user.click(screen.getByTestId('report-submit-button'));

    await waitFor(() =>
      expect(screen.getByTestId('form-status-error')).toBeInTheDocument()
    );
  });
});
