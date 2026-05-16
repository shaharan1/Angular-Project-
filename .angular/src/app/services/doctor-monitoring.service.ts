import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, interval } from 'rxjs';
import { switchMap, startWith } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Doctor {
  id: string;
  userId?: string;
  firstName: string;
  lastName: string;
  department: string;
  status: string;
  availability?: string;
  patientsQueue?: number;
  specialization?: string;
}

@Injectable({
  providedIn: 'root'
})
export class DoctorMonitoringService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/doctors`;

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(this.apiUrl);
  }

  // Real-time polling every 5 seconds
  getLiveDoctors(): Observable<Doctor[]> {
    return interval(5000).pipe(
      startWith(0),
      switchMap(() => this.getDoctors())
    );
  }

  getDoctorById(id: string): Observable<Doctor> {
    return this.http.get<Doctor>(`${this.apiUrl}/${id}`);
  }
}