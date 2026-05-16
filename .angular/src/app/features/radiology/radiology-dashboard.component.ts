import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-radiology-dashboard',
  standalone: true,
  imports: [MatIconModule, MatCardModule],
  template: `
    <div class="p-6 space-y-6">
      <header>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Radiology & Imaging</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage X-Rays, MRIs, and CT Scans.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <mat-card class="p-6 bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-500/20">
          <div class="flex items-center justify-between mb-4">
            <mat-icon class="text-3xl opacity-80">biotech</mat-icon>
            <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded">PENDING</span>
          </div>
          <h3 class="text-2xl font-bold">12</h3>
          <p class="text-xs opacity-80 font-medium uppercase tracking-wider">Scheduled Scans</p>
        </mat-card>

        <mat-card class="p-6 bg-emerald-500 text-white rounded-xl shadow-lg shadow-emerald-500/20">
          <div class="flex items-center justify-between mb-4">
            <mat-icon class="text-3xl opacity-80">check_circle</mat-icon>
            <span class="text-xs font-bold bg-white/20 px-2 py-1 rounded">TODAY</span>
          </div>
          <h3 class="text-2xl font-bold">45</h3>
          <p class="text-xs opacity-80 font-medium uppercase tracking-wider">Reports Completed</p>
        </mat-card>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 text-center">
        <div class="h-20 w-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <mat-icon class="text-4xl text-slate-300">visibility_off</mat-icon>
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white">Recent Imaging Queue</h3>
        <p class="text-slate-500 dark:text-slate-400 text-sm max-w-xs mx-auto mt-2">No active scans or pending reports to display at this time.</p>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class RadiologyDashboardComponent {}
