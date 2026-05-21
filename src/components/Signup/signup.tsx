import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { Button } from '@/components/Button/button';
import { InputField, type SelectOption } from '@/components/Input/inputField';
import { getAllStates } from '@/services/states/statesService';
import { getCitiesByState } from '@/services/cities/citiesService';
import { getSuburbsByCity } from '@/services/suburbs/suburbsService';
import { signup, type CreateUserRequest } from '@/services/auth/authService';

/** Validation Schema */
const signupSchema = Yup.object().shape({
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
      'Debe incluir Mayús, minús y número'
    )
    .required('La contraseña es obligatoria'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Los passwords no coinciden')
    .required('Confirmar contraseña es obligatorio'),
  age: Yup.number()
    .typeError('Debe ser un número')
    .min(0, 'Mínimo 0')
    .max(254, 'Máximo 254')
    .required('La edad es obligatoria'),
  stateId: Yup.string().required('Seleccione un estado'),
  cityId: Yup.string().required('Seleccione una ciudad'),
  idSuburb: Yup.string().required('Seleccione una colonia'),
});

const namedInput = (
  name: string
): Pick<React.InputHTMLAttributes<HTMLInputElement>, 'name'> => ({ name });

const SignUp = () => {
  const navigate = useNavigate();
  const [states, setStates] = useState<SelectOption[]>([]);
  const [cities, setCities] = useState<SelectOption[]>([]);
  const [suburbs, setSuburbs] = useState<SelectOption[]>([]);

  /** Formik Setup */
  const formik = useFormik({
    initialValues: {
      name: '',
      lastName1: '',
      lastName2: '',
      email: '',
      password: '',
      confirmPassword: '',
      age: '',
      stateId: '',
      cityId: '',
      idSuburb: '',
    },
    validationSchema: signupSchema,
    onSubmit: async (values) => {
      try {
        const requestData: CreateUserRequest = {
          name: values.name,
          last_name_1: values.lastName1,
          last_name_2: values.lastName2 || undefined,
          email: values.email,
          password: values.password,
          age: Number(values.age),
          suburbId: Number(values.idSuburb),
          roleId: 3,
        };
        await signup(requestData);
        navigate('/inicio', { replace: true });
      } catch (error) {
        console.error('Error al crear cuenta: ', error);
      }
    },
  });

  /** Helper for conditional error styling */
  const isInvalid = (fieldName: keyof typeof formik.values) =>
    !!(
      (formik.touched[fieldName] || formik.submitCount > 0) &&
      formik.errors[fieldName]
    );

  /** Data Fetching Effects */
  useEffect(() => {
    getAllStates()
      .then((data) => {
        setStates(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.name.toUpperCase(),
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (formik.values.stateId !== '') {
      getCitiesByState(Number(formik.values.stateId)).then((data) => {
        setCities(
          data.map((item) => ({
            value: item.id.toString(),
            label: item.name.toUpperCase(),
          }))
        );
      });
    }
  }, [formik.values.stateId]);

  useEffect(() => {
    if (formik.values.cityId !== '') {
      getSuburbsByCity(Number(formik.values.cityId)).then((data) => {
        setSuburbs(
          data.map((item) => ({
            value: item.id.toString(),
            label: `${item.zipCode} - ${item.name.toUpperCase()}`,
          }))
        );
      });
    }
  }, [formik.values.cityId]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="flex flex-col w-full gap-3">
        <InputField
          variant="text"
          label="Nombre(s) *"
          placeholder="Jose Miguel"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          description={isInvalid('name') ? formik.errors.name : ''}
          labelClassName="font-semibold"
          descClassName="text-red-700"
          inputClassName={cn(
            'h-12 rounded-xl px-4 text-sm bg-muted/40',
            isInvalid('name') && 'border-red-700 bg-red-100/30'
          )}
          {...namedInput('name')}
        />

        <div className="flex gap-2">
          <InputField
            variant="text"
            label="Apellido Paterno *"
            placeholder="Perez"
            value={formik.values.lastName1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            description={isInvalid('lastName1') ? formik.errors.lastName1 : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('lastName1') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('lastName1')}
          />
          <InputField
            variant="text"
            label="Apellido Materno"
            placeholder="Marquez"
            value={formik.values.lastName2}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            description={isInvalid('lastName2') ? formik.errors.lastName2 : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('lastName2') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('lastName2')}
          />
        </div>

        <div className="flex gap-2">
          <InputField
            variant="email"
            label="Correo electronico *"
            placeholder="jmperez@gmail.com"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            description={isInvalid('email') ? formik.errors.email : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('email') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('email')}
          />
          <InputField
            variant="password"
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
            {...namedInput('password')}
          />
        </div>

        <InputField
          variant="password"
          label="Confirmar contraseña *"
          placeholder="••••••••"
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          description={
            isInvalid('confirmPassword') ? formik.errors.confirmPassword : ''
          }
          descClassName="text-red-700"
          inputClassName={cn(
            'h-12 rounded-xl',
            isInvalid('confirmPassword') && 'border-red-700 bg-red-100/30'
          )}
          {...namedInput('confirmPassword')}
        />

        <div className="flex gap-2">
          <div className="w-1/3">
            <InputField
              variant="text"
              label="Edad *"
              placeholder="24"
              value={formik.values.age}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              description={isInvalid('age') ? formik.errors.age : ''}
              descClassName="text-red-700"
              inputClassName={cn(
                'h-12 rounded-xl',
                isInvalid('age') && 'border-red-700 bg-red-100/30'
              )}
              {...namedInput('age')}
            />
          </div>
          <InputField
            variant="select"
            label="Estado *"
            options={states}
            value={formik.values.stateId}
            onChange={(e) => {
              formik.setFieldValue('stateId', e.target.value);
              formik.setFieldTouched('stateId', true);
              formik.setFieldValue('cityId', '');
              formik.setFieldTouched('cityId', false);
              formik.setFieldValue('idSuburb', '');
              formik.setFieldTouched('idSuburb', false);
            }}
            onBlur={() => formik.setFieldTouched('stateId', true)}
            description={isInvalid('stateId') ? formik.errors.stateId : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('stateId') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('stateId')}
          />
        </div>

        {formik.values.stateId !== '' && (
          <InputField
            variant="select"
            label="Ciudad *"
            options={cities}
            value={formik.values.cityId}
            onChange={(e) => {
              formik.setFieldValue('cityId', e.target.value);
              formik.setFieldTouched('cityId', true);
              formik.setFieldValue('idSuburb', '');
              formik.setFieldTouched('idSuburb', false);
            }}
            onBlur={() => formik.setFieldTouched('cityId', true)}
            description={isInvalid('cityId') ? formik.errors.cityId : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('cityId') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('cityId')}
          />
        )}

        {formik.values.cityId !== '' && (
          <InputField
            variant="select"
            label="Localidad *"
            options={suburbs}
            value={formik.values.idSuburb}
            onChange={formik.handleChange}
            onBlur={() => formik.setFieldTouched('idSuburb', true)}
            description={isInvalid('idSuburb') ? formik.errors.idSuburb : ''}
            descClassName="text-red-700"
            inputClassName={cn(
              'h-12 rounded-xl',
              isInvalid('idSuburb') && 'border-red-700 bg-red-100/30'
            )}
            {...namedInput('idSuburb')}
          />
        )}

        <Button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full h-12 rounded-xl font-bold uppercase mt-2"
        >
          {formik.isSubmitting ? 'Creando cuenta...' : 'Crear cuenta'}
        </Button>
      </div>
    </form>
  );
};

export default SignUp;
