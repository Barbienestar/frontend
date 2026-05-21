import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/Button/button';
import { InputField } from '@/components/Input/inputField';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { createAdmin } from '@/services/createUserService';
import type { CreateUserRequest } from '@/services/auth/authService';

const adminSchema = Yup.object().shape({
  name: Yup.string()
    .max(128, 'Máximo 128 caracteres')
    .required('El nombre es obligatorio'),
  lastName1: Yup.string()
    .max(64, 'Máximo 64 caracteres')
    .required('El apellido paterno es obligatorio'),
  lastName2: Yup.string().max(64, 'Máximo 64 caracteres'),
  email: Yup.string()
    .email('Formato inválido')
    .max(255, 'Máximo 255 caracteres')
    .required('El correo es obligatorio'),
  password: Yup.string()
    .min(6, 'Mínimo 6 caracteres')
    .matches(
      /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Debe incluir mayúscula, minúscula y número'
    )
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Los passwords no coinciden')
    .required('Confirmar contraseña es obligatorio'),
});

export const AdminCreationForm = () => {
  const formik = useFormik({
    initialValues: {
      name: '',
      lastName1: '',
      lastName2: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: adminSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const requestData: CreateUserRequest = {
          name: values.name,
          last_name_1: values.lastName1,
          last_name_2: values.lastName2,
          email: values.email,
          password: values.password,
          roleId: 1,
        };
        await createAdmin(requestData);
        resetForm();
      } catch (error) {
        console.error('Error al crear administrador: ', error);
      }
    },
  });

  const isInvalid = (fieldName: keyof typeof formik.values) =>
    !!(
      (formik.touched[fieldName] || formik.submitCount > 0) &&
      formik.errors[fieldName]
    );

  return (
    <form onSubmit={formik.handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>Crear Administrador</CardTitle>
          <CardDescription>
            Registra un nuevo usuario con permisos de administración
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <InputField
              variant="text"
              name="name"
              label="Nombre(s) *"
              placeholder="Jose Miguel"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={isInvalid('name') ? formik.errors.name : ''}
              descClassName="text-red-700"
              inputClassName={cn(
                'h-12 rounded-xl px-4 text-sm bg-muted/40',
                isInvalid('name') && 'border-red-700 bg-red-100/30'
              )}
            />

            <div className="flex gap-2">
              <InputField
                variant="text"
                name="lastName1"
                label="Apellido Paterno *"
                placeholder="Perez"
                value={formik.values.lastName1}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                description={
                  isInvalid('lastName1') ? formik.errors.lastName1 : ''
                }
                descClassName="text-red-700"
                inputClassName={cn(
                  'h-12 rounded-xl',
                  isInvalid('lastName1') && 'border-red-700 bg-red-100/30'
                )}
              />
              <InputField
                variant="text"
                name="lastName2"
                label="Apellido Materno"
                placeholder="Marquez"
                value={formik.values.lastName2}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                description={
                  isInvalid('lastName2') ? formik.errors.lastName2 : ''
                }
                descClassName="text-red-700"
                inputClassName={cn(
                  'h-12 rounded-xl',
                  isInvalid('lastName2') && 'border-red-700 bg-red-100/30'
                )}
              />
            </div>

            <InputField
              variant="email"
              name="email"
              label="Correo electrónico *"
              placeholder="admin@ejemplo.com"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={isInvalid('email') ? formik.errors.email : ''}
              descClassName="text-red-700"
              inputClassName={cn(
                'h-12 rounded-xl',
                isInvalid('email') && 'border-red-700 bg-red-100/30'
              )}
            />
            <InputField
              variant="password"
              name="password"
              label="Contraseña *"
              placeholder="••••••••"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={isInvalid('password') ? formik.errors.password : ''}
              descClassName="text-red-700"
              inputClassName={cn(
                'h-12 rounded-xl',
                isInvalid('password') && 'border-red-700 bg-red-100/30'
              )}
            />

            <InputField
              variant="password"
              name="confirmPassword"
              label="Confirmar contraseña *"
              placeholder="••••••••"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={
                isInvalid('confirmPassword')
                  ? formik.errors.confirmPassword
                  : ''
              }
              descClassName="text-red-700"
              inputClassName={cn(
                'h-12 rounded-xl',
                isInvalid('confirmPassword') && 'border-red-700 bg-red-100/30'
              )}
            />

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-12 rounded-xl font-bold uppercase mt-2"
            >
              {formik.isSubmitting ? 'Creando...' : 'Crear administrador'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};
