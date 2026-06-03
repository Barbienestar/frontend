import { useFormik } from 'formik';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { InputField, type SelectOption } from '@/components/Input/inputField';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/useAuth';
import type { UpdateUserDto } from '@/services/auth/authService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { updateProfile } from '@/services/profileService';
import { getAllStates } from '@/services/states/statesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';

const validationSchema = Yup.object({
  name: Yup.string().max(128, 'Máximo 128'),
  lastName1: Yup.string().max(64, 'Máximo 64'),
  lastName2: Yup.string().max(64, 'Máximo 64'),
  age: Yup.number()
    .typeError('Debe ser número')
    .min(0, 'Mínimo 0')
    .max(254, 'Máximo 254'),
});

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

const EditProfileDialog = () => {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [location, setLocation] = useState<LocationState>(initialLocationState);
  const [suburbId, setSuburbId] = useState<number | undefined>(undefined);
  const [suburbLabel, setSuburbLabel] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: { name: '', lastName1: '', lastName2: '', age: '' },
    validationSchema,
    onSubmit: async (values) => {
      setError(null);
      try {
        const data: UpdateUserDto = {};
        if (values.name) data.name = values.name;
        if (values.lastName1) data.lastName1 = values.lastName1;
        if (values.lastName2) data.lastName2 = values.lastName2;
        if (values.age) {
          const n = Number(values.age);
          if (!Number.isNaN(n)) data.age = n;
        }
        if (suburbId) data.suburbId = suburbId;

        const updatedUser = await updateProfile(data);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        setOpen(false);
      } catch {
        setError('Error al actualizar perfil. Intenta de nuevo.');
      }
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && user) {
      formik.resetForm({
        values: {
          name: user.name ?? '',
          lastName1: user.lastName1 ?? '',
          lastName2: user.lastName2 ?? '',
          age: user.age?.toString() ?? '',
        },
      });
      setSuburbId(user.suburb?.id);
      setSuburbLabel(user.suburb?.name ?? '');
      setIsChangingLocation(false);
      setLocation(initialLocationState);
      setError(null);
    }
  };

  // Load states only once when the location picker is opened
  useEffect(() => {
    if (!isChangingLocation || location.states.length > 0) return;

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
  }, [isChangingLocation, location.states.length]);

  const handleStateChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const stateId = e.target.value;
    // Reset everything below state in the same handler — no effect needed
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
    // Reset suburbs in the same handler — no effect needed
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
      const selected = location.suburbs.find((s) => s.value === val);
      setSuburbId(Number(val));
      setSuburbLabel(selected?.label ?? '');
      setIsChangingLocation(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
        >
          Editar perfil
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Perfil</DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-name">Nombre(s)</Label>
            <Input
              id="ep-name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="ep-lastname1">Apellido Paterno</Label>
              <Input
                id="ep-lastname1"
                name="lastName1"
                value={formik.values.lastName1}
                onChange={formik.handleChange}
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="ep-lastname2">Apellido Materno</Label>
              <Input
                id="ep-lastname2"
                name="lastName2"
                value={formik.values.lastName2}
                onChange={formik.handleChange}
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 w-1/3">
            <Label htmlFor="ep-age">Edad</Label>
            <Input
              id="ep-age"
              name="age"
              type="number"
              min={0}
              max={254}
              value={formik.values.age}
              onChange={formik.handleChange}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Colonia</span>
            {isChangingLocation ? (
              <div className="flex flex-col gap-2">
                <InputField
                  variant="select"
                  label="Estado"
                  options={location.states}
                  value={location.selectedStateId}
                  onChange={handleStateChange}
                />
                {location.selectedStateId && (
                  <InputField
                    variant="select"
                    label="Ciudad"
                    options={location.cities}
                    value={location.selectedCityId}
                    onChange={handleCityChange}
                  />
                )}
                {location.selectedCityId && (
                  <InputField
                    variant="select"
                    label="Colonia"
                    options={location.suburbs}
                    value={location.selectedSuburbId}
                    onChange={handleSuburbSelected}
                  />
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {suburbLabel || 'Sin colonia'}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setIsChangingLocation(true)}
                >
                  Cambiar
                </Button>
              </div>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="submit"
              variant="default"
              disabled={formik.isSubmitting}
            >
              {formik.isSubmitting ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
