import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DoctorMonitoringService, Doctor } from '../../../services/doctor-monitoring.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-doctor-monitoring',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatChipsModule, MatProgressBarModule],
  templateUrl: './doctor-monitoring.component.html'
})
export class DoctorMonitoringComponent implements OnInit, OnDestroy {
  private doctorService = inject(DoctorMonitoringService);
  private destroy$ = new Subject<void>();

  doctors: Doctor[] = [];
  lastUpdated: Date = new Date();
  
  onlineCount = 0;
  offlineCount = 0;
  busyCount = 0;

  ngOnInit() {
    this.doctorService.getLiveDoctors()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.doctors = data;
        this.lastUpdated = new Date();
        this.calculateStats();
      });
  }

  private calculateStats() {
    this.onlineCount = this.doctors.filter(d => d.status === 'Online').length;
    this.offlineCount = this.doctors.filter(d => d.status === 'Offline').length;
    this.busyCount = this.doctors.filter(d => d.availability === 'Busy').length;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
