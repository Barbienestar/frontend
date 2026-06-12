import { CheckCircle, Clock, Phone, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLoadScript } from '@react-google-maps/api';
import Config from '@/config';
import type { HospitalData } from '@/common/HospitalData';
import type { MedicineSearchResult } from '@/common/MedicineSearchResult';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import ReportCard from '@/components/Card/reportCard';
import { Footer } from '@/components/Global/footer';
import Navbar from '@/components/Global/navbar';
import { PageHeader } from '@/components/PageHeader/pageHeader';
import {
  RecentReportsTable,
  type ReportRow,
} from '@/components/RecentReportsTable/recentReportsTable';
import { SidebarInfoCard } from '@/components/SidebarInfoCard/sidebarInfoCard';
import { SidebarMapCard } from '@/components/SidebarMapCard/sidebarMapCard';
import {
  createReport,
  getHospitals,
  getMedicines,
  getMyReports,
  uploadImage,
} from '@/services/report/reportService';
import { statusConfig } from '@/utils/reportStatus';
import { toast } from 'sonner';
import { ConfirmModal } from '@/components/ConfirmModal/ConfirmModal';

const ReportarPage = () => {
  const navigate = useNavigate();
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: Config.GOOGLE_MAPS_API_KEY,
  });
  const [medicines, setMedicines] = useState<MedicineSearchResult[]>([]);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userReports, setUserReports] = useState<ReportRow[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicinesData, hospitalsData] = await Promise.all([
          getMedicines(),
          getHospitals(),
        ]);
        setMedicines(medicinesData);
        setHospitals(hospitalsData);
      } catch {
        setFetchError('Error al cargar datos. Intenta de nuevo.');
      }

      try {
        const reportsData = await getMyReports();
        setUserReports(
          reportsData.slice(0, 3).map((r) => {
            const cfg = statusConfig(r.status);
            return {
              folio: String(r.id),
              medicine: r.medicineName,
              hospital: r.hospitalName,
              status: cfg.label,
              statusColor: cfg.color,
            };
          })
        );
      } catch {
        // no bloquea el formulario si falla
      }
    };
    fetchData();
  }, []);

  const handleFileChange = async (file: File | null) => {
    if (!file) {
      setImageUrl(null);
      return;
    }

    setIsUploading(true);
    try {
      const data = await uploadImage(file);
      setImageUrl(data.imageUrl);
    } catch {
      alert('Error al subir la imagen. Intenta de nuevo.');
    } finally {
      setIsUploading(false);
    }
  };

  const medicineOptions = medicines.map((m) => ({
    value: String(m.id),
    label: `${m.genericName} ${m.strength ?? ''} — ${m.dosageForm}`.trim(),
  }));

  const hospitalOptions = hospitals.map((h) => ({
    value: String(h.id),
    label: h.name,
  }));

  const handleSubmit = async () => {
    if (!selectedMedicine || !selectedHospital || !description.trim()) {
      toast.warning('Por favor completa todos los campos.');
      return;
    }
    if (isUploading) {
      toast.warning('La imagen aún se está subiendo. Espera un momento.');
      return;
    }
    setIsLoading(true);
    try {
      await createReport({
        medicineId: Number(selectedMedicine),
        hospitalId: Number(selectedHospital),
        description,
        imageUrl: imageUrl ?? undefined,
      });
      toast.success('Reporte enviado correctamente.');
      setSelectedMedicine('');
      setSelectedHospital('');
      setDescription('');
      setImageUrl(null);
      setResetKey((k) => k + 1);
    } catch {
      toast.error('Error al enviar el reporte. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="default" activePath="/reportar" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/inicio' },
            { label: 'Reportar Desabasto' },
          ]}
        />

        <PageHeader
          title="Reportar Desabasto de Medicamento"
          subtitle="Su reporte ayuda a mejorar el suministro nacional de insumos médicos."
        />

        {fetchError && (
          <p className="text-red-500 text-sm mb-4">{fetchError}</p>
        )}

        {/* Banner ¿Por qué reportar? */}
        <div className="mt-6">
          <SidebarInfoCard
            icon={ShieldCheck}
            title="¿Por qué reportar?"
            description="Los reportes ciudadanos permiten a la Secretaría de Salud identificar zonas críticas y redistribuir el inventario nacional de manera eficiente."
            features={[
              { icon: ShieldCheck, text: 'Anónimo y Seguro' },
              { icon: Clock, text: 'Seguimiento en Tiempo Real' },
              { icon: CheckCircle, text: 'Validez Oficial' },
            ]}
            horizontal
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-15 items-stretch mt-6">
          {/* Columna izquierda — formulario + teléfono */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <ReportCard
              key={resetKey}
              medicineOptions={medicineOptions}
              hospitalOptions={hospitalOptions}
              selectedMedicine={selectedMedicine}
              selectedHospital={selectedHospital}
              description={description}
              onMedicineChange={setSelectedMedicine}
              onHospitalChange={setSelectedHospital}
              onDescriptionChange={setDescription}
              onFileChange={handleFileChange}
              onCancel={() => setShowCancelModal(true)}
              onSubmit={() => setShowConfirmModal(true)}
              isLoading={isLoading}
              isUploading={isUploading}
              imageUrl={imageUrl}
            />

            {/* Logical execution gates to dynamically mount/unmount the component */}
            {showConfirmModal && (
              <ConfirmModal
                isOpen={showConfirmModal}
                message="¿Está seguro que desea enviar este reporte?"
                confirmLabel="Sí, enviar"
                cancelLabel="Cancelar"
                onConfirm={() => {
                  setShowConfirmModal(false);
                  handleSubmit();
                }}
                onCancel={() => setShowConfirmModal(false)}
              />
            )}

            {showCancelModal && (
              <ConfirmModal
                isOpen={showCancelModal}
                message="¿Está seguro que desea cancelar el reporte?"
                confirmLabel="Sí, cancelar"
                cancelLabel="No, volver"
                onConfirm={() => {
                  setShowCancelModal(false);
                  navigate('/inicio');
                }}
                onCancel={() => setShowCancelModal(false)}
              />
            )}

            <div className="rounded-xl bg-[#1a2235] text-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-2">
                Atención Ciudadana
              </p>
              <div className="flex items-center gap-2 mb-1">
                <Phone className="size-4 text-green-400" />
                <span className="font-bold text-lg">800-SALUD-MX</span>
              </div>
              <p className="text-xs text-gray-400">
                Disponible las 24 horas, los 365 días del año.
              </p>
            </div>
          </div>

          {/* Sidebar derecho — mapa + reportes */}
          <div className="lg:col-span-2 flex flex-col gap-4 h-full">
            <SidebarMapCard
              selectedHospitalName={
                hospitals.find((h) => String(h.id) === selectedHospital)?.name
              }
              isLoaded={isLoaded}
              onViewFullMap={() => navigate('/mapa-de-abasto')}
            />

            <RecentReportsTable
              reports={userReports}
              onViewAll={() => navigate('/mis-reportes')}
            />
          </div>
        </div>
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default ReportarPage;
