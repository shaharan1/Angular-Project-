import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ClinicalService } from '../../services/clinical.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatChipsModule, MatMenuModule, MatSnackBarModule],
  templateUrl: './doctor-dashboard.component.html'
})
export class DoctorDashboardComponent implements OnInit {
  public clinicalService = inject(ClinicalService);
  public authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  consultations = signal<any[]>([]);

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    const user = this.authService.currentUserSignal();
    if (user) {
      this.clinicalService.getDoctorAppointments(user.id, new Date().toISOString()).subscribe();
      this.loadConsultations();
    }
  }

  loadConsultations() {
    this.clinicalService.getConsultations().subscribe({
      next: (data) => this.consultations.set(data),
      error: () => this.snackBar.open('Failed to load past consultations', 'Close', { duration: 3000 })
    });
  }

  deleteConsultation(consultation: any) {
    if (confirm(`Are you sure you want to remove the consultation record for Patient ID ${consultation.patientId}?`)) {
      this.clinicalService.deleteConsultation(consultation.id).subscribe({
        next: () => {
          this.snackBar.open('Consultation record removed successfully', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
          this.loadConsultations();
        },
        error: () => this.snackBar.open('Failed to delete consultation record', 'Close', { duration: 3000 })
      });
    }
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300';
      case 'In Progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  }
}
