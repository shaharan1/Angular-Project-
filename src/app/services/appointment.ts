import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Appointment, AppointmentStatus } from '../models/appointment';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSignal = signal<Appointment[]>([
    {
      id: 'APT-101',
      patientId: 'P-12345',
      patientName: 'John Doe',
      doctorId: 'D-501',
      doctorName: 'Dr. Sarah Miller',
      department: 'Cardiology',
      date: '2026-05-20',
      time: '09:00 AM',
      type: 'Follow-up',
      status: AppointmentStatus.CONFIRMED
    },
    {
      id: 'APT-102',
      patientId: 'P-12346',
      patientName: 'Emma Wilson',
      doctorId: 'D-502',
      doctorName: 'Dr. Michael Ross',
      department: 'Orthopedics',
      date: '2026-05-20',
      time: '11:30 AM',
      type: 'Initial',
      status: AppointmentStatus.SCHEDULED
    }
  ]);

  getAppointments(): Observable<Appointment[]> {
    return of(this.appointmentsSignal()).pipe(delay(500));
  }

  addAppointment(apt: Appointment) {
    this.appointmentsSignal.update(as => [...as, apt]);
  }
}
