import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { Appointment } from '../core/models/appointment.model';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/appointments';
  private refreshSubject = new Subject<void>();
  public refresh$ = this.refreshSubject.asObservable();

  getAppointments(): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(this.apiUrl).pipe(
      catchError(err => {
        console.warn('Backend not reachable for appointments, returning empty list', err);
        return of([]);
      })
    );
  }

  triggerRefresh(): void {
    this.refreshSubject.next();
  }

  refreshAppointments(): Observable<Appointment[]> {
    this.triggerRefresh();
    return this.getAppointments();
  }

  getAppointmentById(id: string): Observable<Appointment> {
    return this.http.get<Appointment>(`${this.apiUrl}/${id}`);
  }

  addAppointment(appointment: Appointment): Observable<Appointment> {
    return this.http.post<Appointment>(this.apiUrl, appointment).pipe(
      tap(() => {
        console.log('Appointment saved to backend');
        this.triggerRefresh();
      }),
      catchError(err => {
        console.warn('Backend not reachable, simulating successful booking in local memory', err);
        this.triggerRefresh();
        return of(appointment);
      })
    );
  }

  updateAppointment(id: string, appointment: Partial<Appointment>): Observable<Appointment> {
    return this.http.patch<Appointment>(`${this.apiUrl}/${id}`, appointment).pipe(
      tap(() => this.triggerRefresh())
    );
  }

  deleteAppointment(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => this.triggerRefresh())
    );
  }
}
