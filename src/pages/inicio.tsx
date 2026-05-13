import { useNavigate } from 'react-router-dom';
import { Map, ShieldCheck, BarChart2, Users } from 'lucide-react';
import Navbar from '@/components/Global/navbar';
import { Footer } from '@/components/Global/footer';
import { Button } from '@/components/Button/button';
import { InformativeCard } from '@/components/InformativeCards/informative-card';
import hospitalImage from '@/assets/hospitalAsset.jpg';

const Inicio = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar variant="default" activePath="/inicio" />

      {/* Hero */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden">
        {/* Background image con overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={hospitalImage}
            alt="Hospital"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#0f1f2e]/75" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 py-20">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight max-w-xl mb-4">
            Información sobre el abasto de medicamentos en México
          </h1>
          <p className="text-white/80 text-base max-w-md mb-8 leading-relaxed">
            Consulta la disponibilidad y reporta el desabasto de forma
            institucional, transparente y directa. Trabajamos para garantizar
            el derecho a la salud de todos los mexicanos.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => navigate('/mapa-de-abasto')}
              className="bg-[#b8860b] hover:bg-[#9a7009] text-white border-0 gap-2"
              size="lg"
            >
              <Map className="size-4" />
              Ver Mapa de Abasto
            </Button>
            <Button
              onClick={() => navigate('/access')}
              variant="outline"
              size="lg"
              className="text-white border-white/60 bg-transparent hover:bg-white/10"
            >
              Iniciar sesión
            </Button>
          </div>
        </div>
      </section>

      {/* Sobre Nosotros */}
      <section className="bg-[#f5f4f0] py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase text-[#b8860b] border border-[#b8860b]/40 rounded-full px-3 py-1">
            Institucional
          </span>

          <h2 className="text-3xl font-bold text-foreground mt-4 mb-3">
            Sobre Nosotros
          </h2>
          <p className="text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Somos una plataforma dedicada a la transparencia en la distribución
            de insumos médicos. Nuestra misión es fortalecer la cadena de
            suministro mediante la participación ciudadana y el monitoreo
            digital.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InformativeCard
              icon={<ShieldCheck className="size-6" />}
              title="Transparencia"
              description="Acceso total a datos de inventario nacional."
            />
            <InformativeCard
              icon={<BarChart2 className="size-6" />}
              title="Eficiencia"
              description="Optimización de reportes en tiempo real."
            />
            <InformativeCard
              icon={<Users className="size-6" />}
              title="Compromiso"
              description="Servicio dedicado al bienestar del pueblo."
            />
          </div>
        </div>
      </section>

      {/* Nuestro Propósito */}
      <section className="bg-white py-20 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Nuestro Propósito
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Garantizar que cada ciudadano mexicano tenga acceso oportuno a la
            información y disponibilidad de su tratamiento médico a través de
            herramientas tecnológicas avanzadas.
          </p>
        </div>
      </section>

      <Footer variant="full" />
    </div>
  );
};

export default Inicio;