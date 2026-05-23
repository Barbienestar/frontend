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

const EditProfileDialog = () => {
  const { user, setUser } = useAuth();
  const [open, setOpen] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [lastName1, setLastName1] = useState('');
  const [lastName2, setLastName2] = useState('');
  const [age, setAge] = useState('');
  const [suburbId, setSuburbId] = useState<number | undefined>(undefined);
  const [suburbLabel, setSuburbLabel] = useState('');

  // Location cascade state
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [suburbs, setSuburbs] = useState<SelectOption[]>([]);
  const [selectedStateId, setSelectedStateId] = useState('');
  const [selectedCityId, setSelectedCityId] = useState('');
  const [selectedSuburbId, setSelectedSuburbId] = useState('');

  // Submission state
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pre-fill form when dialog opens
  useEffect(() => {
    if (open && user) {
      setName(user.name ?? '');
      setLastName1(user.lastName1 ?? '');
      setLastName2(user.lastName2 ?? '');
      setAge(user.age?.toString() ?? '');
      setSuburbId(user.suburb?.id);
      setSuburbLabel(user.suburb?.name ?? '');
      setIsChangingLocation(false);
      setError(null);
    }
  }, [open, user]);

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
      setSelectedCityId('');
      setSelectedSuburbId('');
      setSuburbs([]);
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

  const handleSuburbSelected = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const val = e.target.value;
    setSelectedSuburbId(val);
    if (val) {
      const selected = suburbs.find((s) => s.value === val);
      setSuburbId(Number(val));
      setSuburbLabel(selected?.label ?? '');
      setIsChangingLocation(false);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      const data: UpdateUserDto = {};
      if (name) data.name = name;
      if (lastName1) data.lastName1 = lastName1;
      if (lastName2) data.lastName2 = lastName2;
      if (age) data.age = Number(age);
      if (suburbId) data.suburbId = suburbId;

      const updatedUser = await updateProfile(data);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setOpen(false);
    } catch {
      setError('Error al actualizar perfil. Intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="ep-name">Nombre(s)</Label>
            <Input
              id="ep-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Leonardo"
            />
          </div>

          {/* Last names */}
          <div className="flex gap-2">
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="ep-lastname1">Apellido Paterno</Label>
              <Input
                id="ep-lastname1"
                value={lastName1}
                onChange={(e) => setLastName1(e.target.value)}
                placeholder="Pérez"
              />
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <Label htmlFor="ep-lastname2">Apellido Materno</Label>
              <Input
                id="ep-lastname2"
                value={lastName2}
                onChange={(e) => setLastName2(e.target.value)}
                placeholder="Palatto"
              />
            </div>
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5 w-1/3">
            <Label htmlFor="ep-age">Edad</Label>
            <Input
              id="ep-age"
              type="number"
              min={0}
              max={254}
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="20"
            />
          </div>

          {/* Suburb */}
          <div className="flex flex-col gap-1.5">
            <Label>Colonia</Label>
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
                  onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setSelectedStateId(e.target.value)}
                />
                {selectedStateId && (
                  <InputField
                    variant="select"
                    label="Ciudad"
                    options={cities}
                    value={selectedCityId}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setSelectedCityId(e.target.value)}
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

          {/* Error */}
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileDialog;
