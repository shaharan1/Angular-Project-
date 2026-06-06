import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient.service';
import { BloodGroup, Gender } from '../../../../core/models/patient.model';

@Component({
  selector: 'app-patient-registration',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSnackBarModule
  ],
  templateUrl: './patient-registration.component.html'
})
export class PatientRegistrationComponent {
  private fb = inject(FormBuilder);
  public patientService = inject(PatientService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  public bloodGroups = Object.values(BloodGroup);
  public genders = Object.values(Gender);

  public regForm: FormGroup = this.fb.group({
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
      allergies: [''], // Can be comma separated
      chronicDiseases: [''] // Can be comma separated
    })
  });

  onSubmit() {
    if (this.regForm.invalid) {
      this.regForm.markAllAsTouched();
      return;
    }

    const formValue = this.regForm.value;

    // Flatten form data to match Patient model
    const patientData = {
      ...formValue.personal,
      ...formValue.contact,
      ...formValue.emergency,
      allergies: formValue.medical.allergies ? formValue.medical.allergies.split(',').map((s: string) => s.trim()) : [],
      chronicDiseases: formValue.medical.chronicDiseases ? formValue.medical.chronicDiseases.split(',').map((s: string) => s.trim()) : [],
      status: 'OPD'
    };

    this.patientService.registerPatient(patientData).subscribe({
      next: (res) => {
        this.snackBar.open('Patient registered successfully! ID: ' + res.patientId, 'Close', { duration: 5000, panelClass: ['bg-emerald-600', 'text-white'] });
        this.router.navigate(['/patients']);
      },
      error: (err) => {
        this.snackBar.open('Error registering patient.', 'Close', { duration: 3000, panelClass: ['bg-red-600', 'text-white'] });
      }
    });
  }
}
