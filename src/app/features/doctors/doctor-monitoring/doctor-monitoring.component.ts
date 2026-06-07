import { Component, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { DoctorMonitoringService, Doctor } from '../../../services/doctor-monitoring.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doctor-monitoring',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatCardModule, 
    MatIconModule, 
    MatChipsModule, 
    MatProgressBarModule,
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule
  ],
  templateUrl: './doctor-monitoring.component.html'
})
export class DoctorMonitoringComponent implements OnInit, OnDestroy {
  private doctorService = inject(DoctorMonitoringService);
  private fb = inject(FormBuilder);
  private destroy$ = new Subject<void>();

  doctors: Doctor[] = [];
  lastUpdated: Date = new Date();
  
  onlineCount = 0;
  offlineCount = 0;
  busyCount = 0;

  // Modal State
  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  currentDoctorId = signal<string | null>(null);
  doctorForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit() {
    this.loadDoctors();
  }

  private initForm() {
    this.doctorForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      department: ['', Validators.required],
      specialization: ['', Validators.required],
      status: ['Online', Validators.required],
      availability: ['Available', Validators.required],
      patientsQueue: [0, [Validators.required, Validators.min(0), Validators.max(10)]]
    });
  }

  loadDoctors() {
    this.doctorService.getLiveDoctors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.doctors = data;
        this.lastUpdated = new Date();
        this.calculateStats();
      });
  }

  private calculateStats() {
    this.onlineCount = this.doctors.filter(d => d.status === 'Online').length;
    this.offlineCount = this.doctors.filter(d => d.status === 'Offline').length;
    this.busyCount = this.doctors.filter(d => d.availability === 'Busy').length;
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentDoctorId.set(null);
    this.doctorForm.reset({
      status: 'Online',
      availability: 'Available',
      patientsQueue: 0
    });
    this.showModal.set(true);
  }

  openEditModal(doctor: Doctor) {
    this.isEditing.set(true);
    this.currentDoctorId.set(doctor.id);
    this.doctorForm.patchValue({
      firstName: doctor.firstName,
      lastName: doctor.lastName,
      department: doctor.department,
      specialization: doctor.specialization || '',
      status: doctor.status,
      availability: doctor.availability || 'Available',
      patientsQueue: doctor.patientsQueue || 0
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveDoctor() {
    if (this.doctorForm.invalid) {
      this.doctorForm.markAllAsTouched();
      return;
    }

    const formValue = this.doctorForm.value;
    if (this.isEditing() && this.currentDoctorId()) {
      const id = this.currentDoctorId()!;
      this.doctorService.updateDoctor(id, formValue).subscribe({
        next: () => {
          this.closeModal();
          this.loadDoctors();
        }
      });
    } else {
      const newDoctor: Doctor = {
        ...formValue,
        id: `d-${Date.now()}`
      };
      this.doctorService.addDoctor(newDoctor).subscribe({
        next: () => {
          this.closeModal();
          this.loadDoctors();
        }
      });
    }
  }

  changeStatus(doctor: Doctor, status: string) {
    this.doctorService.updateDoctor(doctor.id, { status }).subscribe({
      next: () => this.loadDoctors()
    });
  }

  changeAvailability(doctor: Doctor, availability: string) {
    this.doctorService.updateDoctor(doctor.id, { availability }).subscribe({
      next: () => this.loadDoctors()
    });
  }

  deleteDoctor(doctor: Doctor) {
    if (confirm(`Are you sure you want to remove Dr. ${doctor.firstName} ${doctor.lastName}?`)) {
      this.doctorService.deleteDoctor(doctor.id).subscribe({
        next: () => this.loadDoctors()
      });
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
