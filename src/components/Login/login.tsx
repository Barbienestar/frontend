// src/components/Login/login.tsx
import * as React from 'react';
import { Button } from '@/components/Button/button';
import { cn } from '@/lib/utils';
import { InputField } from '@/components/Input/inputField';

interface LoginProps {
  onSubmit?: (email: string, password: string) => void;
  isLoading?: boolean;
  className?: string;
}

export function Login({ onSubmit, isLoading = false, className }: LoginProps) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit?.(email, password);
    console.log('Llamando a login desde componente...');
  }

  return (
    <form onSubmit={handleSubmit} className={cn('w-full', className)}>
      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
          Iniciar Sesión
        </h1>
        <p className="mt-2 text-sm sm:text-base text-muted-foreground">
          Ingrese sus credenciales para acceder al sistema.
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-6">
        {/* Email */}
        <InputField
          variant="email"
          label="Correo Electrónico"
          placeholder="ejemplo@salud.gob.mx"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          description=""
          labelClassName="font-semibold"
          inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40 border-input"
        />

        {/* Password */}
        <InputField
          variant="password"
          label="Contraseña"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          description=""
          labelClassName="font-semibold"
          inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40 border-input"
        />

        {/* Submit */}
        <Button
          type="submit"
          variant="secondary"
          disabled={isLoading}
          className="w-full h-9 sm:h-12 rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase mt-2"
        >
          {isLoading ? 'Ingresando...' : 'Entrar al Sistema'}
        </Button>
      </div>
    </form>
  );
}
