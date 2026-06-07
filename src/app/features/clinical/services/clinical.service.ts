import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, delay, map } from 'rxjs/operators';
import { Appointment, Consultation } from '../../../core/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class ClinicalService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  // Signals for state
  public todayAppointmentsSignal = signal<Appointment[]>([]);
  public loadingSignal = signal<boolean>(false);

  constructor() {}

  getDoctorAppointments(doctorId: string, date: string): Observable<Appointment[]> {
    this.loadingSignal.set(true);
    const url = doctorId ? `${this.API_URL}/appointments?doctorId=${doctorId}` : `${this.API_URL}/appointments`;
    return this.http.get<Appointment[]>(url).pipe(
      delay(600), // Simulate latency
      tap(appointments => {
        this.todayAppointmentsSignal.set(appointments);
        this.loadingSignal.set(false);
      }),
      catchError(() => {
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }

  getAppointmentById(id: string): Observable<Appointment | undefined> {
    return this.http.get<Appointment>(`${this.API_URL}/appointments/${id}`).pipe(
      catchError(() => of(undefined))
    );
  }

  saveConsultation(consultation: Consultation): Observable<Consultation> {
    return this.http.post<Consultation>(`${this.API_URL}/consultations`, consultation).pipe(
      delay(800)
    );
  }

  getConsultations(): Observable<Consultation[]> {
    return this.http.get<Consultation[]>(`${this.API_URL}/consultations`);
  }

  updateConsultation(id: string, data: Partial<Consultation>): Observable<Consultation> {
    return this.http.patch<Consultation>(`${this.API_URL}/consultations/${id}`, data);
  }

  deleteConsultation(id: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/consultations/${id}`);
  }

  updateAppointmentStatus(id: string, status: string): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.API_URL}/appointments/${id}`, { status });
  }
}
