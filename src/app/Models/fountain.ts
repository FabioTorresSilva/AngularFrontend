export interface Fountain {
    id: number; 
    description?: string;
    susceptibilityIndex?: any;
    continuousUseDeviceId?: number | null;
    isDrinkable?: boolean;
    lat: number;
    lng: number;
    address?: string;
  }
  