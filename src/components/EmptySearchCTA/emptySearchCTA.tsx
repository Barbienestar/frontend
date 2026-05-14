import { Megaphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/Button/button';

export const EmptySearchCTA = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-8 w-full rounded-2xl border border-border bg-card px-6 py-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-4">

          {/* ICON */}
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#7A1732] text-white shrink-0">
            <Megaphone className="h-5 w-5" />
          </div>

          {/* TEXT */}
          <div>
            <h3 className="text-lg font-bold text-[#7A1732]">
              ¿No encontraste lo que buscas?
            </h3>

            <p className="text-sm text-muted-foreground">
              Tu reporte ayuda a las autoridades a agilizar el
              reabastecimiento en tu zona.
            </p>
          </div>
        </div>

        {/* BUTTON */}
        <Button
          onClick={() => navigate('/reportar')}
          className="bg-[#7A1732] hover:bg-[#651228] text-white px-6"
        >
          Iniciar Reporte de Desabasto
        </Button>
      </div>
    </div>
  );
};