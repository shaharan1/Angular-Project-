import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PatientService } from '../../services/patient.service';
import { Patient, PatientStatus, Gender } from '../../../../core/models/patient.model';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule,
    MatMenuModule, MatSelectModule, MatSnackBarModule
  ],
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  public patientService = inject(PatientService);
  private snackBar = inject(MatSnackBar);

  public searchControl = new FormControl('');
  public statusControl = new FormControl('ALL');
  public genderControl = new FormControl('ALL');

  public searchQuery = signal<string>('');
  public selectedStatus = signal<string>('ALL');
  public selectedGender = signal<string>('ALL');

  public showFilters = signal<boolean>(false);
  public statuses = Object.values(PatientStatus);
  public genders = Object.values(Gender);

  public filteredPatients = computed(() => {
    let list = this.patientService.patientsSignal();
    const query = this.searchQuery().toLowerCase().trim();
    const status = this.selectedStatus();
    const gender = this.selectedGender();

    if (query) {
      list = list.filter(p =>
        p.patientId.toLowerCase().includes(query) ||
        `${p.firstName} ${p.lastName}`.toLowerCase().includes(query) ||
        p.contactNumber.includes(query)
      );
    }

    if (status !== 'ALL') {
      list = list.filter(p => p.status === status);
    }

    if (gender !== 'ALL') {
      list = list.filter(p => p.gender === gender);
    }

    return list;
  });

  ngOnInit() {
    this.patientService.getAllPatients().subscribe();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      this.searchQuery.set(query || '');
    });

    this.statusControl.valueChanges.subscribe(status => {
      this.selectedStatus.set(status || 'ALL');
    });

    this.genderControl.valueChanges.subscribe(gender => {
      this.selectedGender.set(gender || 'ALL');
    });
  }

  toggleFilters() {
    this.showFilters.update(v => !v);
  }

  resetFilters() {
    this.searchControl.setValue('');
    this.statusControl.setValue('ALL');
    this.genderControl.setValue('ALL');
  }

  updatePatientStatus(patient: Patient, status: PatientStatus) {
    this.patientService.updatePatient(patient.id, { status }).subscribe({
      next: () => {
        this.snackBar.open(`Updated status of ${patient.firstName} to ${status}`, 'Close', {
          duration: 3000,
          panelClass: ['bg-emerald-600', 'text-white']
        });
      },
      error: () => {
        this.snackBar.open('Failed to update patient status', 'Close', { duration: 3000 });
      }
    });
  }

  deletePatient(patient: Patient) {
    if (confirm(`Are you sure you want to remove patient ${patient.firstName} ${patient.lastName}?`)) {
      this.patientService.deletePatient(patient.id).subscribe({
        next: () => {
          this.snackBar.open('Patient record removed successfully', 'Close', {
            duration: 3000,
            panelClass: ['bg-emerald-600', 'text-white']
          });
        },
        error: () => {
          this.snackBar.open('Failed to delete patient record', 'Close', { duration: 3000 });
        }
      });
    }
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

  exportToPDF() {
    const doc = new jsPDF();
    const patients = this.filteredPatients();
    
    doc.setFontSize(20);
    doc.text('Patient List Report', 14, 20);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['ID', 'Name', 'Gender', 'Blood Group', 'Status', 'Contact']],
      body: patients.map(p => [
        p.patientId,
        `${p.firstName} ${p.lastName}`,
        p.gender,
        p.bloodGroup,
        p.status,
        p.contactNumber
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('Patient_Report.pdf');
  }
}
