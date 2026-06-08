import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Patient } from '../core/models/patient.model';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/patients';
  private refreshSubject = new Subject<void>();
  public refresh$ = this.refreshSubject.asObservable();

  getPatients(): Observable<Patient[]> {
    return this.http.get<Patient[]>(this.apiUrl);
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  refreshPatients(): Observable<Patient[]> {
    this.triggerRefresh();
    return this.getPatients();
  }

  getPatientById(id: string): Observable<Patient> {
    return this.http.get<Patient>(`${this.apiUrl}/${id}`);
  }

  addPatient(patient: Patient): Observable<Patient> {
    return this.http.post<Patient>(this.apiUrl, patient).pipe(
      tap(() => {
        console.log('Patient saved to backend');
        this.triggerRefresh();
      })
    );
  }

  updatePatient(id: string, patient: Partial<Patient>): Observable<Patient> {
    return this.http.patch<Patient>(`${this.apiUrl}/${id}`, patient).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  deletePatient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.triggerRefresh())
    );
  }
}
