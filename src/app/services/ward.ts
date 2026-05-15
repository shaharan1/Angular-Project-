import { Injectable, signal } from '@angular/core';
import { Ward } from '../models/ward';

@Injectable({
  providedIn: 'root'
})
export class WardService {
  wards = signal<Ward[]>([
    {
      id: 'W-A',
      name: 'General Ward A',
      totalBeds: 20,
      availableBeds: 5,
      beds: [
        { id: 'WA-01', name: 'Bed 1', type: 'General', status: 'Occupied', patientName: 'John Doe', patientId: 'P-12345' },
        { id: 'WA-02', name: 'Bed 2', type: 'General', status: 'Available' },
        { id: 'WA-03', name: 'Bed 3', type: 'General', status: 'Cleaning' },
        { id: 'WA-04', name: 'Bed 4', type: 'General', status: 'Available' },
      ]
    },
    {
      id: 'W-ICU',
      name: 'Intensive Care Unit (ICU)',
      totalBeds: 10,
      availableBeds: 2,
      beds: [
        { id: 'ICU-01', name: 'ICU Bed 1', type: 'ICU', status: 'Occupied', patientName: 'Michael Ross', patientId: 'P-12347' },
      ]
    }
  ]);
}
