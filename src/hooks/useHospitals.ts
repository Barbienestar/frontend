import { useState, useEffect } from 'react';
import { getMyHospitals } from '../services/hospitals/hospitalsService';
import type { HospitalData } from '@/common/HospitalData';

export const useHospitals = () => {
  const [hospitals, setHospitals] = useState<HospitalData[]>([]);
  const [selectedHospital, setSelectedHospital] = useState<HospitalData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    getMyHospitals()
      .then((data) => {
        setHospitals(data);
        if (data.length > 0) setSelectedHospital(data[0]);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return { hospitals, selectedHospital, setSelectedHospital, loading, error };
};
