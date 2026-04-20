// src/components/Login/login.tsx
import * as React from 'react'
import { Button } from '@/components/Button/button'
import { Field, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface LoginProps {
  onSubmit?: (email: string, password: string) => void
  isLoading?: boolean
  className?: string
}

export function Login({ onSubmit, isLoading = false, className }: LoginProps) {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit?.(email, password)
  }

  return (
    <div
      className={cn(
        'w-full max-w-[600px] px-4 sm:px-8 md:px-10 py-10 sm:py-12',
        className
      )}
    >
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
        <Field>
          <FieldLabel className="text-sm font-semibold text-foreground">
            Correo Electrónico
          </FieldLabel>
          <Input
            type="email"
            placeholder="ejemplo@salud.gob.mx"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            className="h-12 rounded-xl px-4 text-sm bg-muted/40 border-input"
          />
        </Field>

        {/* Password */}
        <Field>
          <FieldLabel className="text-sm font-semibold text-foreground">
            Contraseña
          </FieldLabel>
          <div className="relative flex items-center">
            <Input
              type={'password'}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="h-12 rounded-xl px-4 pr-12 text-sm bg-muted/40 border-input"
            />
          </div>
        </Field>

        {/* Submit */}
        <Button
          type="submit"
          variant="secondary"
          disabled={isLoading}
          onClick={handleSubmit}
          className="w-full h-9 sm:h-12 rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase mt-2"
        >
          {isLoading ? 'Ingresando...' : 'Entrar al Sistema'}
        </Button>
      </div>
    </div>
  )
}
