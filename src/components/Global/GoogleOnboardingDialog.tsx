import { useFormik } from 'formik';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import { InputField, type SelectOption } from '@/components/Input/inputField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAuth } from '@/contexts/useAuth';
import type { UpdateUserDto } from '@/services/auth/authService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { updateProfile } from '@/services/profileService';
import { getAllStates } from '@/services/states/statesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';

const validationSchema = Yup.object({
  name: Yup.string()
    .max(128, 'Máximo 128')
    .required('El nombre es obligatorio'),
  lastName1: Yup.string()
    .max(64, 'Máximo 64')
    .required('El apellido paterno es obligatorio'),
  lastName2: Yup.string().max(64, 'Máximo 64'),
  age: Yup.number()
    .typeError('Debe ser número')
    .min(0, 'Mínimo 0')
    .max(254, 'Máximo 254')
    .required('La edad es obligatoria'),
});

interface GoogleOnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

type LocationState = {
  states: SelectOption[];
  selectedStateId: string;
  cities: SelectOption[];
  selectedCityId: string;
  suburbs: SelectOption[];
  selectedSuburbId: string;
};

const initialLocationState: LocationState = {
  states: [],
  selectedStateId: '',
  cities: [],
  selectedCityId: '',
  suburbs: [],
  selectedSuburbId: '',
};

const GoogleOnboardingDialog = ({
  open,
  onComplete,
}: GoogleOnboardingDialogProps) => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [location, setLocation] = useState<LocationState>(initialLocationState);
  const [suburbId, setSuburbId] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { name: '', lastName1: '', lastName2: '', age: '' },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        const data: UpdateUserDto = {
          name: values.name,
          lastName1: values.lastName1,
        };
        if (values.lastName2) data.lastName2 = values.lastName2;
        if (values.age) {
          const n = Number(values.age);
          if (!isNaN(n)) data.age = n;
        }
        if (suburbId) data.suburbId = suburbId;

        const updatedUser = await updateProfile(data);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        onComplete();
        navigate('/inicio', { replace: true });
      } catch {
        setError('Error al actualizar perfil. Intenta de nuevo.');
      }
    },
  });

  // Pre-fill form when dialog opens
  const handleDialogOpen = useCallback(() => {
    if (user) {
      formik.resetForm({
        values: {
          name: user.name ?? '',
          lastName1: user.lastName1 ?? '',
          lastName2: user.lastName2 ?? '',
          age: user.age?.toString() ?? '',
        },
      });
      setLocation(initialLocationState);
      setError(null);
    }
  }, [user, formik]);

  // Load states when dialog opens
  useEffect(() => {
    if (!open || location.states.length > 0) return;
    getAllStates()
      .then((data) =>
        setLocation((prev) => ({
          ...prev,
          states: data.map((s) => ({
            value: s.id.toString(),
            label: s.name.toUpperCase(),
          })),
        }))
      )
      .catch(() => setError('Error al cargar estados'));
  }, [open, location.states.length]);

  const handleStateChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const stateId = e.target.value;
    setLocation((prev) => ({
      ...prev,
      selectedStateId: stateId,
      cities: [],
      selectedCityId: '',
      suburbs: [],
      selectedSuburbId: '',
    }));
    if (!stateId) return;
    getCitiesByState(Number(stateId))
      .then((data) =>
        setLocation((prev) => ({
          ...prev,
          cities: data.map((c) => ({
            value: c.id.toString(),
            label: c.name.toUpperCase(),
          })),
        }))
      )
      .catch(() => setError('Error al cargar ciudades'));
  };

  const handleCityChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const cityId = e.target.value;
    setLocation((prev) => ({
      ...prev,
      selectedCityId: cityId,
      suburbs: [],
      selectedSuburbId: '',
    }));
    if (!cityId) return;
    getSuburbsByCity(Number(cityId))
      .then((data) =>
        setLocation((prev) => ({
          ...prev,
          suburbs: data.map((s) => ({
            value: s.id.toString(),
            label: `${s.zipCode} - ${s.name.toUpperCase()}`,
          })),
        }))
      )
      .catch(() => setError('Error al cargar colonias'));
  };

  const handleSuburbSelected = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const val = e.target.value;
    setLocation((prev) => ({ ...prev, selectedSuburbId: val }));
    if (val) {
      setSuburbId(Number(val));
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent
        className="sm:max-w-md"
        onInteractOutside={(e) => e.preventDefault()}
        onOpenAutoFocus={handleDialogOpen}
      >
        <DialogHeader>
          <DialogTitle>Completa tu perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <InputField
            variant="text"
            label="Nombre(s) *"
            placeholder="Jose Miguel"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            description={
              formik.touched.name && formik.errors.name
                ? formik.errors.name
                : ''
            }
            labelClassName="font-semibold"
            inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40"
            name="name"
          />

          <div className="flex gap-2">
            <InputField
              variant="text"
              label="Apellido Paterno *"
              placeholder="Perez"
              value={formik.values.lastName1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={
                formik.touched.lastName1 && formik.errors.lastName1
                  ? formik.errors.lastName1
                  : ''
              }
              labelClassName="font-semibold"
              inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40"
              name="lastName1"
            />
            <InputField
              variant="text"
              label="Apellido Materno"
              placeholder="Marquez"
              value={formik.values.lastName2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              labelClassName="font-semibold"
              inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40"
              name="lastName2"
            />
          </div>

          <div className="w-1/3">
            <InputField
              variant="text"
              label="Edad *"
              placeholder="24"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={
                formik.touched.age && formik.errors.age ? formik.errors.age : ''
              }
              labelClassName="font-semibold"
              inputClassName="h-12 rounded-xl px-4 text-sm bg-muted/40"
              name="age"
            />
          </div>

          <div className="flex flex-col gap-2">
            <InputField
              variant="select"
              label="Estado *"
              options={location.states}
              value={location.selectedStateId}
              onChange={handleStateChange}
              labelClassName="font-semibold"
            />
            {location.selectedStateId && (
              <InputField
                variant="select"
                label="Ciudad *"
                options={location.cities}
                value={location.selectedCityId}
                onChange={handleCityChange}
                labelClassName="font-semibold"
              />
            )}
            {location.selectedCityId && (
              <InputField
                variant="select"
                label="Colonia *"
                options={location.suburbs}
                value={location.selectedSuburbId}
                onChange={handleSuburbSelected}
                labelClassName="font-semibold"
              />
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              variant="default"
              disabled={formik.isSubmitting || !suburbId}
            >
              {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleOnboardingDialog;
