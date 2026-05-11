import { Phone, Mail, MapPin } from 'lucide-react';
import logo from '../../assets/Logo.svg';

type FooterVariant = 'full' | 'minimal';

interface FooterProps {
  variant?: FooterVariant;
}

export function Footer({ variant = 'full' }: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className="bg-white border-t border-blue-200 w-full">
        <div className="max-w-5xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span>© 2026 Sistema Nacional de Salud · Gobierno de México</span>
            <span className="hidden sm:inline text-gray-300">·</span>
            <a href="#" className="hover:text-blue-600 transition-colors">
              Aviso de Privacidad
            </a>
          </div>

          <div className="flex items-center gap-2 font-bold text-sm tracking-widest text-gray-700 uppercase">
            MÉXICO
            <span className="flex gap-[2px]">
              <span className="w-2 h-3 bg-primary rounded-sm" />
              <span className="w-2 h-3 bg-secondary border-gray-200 rounded-sm" />
              <span className="w-2 h-3 bg-accent-secondary rounded-sm" />
            </span>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-[#1a2235] text-white w-full">
      <div className="h-1 bg-blue-500 w-full" />

      <div className="max-w-5xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
              src={logo}
              alt="Logo"
              className="brightness-0 invert w-8 h-8"
            />
            <span className="font-bold text-lg tracking-wide uppercase">
              Decision 360
            </span>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed max-w-xs">
            Plataforma oficial del Gobierno de México para la transparencia y
            monitoreo de insumos médicos en el sistema nacional de salud.
          </p>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-widest uppercase text-accent-secondary">
            Contacto
          </h3>
          <ul className="space-y-3 text-sm text-gray-300">
            <li className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400 shrink-0" />
              800 123 4567
            </li>
            <li className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400 shrink-0" />
              contacto@salud.gob.mx
            </li>
            <li className="flex items-center gap-2">
              <MapPin size={14} className="text-gray-400 shrink-0" />
              CDMX, México
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10" />

      <div className="max-w-5xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-500">
        <span>© 2026 Secretaría de Salud · Algunos derechos reservados</span>
        <nav className="flex items-center gap-6">
          <a href="#" className="hover:text-white transition-colors">
            Privacidad
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Términos y Condiciones
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Accesibilidad
          </a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
