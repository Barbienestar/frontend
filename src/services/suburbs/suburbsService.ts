import api from "@/services/api";

export interface Suburb {
    id: number;
    name: string;
    zipCode: string;
}

export const getSuburbsByCity = async (idCity: number) => {
    const suburbsResponse = await api.get<Suburb[]>('/suburbs', {
        params: {
            id_city: idCity
        }
    });

    return suburbsResponse.data;
};