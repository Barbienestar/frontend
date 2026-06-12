import { statusConfig } from './reportStatus';

describe('statusConfig', () => {
  it('returns "Atendido" config for accepted status', () => {
    const result = statusConfig('accepted');
    expect(result.label).toBe('Atendido');
    expect(result.color).toBe('bg-green-100 text-green-700');
  });

  it('returns "En revisión" config for reviewing status', () => {
    const result = statusConfig('reviewing');
    expect(result.label).toBe('En revisión');
    expect(result.color).toBe('bg-amber-100 text-amber-700');
  });

  it('returns "Rechazado" config for declined status', () => {
    const result = statusConfig('declined');
    expect(result.label).toBe('Rechazado');
    expect(result.color).toBe('bg-red-100 text-red-700');
  });

  it('returns fallback config for unknown status', () => {
    const result = statusConfig('unknown_status');
    expect(result.label).toBe('unknown_status');
    expect(result.color).toBe('bg-gray-100 text-gray-600');
  });

  it('returns fallback for empty string', () => {
    const result = statusConfig('');
    expect(result.label).toBe('');
    expect(result.color).toBe('bg-gray-100 text-gray-600');
  });
});
