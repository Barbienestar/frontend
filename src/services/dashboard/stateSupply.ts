import api from '../api';

export interface StateSupplyData {
  stateId: number;
  stateName: string;
  avgStock: number;
  level: 'CA-01' | 'CA-02' | 'CA-03' | 'CA-04';
}

export const getStateSupplyHeatmap = async (): Promise<StateSupplyData[]> => {
  const response = await api.get<StateSupplyData[]>('/states/heatmap');
  return response.data;
};
