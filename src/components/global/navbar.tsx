import React, { useState } from 'react';
import perfilPhoto from '../../assets/perfil.png';
import logo from '../../assets/Logo.svg';

type NavbarVariant = 'admin' | 'gobierno' | 'default';

const linksDefault = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Reportar', path: '/reportar' },
  { label: 'Mapa de Abasto', path: '/mapa-de-abasto' },
];

interface NavbarProps {
  variant?: NavbarVariant;
  activePath?: string;
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default', activePath }) => {
  const [isOpen, setIsOpen] = useState(false);

  const config = {
    admin: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-secondary font-bold',
      title: 'Panel de Control Admin',
      subtitle: 'DECISION 360',
      links: [],
      buttonLabel: 'Perfil Admin',
    },
    gobierno: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-secondary font-bold',
      title: 'Panel de Control Gubernamental',
      subtitle: 'DECISION 360',
      links: [],
      buttonLabel: 'Perfil Gobierno',
    },
    default: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-accent-secondary font-bold',
      title: 'DECISION 360',
      subtitle: 'Consulta de medicamentos',
      links: linksDefault,
      buttonLabel: '',
    },
  };

  const current = config[variant];
  const isDark = variant === 'admin' || variant === 'gobierno';

  return (
    <nav className={`${current.bg} px-6 py-3 shadow-md`}>
      <div className="flex items-center justify-between">

        {/* LOGO + TITULO */}
        <div className="flex items-center gap-3">
          <div className={isDark ? 'bg-secondary' : ''}>
            <img
              src={logo}
              alt="Logo"
              className={`w-10 h-10 ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </div>

          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-black">
              {current.title}
            </h1>
            <p className={current.subtext}>{current.subtitle}</p>
          </div>
        </div>

        {/* LINKS DESKTOP */}
        {current.links.length > 0 && (
          <div className="hidden md:flex gap-7">
            {current.links.map(({ label, path }) => {
              const isActive = activePath === path;
              return (
                <a
                  key={label}
                  href={path}
                  className={`text-m whitespace-nowrap pb-0.5 transition-colors
                    ${
                      isActive
                        ? 'font-semibold text-black border-b-2 border-black'
                        : 'text-gray-500 hover:text-black'
                    }`}
                >
                  {label}
                </a>
              );
            })}
          </div>
        )}

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-3">

          {/* BOTÓN PERFIL DEFAULT */}
          {variant === 'default' && (
            <button className="p-1 rounded-full hover:bg-gray-100">
              <img
                src={perfilPhoto}
                alt="Perfil"
                className="w-8 h-8 rounded-full"
              />
            </button>
          )}

          {/* BOTÓN ADMIN/GOB */}
          {(variant === 'admin' || variant === 'gobierno') && (
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm font-medium">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
              {current.buttonLabel}
            </button>
          )}

          {/* HAMBURGER */}
          {current.links.length > 0 && (
            <button
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                {isOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* MENU MOBILE */}
      {isOpen && current.links.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          {current.links.map(({ label, path }) => {
            const isActive = activePath === path;
            return (
              <a
                key={label}
                href={path}
                className={`text-base ${
                  isActive
                    ? 'font-semibold text-black'
                    : 'text-gray-500'
                }`}
              >
                {label}
              </a>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;