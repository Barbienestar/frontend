import api from "../api";

export interface StockAverages {
    lastMonthAvg: number;
    currentMonthAvg: number;
}

export const getStockAvgs = async (): Promise<StockAverages> => {
    // TODO: Get the user's hospital
    const response = await api.get<StockAverages>('/medicines-hospitals/average-stock', {
        params: {
            id_hospital: 62
        }
    });

    return response.data;
};
