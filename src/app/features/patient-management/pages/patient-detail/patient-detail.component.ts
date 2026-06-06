import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PatientService } from '../../services/patient.service';
import { Patient, PatientStatus } from '../../../../core/models/patient.model';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-patient-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './patient-detail.component.html'
})
export class PatientDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);
  public patientService = inject(PatientService);

  public patient = signal<Patient | null>(null);
  public loading = signal<boolean>(true);
  public statuses = Object.values(PatientStatus);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadPatient(id);
    } else {
      this.snackBar.open('Invalid Patient ID', 'Close', { duration: 3000 });
      this.router.navigate(['/patients']);
    }
  }

  loadPatient(id: string) {
    this.loading.set(true);
    this.patientService.getPatientById(id).subscribe({
      next: (data) => {
        if (data) {
          this.patient.set(data);
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

  updateStatus(status: PatientStatus) {
    const p = this.patient();
    if (!p) return;

    this.patientService.updatePatient(p.id, { status }).subscribe({
      next: (updated) => {
        this.patient.set(updated);
        this.snackBar.open(`Status updated to ${status} successfully!`, 'Close', {
          duration: 3000,
          panelClass: ['bg-emerald-600', 'text-white']
        });
      },
      error: () => {
        this.snackBar.open('Failed to update status', 'Close', {
          duration: 3000,
          panelClass: ['bg-red-600', 'text-white']
        });
      }
    });
  }

  getAge(dobString: string | Date): number {
    const dob = new Date(dobString);
    const diffMs = Date.now() - dob.getTime();
    const ageDate = new Date(diffMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'OPD': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Admitted': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400';
      case 'Discharged': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'Emergency': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  }

  exportCardPDF() {
    const p = this.patient();
    if (!p) return;

    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: [85.6, 54] // Standard ID card size CR80 (85.6mm x 54mm)
    });

    // Background styling
    doc.setFillColor(79, 70, 229); // indigo-600
    doc.rect(0, 0, 85.6, 12, 'F');

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text('MED-ERP PATIENT CARD', 5, 8);

    // Patient Details
    doc.setTextColor(30, 41, 59); // slate-800
    doc.setFontSize(7);
    doc.text(`ID: ${p.patientId}`, 5, 20);
    doc.text(`Name: ${p.firstName} ${p.lastName}`, 5, 25);
    doc.text(`DOB: ${new Date(p.dateOfBirth).toLocaleDateString()}`, 5, 30);
    doc.text(`Blood: ${p.bloodGroup}  |  Gender: ${p.gender}`, 5, 35);
    doc.text(`Contact: ${p.contactNumber}`, 5, 40);
    doc.text(`Status: ${p.status}`, 5, 45);

    // Footer info
    doc.setFontSize(5);
    doc.setTextColor(100, 116, 139); // slate-500
    doc.text('Present this card during visits.', 5, 51);

    doc.save(`Patient_Card_${p.patientId}.pdf`);
  }
}
