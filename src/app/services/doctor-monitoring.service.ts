import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, merge, Observable, interval, of } from 'rxjs';
import { catchError, shareReplay, startWith, switchMap, tap } from 'rxjs/operators';

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
  private apiUrl = 'http://localhost:3000';

  // Fallback data for development if backend is not running
  private fallbackDoctors: Doctor[] = [
    { id: 'd1', firstName: 'John', lastName: 'Doe', department: 'Cardiology', specialization: 'Heart Specialist', status: 'Available' },
    { id: 'd2', firstName: 'Sarah', lastName: 'Smith', department: 'Neurology', specialization: 'Brain Specialist', status: 'Available' },
    { id: 'd3', firstName: 'Michael', lastName: 'Ross', department: 'Orthopedics', specialization: 'Bone Specialist', status: 'Busy' }
  ];

  private refreshDoctors$ = new BehaviorSubject<void>(undefined);
  private liveDoctors$ = merge(
    this.refreshDoctors$.pipe(startWith(undefined)),
    interval(5000).pipe(startWith(0))
  ).pipe(
    switchMap(() => this.getDoctors()),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getDoctors(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(`${this.apiUrl}/doctors`).pipe(
      catchError(err => {
        console.warn('Backend not reachable, using fallback doctor data', err);
        return of(this.fallbackDoctors);
      })
    );
  }

  // Real-time polling every 5 seconds
  getLiveDoctors(): Observable<Doctor[]> {
    return this.liveDoctors$;
  }

  refreshDoctors() {
    this.refreshDoctors$.next();
  }

  addDoctor(doctor: Doctor): Observable<Doctor> {
    return this.http.post<Doctor>(`${this.apiUrl}/doctors`, doctor).pipe(
      tap(() => this.refreshDoctors())
    );
  }

  updateDoctor(id: string, doctor: Partial<Doctor>): Observable<Doctor> {
    return this.http.patch<Doctor>(`${this.apiUrl}/doctors/${id}`, doctor).pipe(
      tap(() => this.refreshDoctors())
    );
  }

  deleteDoctor(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/doctors/${id}`).pipe(
      tap(() => this.refreshDoctors())
    );
  }
}
