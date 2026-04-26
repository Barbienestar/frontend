import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, ShieldCheck, Clock, CheckCircle } from 'lucide-react';
import Navbar from '@/components/global/navbar';
import { Footer } from '@/components/global/footer';
import ReportCard from '@/components/Card/reportCard';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import { PageHeader } from '@/components/PageHeader/pageHeader';
import { SidebarInfoCard } from '@/components/SidebarInfoCard/sidebarInfoCard';
import { SidebarMapCard } from '@/components/SidebarMapCard/sidebarMapCard';
import {
  RecentReportsTable,
  type ReportRow,
} from '@/components/RecentReportsTable/recentReportsTable';
import {
  getMedicines,
  getHospitals,
  createReport,
  uploadImage,
} from '@/services/reportService';
import type { MedicineData } from '@/common/MedicineData';
import type { HospitalData } from '@/common/HospitalData';

const ReportarPage = () => {
  const navigate = useNavigate();
  const [medicines, setMedicines] = useState<MedicineData[]>([]);
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [selectedMedicine, setSelectedMedicine] = useState('');
  const [selectedHospital, setSelectedHospital] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [userReports] = useState<ReportRow[]>([]);

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
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (!file) return;
    const upload = async () => {
      setIsUploading(true);
      try {
        const data = await uploadImage(file);
        setImageUrl(data.imageUrl);
      } catch {
        setFile(null);
        alert('Error al subir la imagen. Intenta de nuevo.');
      } finally {
        setIsUploading(false);
      }
    };
    upload();
  }, [file]);

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
      alert('Por favor completa todos los campos.');
      return;
    }
    if (file && !imageUrl) {
      alert('La imagen aún se está subiendo. Espera un momento.');
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
      navigate('/inicio');
    } catch {
      alert('Error al enviar el reporte. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="default" activePath="/reportar" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna izquierda */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <ReportCard
              medicineOptions={medicineOptions}
              hospitalOptions={hospitalOptions}
              selectedMedicine={selectedMedicine}
              selectedHospital={selectedHospital}
              description={description}
              onMedicineChange={setSelectedMedicine}
              onHospitalChange={setSelectedHospital}
              onDescriptionChange={setDescription}
              onFileChange={setFile}
              onCancel={() => navigate('/inicio')}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              isUploading={isUploading}
            />

            <RecentReportsTable
              reports={userReports}
              onViewAll={() => navigate('/mis-reportes')}
            />
          </div>

          {/* Sidebar derecho */}
          <div className="flex flex-col gap-4">
            <SidebarInfoCard
              icon={ShieldCheck}
              title="¿Por qué reportar?"
              description="Los reportes ciudadanos permiten a la Secretaría de Salud identificar zonas críticas y redistribuir el inventario nacional de manera eficiente."
              features={[
                { icon: ShieldCheck, text: 'Anónimo y Seguro' },
                { icon: Clock, text: 'Seguimiento en Tiempo Real' },
                { icon: CheckCircle, text: 'Validez Oficial' },
              ]}
            />

            <SidebarMapCard onViewFullMap={() => navigate('/mapa-de-abasto')} />

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
        </div>
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default ReportarPage;
