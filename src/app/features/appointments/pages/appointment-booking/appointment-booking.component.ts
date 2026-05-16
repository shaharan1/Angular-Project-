import { Component, inject, OnInit } from '@angular/core';
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
import { Router } from '@angular/router';
import { PatientService } from '../../../../services/patient';
import { AppointmentService } from '../../../../services/appointment';
import { DoctorMonitoringService, Doctor } from '../../../../services/doctor-monitoring.service';
import { Patient } from '../../../../core/models/patient.model';
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
  private router = inject(Router);
  private appointmentService = inject(AppointmentService);
  private doctorService = inject(DoctorMonitoringService);

  bookingForm!: FormGroup;
  doctors: Doctor[] = [];

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
      const formValue = this.bookingForm.value;
      const selectedDoctor = this.doctors.find(d => d.id === formValue.doctorId);
      
      const appointmentData: Appointment = {
        id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: `PT-GUEST-${Date.now()}`, // Temporary ID for guest patients
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

      this.appointmentService.addAppointment(appointmentData).subscribe({
        next: () => {
          this.toastr.success('Appointment booked successfully!', 'Success');
          this.router.navigate(['/appointments/dashboard']);
        },
        error: () => this.toastr.error('Failed to book appointment. Please try again.')
      });
    } else {
      this.bookingForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields');
    }
  }
}
