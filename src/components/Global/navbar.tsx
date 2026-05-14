import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import perfilPhoto from '../../assets/perfil.png';
import logo from '../../assets/Logo.svg';
import { useAuth } from '@/contexts/useAuth';
import { Button } from '@/components/Button/button';

type NavbarVariant = 'admin' | 'gobierno' | 'default';

const linksDefault = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Reportar', path: '/reportar' },
  { label: 'Mapa de Abasto', path: '/mapa-de-abasto' },
];

const linksAdmin = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Mapa de Abasto', path: '/mapa-de-abasto' },
  { label: 'Dashboard', path: '/admin' },
];

const linksGobierno = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Mapa de Abasto', path: '/mapa-de-abasto' },
  { label: 'Dashboard', path: '/dashboard' },
];

interface NavbarProps {
  variant?: NavbarVariant;
  activePath?: string;
}

const Navbar: React.FC<NavbarProps> = ({ variant = 'default', activePath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated, hasRole, signOut } = useAuth();

  const resolveLinks = () => {
    if (isAuthenticated && hasRole('admin')) return linksAdmin;
    if (isAuthenticated && hasRole('health')) return linksGobierno;
    return linksDefault;
  };

  const config = {
    admin: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-secondary font-bold',
      title: 'Panel de Control Admin',
      subtitle: 'DECISION 360',
    },
    gobierno: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-secondary font-bold',
      title: 'Panel de Control Gubernamental',
      subtitle: 'DECISION 360',
    },
    default: {
      bg: 'bg-white',
      text: 'text-black text-lg font-bold',
      subtext: 'text-m text-accent-secondary font-bold',
      title: 'DECISION 360',
      subtitle: 'Consulta de medicamentos',
    },
  };

  const current = config[variant];
  const isDark = variant === 'admin' || variant === 'gobierno';
  const links = resolveLinks();

  return (
    <nav
      className={`${current.bg} fixed top-0 left-0 w-full z-9999 px-6 py-3 shadow-md`}
    >
      <div className="flex items-center justify-between">
        {/* LOGO + TITULO — clickeable */}
        <button
          onClick={() => navigate('/inicio')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className={isDark ? 'bg-secondary' : ''}>
            <img
              src={logo}
              alt="Logo"
              className={`w-10 h-10 ${isDark ? 'brightness-0 invert' : ''}`}
            />
          </div>
          <div className="hidden sm:block text-left">
            <h1 className="text-lg font-semibold text-black">
              {current.title}
            </h1>
            <p className={current.subtext}>{current.subtitle}</p>
          </div>
        </button>

        {/* LINKS DESKTOP */}
        {links.length > 0 && (
          <div className="hidden md:flex gap-7">
            {links.map(({ label, path }) => {
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
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="p-1 rounded-full hover:bg-gray-100"
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              >
                <img
                  src={perfilPhoto}
                  alt="Perfil"
                  className="w-8 h-8 rounded-full"
                />
              </button>
              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                  <button
                    onClick={async () => {
                      await signOut();
                      setIsProfileDropdownOpen(false);
                      navigate('/inicio');
                    }}
                    className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate('/access')}
            >
              Iniciar sesión
            </Button>
          )}

          {/* HAMBURGER */}
          {links.length > 0 && (
            <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
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
      {isOpen && links.length > 0 && (
        <div className="mt-4 flex flex-col gap-4 md:hidden">
          {links.map(({ label, path }) => {
            const isActive = activePath === path;
            return (
              <a
                key={label}
                href={path}
                className={`text-base ${
                  isActive ? 'font-semibold text-black' : 'text-gray-500'
                }`}
              >
                {label}
              </a>
            );
          })}
          {!isAuthenticated && (
            <button
              onClick={() => navigate('/access')}
              className="text-base text-gray-500 text-left"
            >
              Iniciar sesión
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
