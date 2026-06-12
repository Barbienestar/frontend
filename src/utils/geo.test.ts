import { haversineKm, formatDistance } from './geo';

describe('haversineKm', () => {
  it('returns 0 for same coordinates', () => {
    expect(haversineKm(19.4326, -99.1332, 19.4326, -99.1332)).toBe(0);
  });

  it('calculates distance between CDMX and Monterrey', () => {
    const dist = haversineKm(19.4326, -99.1332, 25.6866, -100.3161);
    expect(dist).toBeGreaterThan(700);
    expect(dist).toBeLessThan(750);
  });

  it('calculates distance between CDMX and Guadalajara', () => {
    const dist = haversineKm(19.4326, -99.1332, 20.6597, -103.3496);
    expect(dist).toBeGreaterThan(450);
    expect(dist).toBeLessThan(500);
  });
});

describe('formatDistance', () => {
  it('returns empty string for null', () => {
    expect(formatDistance(null)).toBe('');
  });

  it('returns meters when less than 1 km', () => {
    expect(formatDistance(0.5)).toBe('500 m');
  });

  it('returns km with one decimal when >= 1 km', () => {
    expect(formatDistance(5.3)).toBe('A 5.3 km');
  });

  it('rounds meters correctly', () => {
    expect(formatDistance(0.123)).toBe('123 m');
  });
});
