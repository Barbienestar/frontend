import { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
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
import type { HospitalData } from '@/common/HospitalData';
import { getHospitals } from '@/services/report/reportService';
import { createHealthUser } from '@/services/user/createUserService';
import { toast } from 'sonner';
import { ConfirmModal } from '../ConfirmModal/ConfirmModal';

const healthUserSchema = Yup.object().shape({
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
  hospitalIds: Yup.array()
    .min(1, 'Selecciona al menos un hospital')
    .required('Selecciona al menos un hospital'),
});

interface HealthUserCreationFormProps {
  onSuccess?: () => void;
}

export const HealthUserCreationForm = ({
  onSuccess,
}: HealthUserCreationFormProps) => {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [loadingHospitals, setLoadingHospitals] = useState(true);

  useEffect(() => {
    const fetchHospitals = async () => {
      try {
        const data = await getHospitals();
        setHospitals(data);
      } catch (error) {
        console.error('Error al cargar hospitales: ', error);
      } finally {
        setLoadingHospitals(false);
      }
    };
    fetchHospitals();
  }, []);

  const handleHospitalToggle = (hospitalId: number) => {
    const numId = Number(hospitalId);
    const current = formik.values.hospitalIds;
    if (current.includes(numId)) {
      formik.setFieldValue(
        'hospitalIds',
        current.filter((id) => id !== numId)
      );
    } else {
      formik.setFieldValue('hospitalIds', [...current, numId]);
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      lastName1: '',
      lastName2: '',
      email: '',
      password: '',
      confirmPassword: '',
      hospitalIds: [] as number[],
    },
    validationSchema: healthUserSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const requestData = {
          name: values.name,
          last_name_1: values.lastName1,
          last_name_2: values.lastName2 || undefined,
          email: values.email,
          password: values.password,
          role_id: 2,
          hospital_ids: values.hospitalIds,
        };
        await createHealthUser(requestData);
        toast.success('Usuario de salud creado correctamente.');
        resetForm();
        onSuccess?.();
      } catch {
        toast.error('Error al crear el usuario. Intenta de nuevo.');
      }
    },
  });

  const isInvalid = (fieldName: keyof typeof formik.values) =>
    !!(
      (formik.touched[fieldName] || formik.submitCount > 0) &&
      formik.errors[fieldName]
    );
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [hospitalSearch, setHospitalSearch] = useState('');
  const hospitalSearchRef = useRef<HTMLInputElement>(null);

  const filteredHospitals = hospitalSearch.trim().length > 0
    ? hospitals.filter((h) =>
        h.name.toLowerCase().includes(hospitalSearch.toLowerCase().trim())
      )
    : [];

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setShowConfirmModal(true);
      }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Crear Usuario de Salud</CardTitle>
          <CardDescription>
            Registra un nuevo usuario con permisos de gestión hospitalaria
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

            <fieldset>
              <legend className="text-sm font-medium mb-2">
                Hospitales asignados *
              </legend>
              {loadingHospitals ? (
                <p className="text-sm text-muted-foreground">
                  Cargando hospitales...
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                    <input
                      ref={hospitalSearchRef}
                      type="text"
                      value={hospitalSearch}
                      onChange={(e) => setHospitalSearch(e.target.value)}
                      placeholder="Buscar hospital..."
                      className="w-full pl-8 pr-4 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  {filteredHospitals.length > 0 && (
                    <div className="flex flex-col gap-2 max-h-48 overflow-y-auto border border-border rounded-lg px-3 py-2">
                      {filteredHospitals.map((hospital) => (
                        <label
                          key={hospital.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={formik.values.hospitalIds.includes(
                              Number(hospital.id)
                            )}
                            onChange={() => handleHospitalToggle(hospital.id)}
                            className="size-4 rounded border-input accent-blue-600"
                          />
                          <span className="text-sm">{hospital.name}</span>
                        </label>
                      ))}
                    </div>
                  )}

                  {hospitalSearch.trim().length > 0 && filteredHospitals.length === 0 && (
                    <p className="text-xs text-muted-foreground px-1">
                      No se encontraron hospitales con ese nombre.
                    </p>
                  )}

                  {formik.values.hospitalIds.length > 0 && (
                    <p className="text-xs text-muted-foreground px-1">
                      {formik.values.hospitalIds.length} hospital{formik.values.hospitalIds.length !== 1 ? 'es' : ''} seleccionado{formik.values.hospitalIds.length !== 1 ? 's' : ''}
                    </p>
                  )}
                </div>
              )}
              {isInvalid('hospitalIds') && (
                <p className="text-xs text-red-700 mt-1">
                  {formik.errors.hospitalIds as string}
                </p>
              )}
            </fieldset>

            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full h-12 rounded-xl font-bold uppercase mt-2"
            >
              {formik.isSubmitting ? 'Creando...' : 'Crear usuario de salud'}
            </Button>
          </div>
        </CardContent>
      </Card>
      <ConfirmModal
        isOpen={showConfirmModal}
        message="¿Está seguro que desea crear este usuario de salud?"
        confirmLabel="Sí, crear"
        cancelLabel="Cancelar"
        onConfirm={() => {
          setShowConfirmModal(false);
          formik.handleSubmit();
        }}
        onCancel={() => setShowConfirmModal(false)}
      />
    </form>
  );
};
