import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientService } from '../../services/patient';
import { ClinicalService } from '../clinical/services/clinical.service';
import { AppointmentService } from '../../services/appointment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  public clinicalService = inject(ClinicalService);
  private appointmentService = inject(AppointmentService);

  totalPatients = signal(0);
  allAppointments = signal<any[]>([]);
  
  kpiData = computed(() => [
    { title: 'Total Patients', value: this.totalPatients().toLocaleString(), icon: 'people', color: 'text-blue-500', bg: 'bg-blue-100' },
    { title: 'Available Beds', value: '142', icon: 'bed', color: 'text-emerald-500', bg: 'bg-emerald-100' },
    { title: 'All Appointments', value: this.allAppointments().length.toString(), icon: 'event', color: 'text-indigo-500', bg: 'bg-indigo-100' },
    { title: 'Revenue (Today)', value: '৳12,450', icon: 'payments', color: 'text-rose-500', bg: 'bg-rose-100' }
  ]);

  ngOnInit() {
    this.patientService.getPatients().subscribe(data => {
      this.totalPatients.set(data.length);
    });
    
    // Load ALL appointments from the backend
    this.appointmentService.getAppointments().subscribe(data => {
      this.allAppointments.set(data);
    });
    
    // Also load today's for the clinical service signal
    this.clinicalService.getDoctorAppointments('', new Date().toISOString().split('T')[0]).subscribe();
  }
}
