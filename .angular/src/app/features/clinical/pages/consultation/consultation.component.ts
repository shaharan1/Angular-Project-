import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { ClinicalService } from '../../services/clinical.service';
import { PatientService } from '../../../patient-management/services/patient.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatCardModule, MatInputModule, MatButtonModule, 
    MatIconModule, MatSelectModule, MatSnackBarModule, MatChipsModule
  ],
  templateUrl: './consultation.component.html'
})
export class ConsultationComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private location = inject(Location);
  private fb = inject(FormBuilder);
  public clinicalService = inject(ClinicalService);
  public patientService = inject(PatientService);
  private authService = inject(AuthService);
  private snackBar = inject(MatSnackBar);

  appointmentId!: string;
  consultationForm!: FormGroup;

  ngOnInit() {
    this.appointmentId = this.route.snapshot.paramMap.get('appointmentId') || '';
    this.initForm();
    
    // In a real app we fetch the appointment to prefill patient ID and set status to In Progress
    if (this.appointmentId) {
      this.clinicalService.updateAppointmentStatus(this.appointmentId, 'In Progress').subscribe();
    }
  }

  initForm() {
    this.consultationForm = this.fb.group({
      vitals: this.fb.group({
        bloodPressure: [''],
        temperature: [''],
        pulseRate: [''],
        weight: ['']
      }),
      symptoms: ['', Validators.required],
      diagnosis: ['', Validators.required],
      doctorNotes: [''],
      prescriptions: this.fb.array([this.createPrescriptionItem()]),
      labTestsOrdered: ['']
    });
  }

  get prescriptions() {
    return this.consultationForm.get('prescriptions') as FormArray;
  }

  createPrescriptionItem(): FormGroup {
    return this.fb.group({
      medicineName: ['', Validators.required],
      dosage: ['', Validators.required],
      frequency: ['', Validators.required],
      duration: ['', Validators.required]
    });
  }

  addPrescription() {
    this.prescriptions.push(this.createPrescriptionItem());
  }

  removePrescription(index: number) {
    this.prescriptions.removeAt(index);
  }

  goBack() {
    this.location.back();
  }

  saveConsultation() {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      return;
    }

    const formValue = this.consultationForm.value;
    const user = this.authService.currentUserSignal();

    const payload = {
      id: `C-${Date.now()}`,
      appointmentId: this.appointmentId,
      patientId: 'PT-2023-0001', // Mocked patient
      doctorId: user?.id || 'u3',
      date: new Date().toISOString(),
      vitals: formValue.vitals,
      symptoms: formValue.symptoms.split(',').map((s: string) => s.trim()),
      diagnosis: formValue.diagnosis,
      doctorNotes: formValue.doctorNotes,
      prescription: formValue.prescriptions,
      labTestsOrdered: formValue.labTestsOrdered ? formValue.labTestsOrdered.split(',').map((s: string) => s.trim()) : []
    };

    this.clinicalService.saveConsultation(payload as any).subscribe({
      next: () => {
        this.clinicalService.updateAppointmentStatus(this.appointmentId, 'Completed').subscribe();
        this.snackBar.open('Consultation saved successfully', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
        this.router.navigate(['/clinical/dashboard']);
      },
      error: () => {
        this.snackBar.open('Error saving consultation', 'Close', { duration: 3000, panelClass: ['bg-red-600', 'text-white'] });
      }
    });
  }
}
