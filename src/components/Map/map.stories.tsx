import type { Meta, StoryObj } from '@storybook/react-vite'
import { Map } from './map'

const meta: Meta<typeof Map> = {
  component: Map,
  title: 'Components/Map',
  argTypes: {
    variant: {
      control: 'select',
      options: ['heatmap', 'normal'],
    },
    zoom: {
      control: { type: 'range', min: 10, max: 18, step: 1 },
    },
    height: {
      control: 'text',
    },
  },
  parameters: {
    layout: 'padded',
  },
} satisfies Meta<typeof Map>

export default meta
type Story = StoryObj<typeof meta>

const mockPoints = [
  {
    lat: 19.432608,
    lng: -99.133209,
    intensity: 1.0,
    name: 'Farmacia Central — Paracetamol, Ibuprofeno',
  },
  {
    lat: 19.435,
    lng: -99.138,
    intensity: 0.8,
    name: 'Farmacia del Ahorro — Amoxicilina, Metformina',
  },
  {
    lat: 19.428,
    lng: -99.141,
    intensity: 0.9,
    name: 'Farmacia Guadalajara — Losartán, Atorvastatina',
  },
  {
    lat: 19.44,
    lng: -99.135,
    intensity: 0.5,
    name: 'Farmacia San Pablo — Omeprazol',
  },
  {
    lat: 19.43,
    lng: -99.128,
    intensity: 0.7,
    name: 'Farmacia Benavides — Azitromicina',
  },
  {
    lat: 19.437,
    lng: -99.143,
    intensity: 0.6,
    name: 'Farmacia Roma — Ciprofloxacino, Diclofenaco',
  },
  {
    lat: 19.425,
    lng: -99.136,
    intensity: 0.85,
    name: 'Farmacia Plus — Insulina, Metformina',
  },
  {
    lat: 19.434,
    lng: -99.13,
    intensity: 0.4,
    name: 'Farmacia Esperanza — Paracetamol',
  },
  {
    lat: 19.441,
    lng: -99.14,
    intensity: 0.95,
    name: 'Clínica IMSS — Amoxicilina, Ibuprofeno, Losartán',
  },
  {
    lat: 19.429,
    lng: -99.145,
    intensity: 0.3,
    name: 'Farmacia Económica — Omeprazol',
  },
  {
    lat: 19.445,
    lng: -99.132,
    intensity: 0.75,
    name: 'Farmacia Cruz Verde — Atorvastatina, Aspirina',
  },
  {
    lat: 19.422,
    lng: -99.139,
    intensity: 0.6,
    name: 'Farmacia Comunitaria — Azitromicina, Paracetamol',
  },
]

export const HeatMap: Story = {
  args: {
    variant: 'heatmap',
    points: mockPoints,
    zoom: 14,
    height: '480px',
  },
}

export const NormalMap: Story = {
  args: {
    variant: 'normal',
    points: mockPoints,
    zoom: 14,
    height: '480px',
  },
}
