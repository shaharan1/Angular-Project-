import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Patient } from '../models/patient';

@Injectable({
  providedIn: 'root'
})
export class PatientService {
  private patientsSignal = signal<Patient[]>([
    {
      id: 'P-12345',
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+1 234 567 890',
      dob: '1985-06-15',
      gender: 'Male',
      bloodGroup: 'O+',
      address: '123 Maple Ave, Springfield',
      status: 'Inpatient',
      admissionDate: '2026-05-10',
      ward: 'A-102',
      bed: 'Bed 4',
      doctorName: 'Dr. Sarah Miller',
      medicalHistory: ['Hypertension', 'Type 2 Diabetes']
    },
    {
      id: 'P-12346',
      firstName: 'Emma',
      lastName: 'Wilson',
      email: 'emma.w@example.com',
      phone: '+1 234 567 891',
      dob: '1992-03-22',
      gender: 'Female',
      bloodGroup: 'A-',
      address: '456 Oak Lane, Riverside',
      status: 'Outpatient',
      doctorName: 'Dr. Michael Ross',
      medicalHistory: ['Seasonal Allergies']
    }
  ]);

  getPatients(): Observable<Patient[]> {
    return of(this.patientsSignal()).pipe(delay(500));
  }

  getPatientById(id: string): Observable<Patient | undefined> {
    return of(this.patientsSignal().find(p => p.id === id)).pipe(delay(300));
  }

  addPatient(patient: Patient) {
    this.patientsSignal.update(ps => [...ps, patient]);
  }
}
