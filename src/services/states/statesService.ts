import api from "@/services/api";

export interface State {
    id: string;
    name: string;
}

export const getAllStates = async () => {
    const statesResponse = await api.get<State[]>('/states');

    return statesResponse.data;
};