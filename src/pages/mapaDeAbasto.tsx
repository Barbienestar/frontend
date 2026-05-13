import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { Breadcrumb } from '@/components/Breadcrumb/breadcrumb';
import { PageHeader } from '@/components/PageHeader/pageHeader';
import { Button } from '@/components/Button/button';
import HospitalStockCard from '@/components/HospitalStockCard/hospitalStockCard';
import MedicineAutocomplete from '@/components/MedicineAutocomplete/medicineAutocomplete';
import { Map, type MedicinePoint } from '@/components/Map/map';
import { getStockByMedicine } from '@/services/stockService';
import type { StockData } from '@/common/StockData';
import { EmptySearchCTA } from '@/components/EmptySearchCTA/emptySearchCTA';

const CDMX_CENTER: [number, number] = [19.4326, -99.1332];
type FilterStatus = 'Todos' | 'Disponible' | 'Limitado' | 'Agotado';
const filterOptions: FilterStatus[] = [
  'Todos',
  'Disponible',
  'Limitado',
  'Agotado',
];

const MapaDeAbasto = () => {
  const [submittedQuery, setSubmittedQuery] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [results, setResults] = useState<StockData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterStatus>('Todos');
  const [filterOpen, setFilterOpen] = useState(false);

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsLoading(true);
    setError(null);
    setSearched(true);
    setSelectedId(null);
    setFilter('Todos');
    setSubmittedQuery(query.trim());
    try {
      setResults([]);
      const data = await getStockByMedicine(query.trim());
      setResults(data);
    } catch {
      setError('Error al buscar medicamento. Intenta de nuevo.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const normalize = (value: string) => value.trim().toLowerCase();

  const filtered =
    filter === 'Todos'
      ? results
      : results.filter((r) => normalize(r.status) === normalize(filter));

  const mapPoints: MedicinePoint[] = [
    { lat: CDMX_CENTER[0], lng: CDMX_CENTER[1] },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="default" activePath="/mapa-de-abasto" />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 pt-24 pb-8">
        <Breadcrumb
          items={[
            { label: 'Inicio', href: '/inicio' },
            { label: 'Mapa de Abasto' },
          ]}
        />

        <PageHeader
          title="Portal del Paciente"
          subtitle="Busca la disponibilidad de tus medicamentos en las unidades de salud del país."
        />

        {/* Search con autocomplete */}
        <div className="flex gap-2 mb-6">
          <MedicineAutocomplete
            value={searchValue}
            onChange={setSearchValue}
            onSelect={(label) => {
              setSearchValue(label);
              handleSearch(label);
            }}
            onSearch={(query) => handleSearch(query)}
            isLoading={isLoading}
          />
          <Button
            onClick={() => handleSearch(searchValue)}
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? 'Buscando...' : 'Buscar'}
          </Button>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {/* Layout: lista izquierda, mapa derecha */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Lista */}
          <div className="flex flex-col gap-3 w-full lg:w-[380px] lg:shrink-0">
            {results.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">
                  Resultados Cercanos
                </p>
                <div className="relative">
                  <button
                    onClick={() => setFilterOpen((v) => !v)}
                    className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <SlidersHorizontal className="size-3" />
                    {filter === 'Todos' ? 'Filtrar' : filter}
                  </button>
                  {filterOpen && (
                    <div className="absolute right-0 top-6 z-20 flex flex-col bg-card border border-border rounded-lg shadow-md py-1 min-w-[130px]">
                      {filterOptions.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => {
                            setFilter(opt);
                            setFilterOpen(false);
                          }}
                          className={`text-left px-3 py-1.5 text-xs hover:bg-muted transition-colors
                            ${filter === opt ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {searched && !isLoading && results.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No se encontraron hospitales con ese medicamento.
              </p>
            )}

            <div className="flex flex-col gap-3 lg:max-h-[520px] overflow-y-auto pr-1">
              {filtered.map((item, index) => (
                <HospitalStockCard
                  key={`${item.hospitalId}-${index}`}
                  data={item}
                  medicineName={submittedQuery}
                  selected={selectedId === item.hospitalId}
                  onClick={() => setSelectedId(item.hospitalId)}
                />
              ))}
              {searched &&
                !isLoading &&
                filtered.length === 0 &&
                results.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    No hay resultados con el filtro "{filter}".
                  </p>
                )}
            </div>
          </div>

          {/* Mapa */}
          <div className="flex-1 min-h-[400px]">
            <Map
              variant="normal"
              points={mapPoints}
              center={CDMX_CENTER}
              zoom={11}
              height="520px"
            />
          </div>
        </div>

        <EmptySearchCTA />
      </main>

      <Footer variant="full" />
    </div>
  );
};

export default MapaDeAbasto;
