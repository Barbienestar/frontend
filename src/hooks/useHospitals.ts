import { useState, useEffect } from 'react';
import { getMyHospitals } from '../services/hospitals/hospitalsService';
import type { HospitalData } from '@/common/HospitalData';
export const useHospitals = () => {
    const [hospitals, setHospitals] = useState<HospitalData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        getMyHospitals()
            .then(data => setHospitals(data))
            .catch(() => setError(true))
            .finally(() => setLoading(false));
    }, []);

    return { hospitals, loading, error };
};