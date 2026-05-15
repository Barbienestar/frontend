import api from "../api";

export interface StockAverages {
    lastMonthAvg: number;
    currentMonthAvg: number;
}

export interface StockReport {
    lowStockCount: number;
    bottomMedicines: string[];
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

export const getStockReport = async(): Promise<StockReport> => {
    // TODO: Get the user's hospital
    const response = await api.get<StockReport>('/medicines-hospitals/stock-report', {
        params: {
            id_hospital: 62
        }
    });

    return response.data;
};
