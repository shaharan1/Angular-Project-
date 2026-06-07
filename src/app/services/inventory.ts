import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Medicine } from '../models/inventory';

@Injectable({
  providedIn: 'root'
})
export class InventoryService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/medicines';

  getMedicines(): Observable<Medicine[]> {
    return this.http.get<Medicine[]>(this.apiUrl);
  }

  addMedicine(medicine: Medicine): Observable<Medicine> {
    return this.http.post<Medicine>(this.apiUrl, medicine);
  }

  updateMedicine(id: string, medicine: Partial<Medicine>): Observable<Medicine> {
    return this.http.patch<Medicine>(`${this.apiUrl}/${id}`, medicine);
  }

  deleteMedicine(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
