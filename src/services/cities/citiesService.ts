import api from "@/services/api";

export interface City {
    id: number;
    name: string;
}

export const getCitiesByState = async (idState: number) => {
    const citiesResponse = await api.get<City[]>('/cities', {
        params: {
            id_state: idState
        }
    });

    return citiesResponse.data;
};