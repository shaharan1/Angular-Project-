import { Component, inject, OnDestroy, OnInit, signal, computed, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Chart } from 'chart.js/auto';
import { PatientService } from '../../services/patient';
import { ClinicalService } from '../clinical/services/clinical.service';
import { AppointmentService } from '../../services/appointment';
import { WardService } from '../../services/ward';
import { Subject, switchMap, startWith, takeUntil } from 'rxjs';





@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('admissionsChart') chartRef!: ElementRef<HTMLCanvasElement>;
  private chartInstance: Chart | null = null;
  private chartType: 'bar' | 'line' = 'bar';
  private destroy$ = new Subject<void>();

  private patientService = inject(PatientService);
  public clinicalService = inject(ClinicalService);
  private appointmentService = inject(AppointmentService);
  private wardService = inject(WardService);
  private snackBar = inject(MatSnackBar);

  totalPatients = signal(0);
  allAppointments = signal<any[]>([]);
  patientsData = signal<any[]>([]);
  appointmentsData = signal<any[]>([]);

  availableBeds = computed(() =>
    this.wardService.wards().reduce((sum, w) => sum + w.availableBeds, 0)
  );

  kpiData = computed(() => [
    { title: 'Total Patients', value: this.totalPatients().toLocaleString(), icon: 'people' },
    { title: 'Available Beds', value: this.availableBeds().toString(), icon: 'bed' },
    { title: 'All Appointments', value: this.allAppointments().length.toString(), icon: 'event' },
    { title: 'Revenue (Today)', value: this.calcRevenue(), icon: 'payments' }
  ]);

  ngOnInit() {
    this.patientService.refresh$.pipe(
      startWith(void 0),
      takeUntil(this.destroy$),
      switchMap(() => this.patientService.getPatients())
    ).subscribe(data => {
      this.totalPatients.set(data.length);
      this.patientsData.set(data);
      if (this.chartRef) {
        this.initChart(data, this.appointmentsData());
      }
    });

    this.appointmentService.refresh$.pipe(
      startWith(void 0),
      takeUntil(this.destroy$),
      switchMap(() => this.appointmentService.getAppointments())
    ).subscribe(data => {
      this.allAppointments.set(data);
      this.appointmentsData.set(data);
      if (this.chartRef) {
        this.initChart(this.patientsData(), data);
      }
    });

    this.clinicalService.getDoctorAppointments('', new Date().toISOString().split('T')[0]).subscribe();
  }

  ngAfterViewInit() {
    if (this.patientsData().length > 0 || this.appointmentsData().length > 0) {
      this.initChart(this.patientsData(), this.appointmentsData());
    }
  }

  calcRevenue(): string {
    const today = new Date().toISOString().split('T')[0];
    const todayApts = this.allAppointments().filter(a => {
      const d = a.appointmentDate ? String(a.appointmentDate).slice(0, 10) : '';
      return d === today && (a.status === 'Completed' || a.status === 'Confirmed');
    });
    const est = todayApts.length * 500;
    return '৳' + est.toLocaleString();
  }

  refreshDashboard() {
    this.patientService.triggerRefresh();
    this.appointmentService.triggerRefresh();
    const today = new Date().toISOString().split('T')[0];
    this.clinicalService.getDoctorAppointments('', today).subscribe();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  exportReport() {
    const apts = this.allAppointments();
    if (apts.length === 0) {
      this.snackBar.open('No appointment data to export.', 'Close', { duration: 3000 });
      return;
    }
    const headers = ['Patient Name', 'Patient ID', 'Doctor', 'Department', 'Date', 'Time Slot', 'Status'];
    const rows = apts.map(a => [
      a.patientName || '', a.patientId || '', a.doctorName || '',
      a.department || '', a.appointmentDate || '', a.timeSlot || '', a.status || ''
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appointments_report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.snackBar.open('Report exported successfully!', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
  }

  toggleChartType() {
    this.chartType = this.chartType === 'bar' ? 'line' : 'bar';
    this.initChart(this.patientsData(), this.appointmentsData());
    this.snackBar.open(`Switched to ${this.chartType} chart`, 'Close', { duration: 1500 });
  }

  initChart(patients: any[], appointments: any[]) {
    if (!this.chartRef) return;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const patientCounts: Record<string, number> = {};
    const appointmentCounts: Record<string, number> = {};
    months.forEach(m => {
      patientCounts[m] = 0;
      appointmentCounts[m] = 0;
    });

    patients.forEach(p => {
      if (p.registrationDate) {
        const date = new Date(p.registrationDate);
        const month = months[date.getMonth()];
        patientCounts[month]++;
      }
    });

    appointments.forEach(a => {
      if (a.appointmentDate) {
        const date = new Date(a.appointmentDate);
        const month = months[date.getMonth()];
        appointmentCounts[month]++;
      }
    });

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const isLine = this.chartType === 'line';

    this.chartInstance = new Chart(this.chartRef.nativeElement, {
      type: this.chartType,
      data: {
        labels: months,
        datasets: [
          {
            label: 'Patient Admissions',
            data: months.map(m => patientCounts[m]),
            backgroundColor: isLine ? 'rgba(67,24,255,0.08)' : '#4318FF',
            borderColor: '#4318FF',
            borderWidth: isLine ? 2 : 0,
            borderRadius: isLine ? 0 : 4,
            barThickness: 20,
            fill: isLine,
            tension: 0.4,
            pointBackgroundColor: '#4318FF',
            pointRadius: isLine ? 4 : 0
          },
          {
            label: 'Appointments Booked',
            data: months.map(m => appointmentCounts[m]),
            backgroundColor: isLine ? 'rgba(0,229,255,0.12)' : '#00E5FF',
            borderColor: '#00E5FF',
            borderWidth: isLine ? 2 : 0,
            borderRadius: isLine ? 0 : 4,
            barThickness: 20,
            fill: isLine,
            tension: 0.4,
            pointBackgroundColor: '#00E5FF',
            pointRadius: isLine ? 4 : 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: { beginAtZero: true, grid: { color: '#F4F7FE' }, border: { display: false } },
          x: { grid: { display: false }, border: { display: false } }
        },
        plugins: {
          legend: { display: true, position: 'top' }
        }
      }
    });
  }
}
