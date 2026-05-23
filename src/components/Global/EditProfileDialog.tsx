import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/useAuth';
import { updateProfile } from '@/services/profileService';
import { getAllStates } from '@/services/states/statesService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';
import { InputField, type SelectOption } from '@/components/Input/inputField';
import type { UpdateUserDto } from '@/services/auth/authService';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().max(128, 'Máximo 128'),
  lastName1: Yup.string().max(64, 'Máximo 64'),
  lastName2: Yup.string().max(64, 'Máximo 64'),
  age: Yup.number()
    .typeError('Debe ser número')
    .min(0, 'Mínimo 0')
    .max(254, 'Máximo 254'),
});

const EditProfileDialog = () => {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  // Location cascade state
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [suburbs, setSuburbs] = useState<SelectOption[]>([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedSuburbId, setSelectedSuburbId] = useState('');

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
          if (!isNaN(n)) data.age = n;
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
      setSelectedStateId('');
      setSelectedCityId('');
      setSelectedSuburbId('');
      setError(null);
    }
  };

  // Load states when "Cambiar" is toggled
  useEffect(() => {
    if (isChangingLocation && states.length === 0) {
      getAllStates()
        .then((data) =>
          setStates(
            data.map((s) => ({
              value: s.id.toString(),
              label: s.name.toUpperCase(),
            }))
          )
        )
        .catch(() => setError('Error al cargar estados'));
    }
  }, [isChangingLocation, states.length]);

  // Load cities when state changes
  useEffect(() => {
    if (selectedStateId) {
      /* eslint-disable react-hooks/set-state-in-effect */
      setSelectedCityId('');
      setSelectedSuburbId('');
      setSuburbs([]);
      /* eslint-enable react-hooks/set-state-in-effect */
      getCitiesByState(Number(selectedStateId))
        .then((data) =>
          setCities(
            data.map((c) => ({
              value: c.id.toString(),
              label: c.name.toUpperCase(),
            }))
          )
        )
        .catch(() => setError('Error al cargar ciudades'));
    }
  }, [selectedStateId]);

  // Load suburbs when city changes
  useEffect(() => {
    if (selectedCityId) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      setSelectedSuburbId('');
      getSuburbsByCity(Number(selectedCityId))
        .then((data) =>
          setSuburbs(
            data.map((s) => ({
              value: s.id.toString(),
              label: `${s.zipCode} - ${s.name.toUpperCase()}`,
            }))
          )
        )
        .catch(() => setError('Error al cargar colonias'));
    }
  }, [selectedCityId]);

  const handleSuburbSelected = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const val = e.target.value;
    setSelectedSuburbId(val);
    if (val) {
      const selected = suburbs.find((s) => s.value === val);
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
              placeholder="Leonardo"
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
                placeholder="Pérez"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="ep-lastname2">Apellido Materno</Label>
              <Input
                id="ep-lastname2"
                name="lastName2"
                value={formik.values.lastName2}
                onChange={formik.handleChange}
                placeholder="Palatto"
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
              placeholder="20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <span className="text-sm font-medium">Colonia</span>
            {!isChangingLocation ? (
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
            ) : (
              <div className="flex flex-col gap-2">
                <InputField
                  variant="select"
                  label="Estado"
                  options={states}
                  value={selectedStateId}
                  onChange={(
                    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
                  ) => setSelectedStateId(e.target.value)}
                />
                {selectedStateId && (
                  <InputField
                    variant="select"
                    label="Ciudad"
                    options={cities}
                    value={selectedCityId}
                    onChange={(
                      e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
                    ) => setSelectedCityId(e.target.value)}
                  />
                )}
                {selectedCityId && (
                  <InputField
                    variant="select"
                    label="Colonia"
                    options={suburbs}
                    value={selectedSuburbId}
                    onChange={handleSuburbSelected}
                  />
                )}
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
