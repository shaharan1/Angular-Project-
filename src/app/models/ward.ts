export interface Bed {
  id: string;
  name: string;
  type: 'General' | 'ICU' | 'CCU' | 'Semi-Private' | 'Private';
  status: 'Available' | 'Occupied' | 'Cleaning' | 'Maintenance';
  patientName?: string;
  patientId?: string;
}

export interface Ward {
  id: string;
  name: string;
  totalBeds: number;
  availableBeds: number;
  beds: Bed[];
}
