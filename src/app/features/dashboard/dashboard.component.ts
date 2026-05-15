import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  kpiData = [
    { title: 'Total Patients', value: '1,245', icon: 'people', color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
    { title: 'Available Beds', value: '142', icon: 'bed', color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
    { title: 'Appointments Today', value: '89', icon: 'event', color: 'text-indigo-500', bg: 'bg-indigo-100 dark:bg-indigo-900/30' },
    { title: 'Revenue (Today)', value: '$12,450', icon: 'payments', color: 'text-rose-500', bg: 'bg-rose-100 dark:bg-rose-900/30' }
  ];
}
