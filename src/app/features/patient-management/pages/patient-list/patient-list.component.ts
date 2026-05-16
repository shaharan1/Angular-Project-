import { Component, OnInit, inject } from '@angular/core';
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
import { PatientService } from '../../services/patient.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [
    CommonModule, RouterModule, ReactiveFormsModule,
    MatCardModule, MatIconModule, MatButtonModule,
    MatInputModule, MatFormFieldModule, MatProgressSpinnerModule
  ],
  templateUrl: './patient-list.component.html'
})
export class PatientListComponent implements OnInit {
  public patientService = inject(PatientService);
  public searchControl = new FormControl('');

  ngOnInit() {
    this.patientService.getAllPatients().subscribe();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(query => {
      if (query) {
        this.patientService.searchPatients(query).subscribe(patients => {
          this.patientService.patientsSignal.set(patients);
        });
      } else {
        this.patientService.getAllPatients().subscribe();
      }
    });
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
    const patients = this.patientService.patientsSignal();
    
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
