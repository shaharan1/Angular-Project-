import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { tap, catchError, delay, map } from 'rxjs/operators';
import { Patient } from '../../../core/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/patients';

  // Using signals for reactive state management
  public patientsSignal = signal<Patient[]>([]);
  public loadingSignal = signal<boolean>(false);
  public errorSignal = signal<string | null>(null);

  constructor() { }

  getAllPatients(): Observable<Patient[]> {
    this.loadingSignal.set(true);
    // In a real app, use this.http.get<Patient[]>(this.API_URL)
    // Here we simulate API call to our local json-server
    return this.http.get<Patient[]>(this.API_URL).pipe(
      delay(800), // Simulate network latency
      tap(patients => {
        this.patientsSignal.set(patients);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to load patients.');
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return this.http.get<Patient>(`${this.API_URL}/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  updatePatient(id: string, patientData: Partial<Patient>): Observable<Patient> {
    this.loadingSignal.set(true);
    return this.http.patch<Patient>(`${this.API_URL}/${id}`, patientData).pipe(
      delay(800),
      tap(updatedPatient => {
        const currentPatients = this.patientsSignal();
        this.patientsSignal.set(currentPatients.map(p => p.id === id ? updatedPatient : p));
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to update patient.');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  deletePatient(id: string): Observable<any> {
    this.loadingSignal.set(true);
    return this.http.delete(`${this.API_URL}/${id}`).pipe(
      delay(500),
      tap(() => {
        const currentPatients = this.patientsSignal();
        this.patientsSignal.set(currentPatients.filter(p => p.id !== id));
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Failed to delete patient.');
        this.loadingSignal.set(false);
        throw error;
      })
    );
  }

  registerPatient(patientData: Partial<Patient>): Observable<Patient> {
    this.loadingSignal.set(true);

    // Generate a unique patient ID (e.g., PT-2026-XXXX)
    const newPatient: any = {
      ...patientData,
      patientId: `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationDate: new Date().toISOString(),
      status: patientData.status || 'OPD'
    };

    return this.http.post<Patient>(this.API_URL, newPatient).pipe(
      delay(1000),
      tap(savedPatient => {
        const currentPatients = this.patientsSignal();
        this.patientsSignal.set([...currentPatients, savedPatient]);
        this.loadingSignal.set(false);
      }),
      catchError(error => {
        this.errorSignal.set('Backend not reachable. Patient saved locally.');
        this.loadingSignal.set(false);
        const fallbackPatient = { ...newPatient, id: `local-${Date.now()}` } as Patient;
        const currentPatients = this.patientsSignal();
        this.patientsSignal.set([...currentPatients, fallbackPatient]);
        return of(fallbackPatient);
      })
    );
  }

  searchPatients(query: string): Observable<Patient[]> {
    return this.http.get<Patient[]>(`${this.API_URL}?q=${query}`);
  }
}
