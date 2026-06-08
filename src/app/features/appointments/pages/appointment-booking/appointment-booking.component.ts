import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { ToastrService } from 'ngx-toastr';
import { catchError, of } from 'rxjs';
import { PatientService } from '../../../../services/patient';
import { AppointmentService } from '../../../../services/appointment';
import { DoctorMonitoringService, Doctor } from '../../../../services/doctor-monitoring.service';
import { ClinicalService } from '../../../clinical/services/clinical.service';
import { Patient, BloodGroup, Gender, PatientStatus } from '../../../../core/models/patient.model';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment.model';

@Component({
  selector: 'app-appointment-booking',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule, MatDatepickerModule,
    MatNativeDateModule, MatIconModule
  ],
  templateUrl: './appointment-booking.component.html'
})
export class AppointmentBookingComponent implements OnInit {
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorMonitoringService);
  private clinicalService = inject(ClinicalService);
  private patientService = inject(PatientService);

  bookingForm!: FormGroup;
  doctors: Doctor[] = [];
  isSubmitting = signal(false);
  bookingConfirmed = signal(false);
  confirmedAppointment = signal<Appointment | null>(null);

  timeSlots = [
    '09:00 AM - 09:30 AM',
    '09:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM',
    '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM',
    '11:30 AM - 12:00 PM',
    '02:00 PM - 02:30 PM',
    '02:30 PM - 03:00 PM',
    '03:00 PM - 03:30 PM',
    '03:30 PM - 04:00 PM'
  ];

  appointmentTypes = ['Initial', 'Follow-up', 'Surgery', 'Diagnostic'];
  minDate = new Date();

  ngOnInit() {
    this.initForm();
    this.loadDoctors();
  }

  private initForm() {
    this.bookingForm = this.fb.group({
      patientName: ['', [Validators.required, Validators.minLength(3)]],
      doctorId: ['', Validators.required],
      appointmentDate: [null, [Validators.required]],
      timeSlot: ['', Validators.required],
      type: ['Initial', Validators.required],
      reasonForVisit: ['', Validators.required],
      notes: ['']
    });
  }

  private loadDoctors() {
    this.doctorService.getDoctors().subscribe({
      next: (data) => {
        console.log('Doctors loaded:', data);
        this.doctors = data;
      },
      error: (err) => {
        console.error('Error loading doctors:', err);
        this.toastr.error('Failed to load doctors. Is the backend running?');
      }
    });
  }

  submitBooking() {
    if (this.bookingForm.valid) {
      this.isSubmitting.set(true);
      const formValue = this.bookingForm.value;
      const selectedDoctor = this.doctors.find(d => d.id === formValue.doctorId);

      const newPatientId = `PT-GUEST-${Date.now()}`;

      const appointmentData: Appointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: newPatientId,
        patientName: formValue.patientName,
        doctorId: formValue.doctorId,
        doctorName: selectedDoctor ? `Dr. ${selectedDoctor.firstName} ${selectedDoctor.lastName}` : 'Unknown',
        department: selectedDoctor?.department || 'General',
        appointmentDate: formValue.appointmentDate.toISOString().split('T')[0],
        timeSlot: formValue.timeSlot,
        reasonForVisit: formValue.reasonForVisit,
        notes: formValue.notes,
        status: AppointmentStatus.CONFIRMED
      };

      // Register this patient in the patients list so they show up in Patient Management
      const [firstName, ...restName] = formValue.patientName.trim().split(' ');
      const lastName = restName.join(' ') || '';
      const newPatientData: Patient = {
        id: newPatientId,
        patientId: `PT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: firstName || formValue.patientName,
        lastName,
        dateOfBirth: new Date().toISOString().split('T')[0],
        gender: Gender.OTHER,
        bloodGroup: BloodGroup.O_POS,
        contactNumber: 'Unknown',
        email: '',
        address: 'Unknown',
        emergencyContactName: 'Not provided',
        emergencyContactRelation: 'Unknown',
        emergencyContactNumber: 'Unknown',
        status: PatientStatus.OPD,
        allergies: [],
        chronicDiseases: [],
        registrationDate: new Date()
      };

      this.patientService.addPatient(newPatientData).pipe(
        catchError(err => {
          console.warn('Patient API not reachable, continuing with local patient record', err);
          return of(newPatientData);
        })
      ).subscribe({
        next: () => {
          this.appointmentService.addAppointment(appointmentData).subscribe({
            next: () => {
              this.isSubmitting.set(false);
              this.toastr.success('Appointment booked successfully!', 'Confirmed');
              this.confirmedAppointment.set(appointmentData);
              this.bookingConfirmed.set(true);
              const appointmentDateString = typeof appointmentData.appointmentDate === 'string'
                ? appointmentData.appointmentDate
                : appointmentData.appointmentDate.toISOString().split('T')[0];
              this.clinicalService.getDoctorAppointments('', appointmentDateString).subscribe();
            },
            error: () => {
              this.isSubmitting.set(false);
              this.toastr.error('Failed to book appointment. Please try again.');
            }
          });
        },
        error: () => {
          this.isSubmitting.set(false);
          this.toastr.error('Failed to create patient record for booking.');
        }
      });
    } else {
      this.bookingForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields');
    }
  }

  bookAnother() {
    this.bookingConfirmed.set(false);
    this.confirmedAppointment.set(null);
    this.bookingForm.reset({ type: 'Initial' });
  }
}
