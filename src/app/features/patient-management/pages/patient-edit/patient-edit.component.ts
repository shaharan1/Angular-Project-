import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientService } from '../../services/patient.service';
import { BloodGroup, Gender } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-edit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './patient-edit.component.html'
})
export class PatientEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public patientService = inject(PatientService);

  public patientId: string | null = null;
  public loading = signal<boolean>(true);
  public bloodGroups = Object.values(BloodGroup);
  public genders = Object.values(Gender);

  public editForm: FormGroup = this.fb.group({
    personal: this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      dateOfBirth: ['', Validators.required],
      gender: ['', Validators.required],
      bloodGroup: ['', Validators.required],
    }),
    contact: this.fb.group({
      contactNumber: ['', [Validators.required, Validators.pattern('^[0-9+() -]*$')]],
      email: ['', Validators.email],
      address: ['', Validators.required],
    }),
    emergency: this.fb.group({
      emergencyContactName: ['', Validators.required],
      emergencyContactRelation: ['', Validators.required],
      emergencyContactNumber: ['', Validators.required]
    }),
    medical: this.fb.group({
      allergies: [''],
      chronicDiseases: ['']
    })
  });

  ngOnInit() {
    this.patientId = this.route.snapshot.paramMap.get('id');
    if (this.patientId) {
      this.loadPatient(this.patientId);
    } else {
      this.snackBar.open('Invalid Patient ID', 'Close', { duration: 3000 });
      this.router.navigate(['/patients']);
    }
  }

  loadPatient(id: string) {
    this.loading.set(true);
    this.patientService.getPatientById(id).subscribe({
      next: (patient) => {
        if (patient) {
          this.editForm.patchValue({
            personal: {
              firstName: patient.firstName,
              lastName: patient.lastName,
              dateOfBirth: patient.dateOfBirth,
              gender: patient.gender,
              bloodGroup: patient.bloodGroup
            },
            contact: {
              contactNumber: patient.contactNumber,
              email: patient.email,
              address: patient.address
            },
            emergency: {
              emergencyContactName: patient.emergencyContactName,
              emergencyContactRelation: patient.emergencyContactRelation,
              emergencyContactNumber: patient.emergencyContactNumber
            },
            medical: {
              allergies: patient.allergies ? patient.allergies.join(', ') : '',
              chronicDiseases: patient.chronicDiseases ? patient.chronicDiseases.join(', ') : ''
            }
          });
        } else {
          this.snackBar.open('Patient not found', 'Close', { duration: 3000 });
          this.router.navigate(['/patients']);
        }
        this.loading.set(false);
      },
      error: () => {
        this.snackBar.open('Error loading patient data', 'Close', { duration: 3000 });
        this.loading.set(false);
      }
    });
  }

  onSubmit() {
    if (this.editForm.invalid || !this.patientId) {
      this.editForm.markAllAsTouched();
      return;
    }

    const formValue = this.editForm.value;
    
    // Structure updated patient data
    const patientData = {
      ...formValue.personal,
      ...formValue.contact,
      ...formValue.emergency,
      allergies: formValue.medical.allergies ? formValue.medical.allergies.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : [],
      chronicDiseases: formValue.medical.chronicDiseases ? formValue.medical.chronicDiseases.split(',').map((s: string) => s.trim()).filter((s: string) => s.length > 0) : []
    };

    this.patientService.updatePatient(this.patientId, patientData).subscribe({
      next: () => {
        this.snackBar.open('Patient record updated successfully!', 'Close', {
          duration: 5000,
          panelClass: ['bg-emerald-600', 'text-white']
        });
        this.router.navigate(['/patients', this.patientId]);
      },
      error: () => {
        this.snackBar.open('Failed to update patient record.', 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }
}
