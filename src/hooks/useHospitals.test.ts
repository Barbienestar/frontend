/**
 * @jest-environment jsdom
 */

jest.mock('../services/hospitals/hospitalsService');

import { renderHook, waitFor, act } from '@testing-library/react';
import { useHospitals } from './useHospitals';
import { getMyHospitals } from '../services/hospitals/hospitalsService';
import type { HospitalData } from '@/common/HospitalData';

const mockedGetMyHospitals = jest.mocked(getMyHospitals);

const fakeHospitals: HospitalData[] = [
  {
    id: 1,
    name: 'Hospital A',
  },
  {
    id: 2,
    name: 'Hospital B',
  },
];

describe('useHospitals', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns hospitals on success and selects first', async () => {
    mockedGetMyHospitals.mockResolvedValue(fakeHospitals);

    const { result } = renderHook(() => useHospitals());

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hospitals).toEqual(fakeHospitals);
    expect(result.current.selectedHospital).toEqual(fakeHospitals[0]);
    expect(result.current.error).toBe(false);
  });

  it('sets error when API fails', async () => {
    mockedGetMyHospitals.mockRejectedValue(new Error('API error'));

    const { result } = renderHook(() => useHospitals());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hospitals).toEqual([]);
    expect(result.current.selectedHospital).toBeNull();
    expect(result.current.error).toBe(true);
  });

  it('returns empty hospitals when API returns empty', async () => {
    mockedGetMyHospitals.mockResolvedValue([]);

    const { result } = renderHook(() => useHospitals());

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hospitals).toEqual([]);
    expect(result.current.selectedHospital).toBeNull();
  });

  it('allows changing selected hospital', async () => {
    mockedGetMyHospitals.mockResolvedValue(fakeHospitals);

    const { result } = renderHook(() => useHospitals());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.selectedHospital).toEqual(fakeHospitals[0]);

    act(() => {
      result.current.setSelectedHospital(fakeHospitals[1]);
    });

    expect(result.current.selectedHospital).toEqual(fakeHospitals[1]);
  });
});
