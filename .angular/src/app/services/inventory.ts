import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Medicine } from '../models/inventory';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/inventory`;

  medicinesSignal = signal<Medicine[]>([]);

  constructor() {
    this.loadInventory();
  }

  loadInventory() {
    this.http.get<Medicine[]>(this.API_URL).subscribe(data => {
      this.medicinesSignal.set(data);
    });
  }

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.API_URL);
  }

  addMedicine(medicine: any): Observable<any> {
    return this.http.post<any>(this.API_URL, medicine);
  }
}