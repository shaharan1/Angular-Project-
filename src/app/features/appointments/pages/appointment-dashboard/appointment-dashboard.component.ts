import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClinicalService } from '../../../clinical/services/clinical.service';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  selector: 'app-appointment-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './appointment-dashboard.component.html'
})
export class AppointmentDashboardComponent implements OnInit {
  public clinicalService = inject(ClinicalService);
  public authService = inject(AuthService);

  ngOnInit() {
    // Fetch all appointments (For demo, passing empty doctorId gets all in mock)
    this.clinicalService.getDoctorAppointments('', new Date().toISOString()).subscribe();
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
