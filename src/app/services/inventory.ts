import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Medicine } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private medicinesSignal = signal<Medicine[]>([
    {
      id: 'MED-001',
      name: 'Amoxicillin 500mg',
      genericName: 'Amoxicillin',
      category: 'Antibiotic',
      stock: 450,
      unit: 'Capsule',
      price: 0.5,
      expiryDate: '2027-12-01',
      manufacturer: 'PharmaCore',
      status: 'Available'
    },
    {
      id: 'MED-002',
      name: 'Paracetamol 650mg',
      genericName: 'Acetaminophen',
      category: 'Antipyretic',
      stock: 35,
      unit: 'Tablet',
      price: 0.1,
      expiryDate: '2026-08-15',
      manufacturer: 'HealthMed',
      status: 'Low Stock'
    }
  ]);

  getMedicines(): Observable<Medicine[]> {
    return of(this.medicinesSignal()).pipe(delay(400));
  }
}
