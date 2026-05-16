import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatCardModule],
  template: `
    <div class="space-y-8 animate-in">
      <header class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Overview Dashboard</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Surgical Unit monitoring and hospital performance metrics.</p>
        </div>
        <div class="flex gap-2">
          <button mat-stroked-button class="!rounded-xl text-slate-700 dark:text-slate-300">
            <mat-icon class="mr-2">calendar_today</mat-icon> Schedule
          </button>
          <button mat-flat-button color="primary" class="!rounded-xl shadow-lg shadow-indigo-500/20">
            <mat-icon class="mr-2">add</mat-icon> Admit Patient
          </button>
        </div>
      </header>

      <!-- Stats Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        @for (stat of stats; track stat.label) {
          <div class="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-all group">
            <p class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{{stat.label}}</p>
            <div class="mt-2 flex items-baseline gap-2">
              <span class="text-3xl font-bold text-slate-900 dark:text-white">{{stat.value}}</span>
              <span [class]="'text-xs font-medium ' + (stat.trend > 0 ? 'text-green-600' : 'text-red-500')">
                {{stat.trend > 0 ? '+' : ''}}{{stat.trend}}%
              </span>
            </div>
            <div class="mt-4 h-1 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
               <div [class]="'h-full ' + stat.barClass" [style.width.%]="stat.percent"></div>
            </div>
          </div>
        }
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Hospital Main Insights -->
        <div class="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
          <div class="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 class="font-bold text-slate-800 dark:text-white">Recent Admissions</h3>
            <button mat-button color="primary" class="!text-xs">View All</button>
          </div>
          <div class="flex-1 overflow-x-auto">
            <table class="w-full text-left">
              <thead class="bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase text-slate-400 font-bold tracking-widest border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th class="px-6 py-3">Patient Name</th>
                  <th class="px-6 py-3">ID</th>
                  <th class="px-6 py-3">Ward</th>
                  <th class="px-6 py-3">Status</th>
                  <th class="px-6 py-3">Doctor</th>
                </tr>
              </thead>
              <tbody class="text-xs divide-y divide-slate-100 dark:divide-slate-800">
                @for (p of recentAdmissions; track p.id) {
                  <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td class="px-6 py-4 font-semibold text-slate-900 dark:text-slate-200">{{p.name}}</td>
                    <td class="px-6 py-4 text-slate-500 font-mono">{{p.id}}</td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-400">{{p.ward}}</td>
                    <td class="px-6 py-4">
                      <span [class]="'px-2 py-1 text-[9px] rounded-full font-bold ' + p.statusClass">{{p.status}}</span>
                    </td>
                    <td class="px-6 py-4 text-slate-600 dark:text-slate-400">Dr. {{p.doctor}}</td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>

        <!-- Doctor Activity -->
        <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col p-6">
          <h3 class="font-bold text-slate-800 dark:text-white mb-6">Staff Availability</h3>
          <div class="space-y-6 flex-1">
            @for (doc of activeDoctors; track doc.name) {
              <div class="flex items-center gap-4">
                <div [class]="'h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-offset-2 ring-transparent group-hover:ring-indigo-500 transition-all ' + doc.bgClass">
                  {{doc.initials}}
                </div>
                <div class="flex-1">
                  <div class="flex justify-between items-center">
                    <p class="text-sm font-semibold text-slate-900 dark:text-white">{{doc.name}}</p>
                    <span [class]="'h-2 w-2 rounded-full ' + doc.statusColor"></span>
                  </div>
                  <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{{doc.dept}} • {{doc.status}}</p>
                </div>
              </div>
            }
          </div>
          <div class="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
             <div class="bg-slate-50 dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700">
               <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Handover Session</p>
               <p class="text-sm font-bold text-slate-900 dark:text-white mt-1">Shift B (Evening)</p>
               <div class="flex justify-between items-center mt-3">
                  <div class="flex -space-x-2">
                    <div class="h-7 w-7 rounded-full bg-blue-400 border-2 border-white dark:border-slate-800"></div>
                    <div class="h-7 w-7 rounded-full bg-indigo-400 border-2 border-white dark:border-slate-800"></div>
                    <div class="h-7 w-7 rounded-full bg-slate-200 dark:bg-slate-700 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-500 font-bold">+5</div>
                  </div>
                  <span class="text-[10px] font-bold text-indigo-500">IN 45 MINS</span>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Dashboard {
  auth = inject(AuthService);

  stats = [
    { label: 'Total Patients', value: '1,284', trend: 12, percent: 70, barClass: 'bg-indigo-500' },
    { label: 'Appointments Today', value: '42', trend: 8, percent: 45, barClass: 'bg-blue-500' },
    { label: 'Available Beds', value: '18', trend: -4, percent: 15, barClass: 'bg-emerald-500' },
    { label: 'Revenue (MTD)', value: '৳48.2k', trend: 4.3, percent: 62, barClass: 'bg-indigo-600' },
  ];

  recentAdmissions = [
    { id: '#PT-8231', name: 'Alice Henderson', ward: 'ICU - Bed 04', status: 'CRITICAL', statusClass: 'bg-red-50 text-red-600', doctor: 'Miller' },
    { id: '#PT-8235', name: 'Robert Fox', ward: 'Gen-02 - Bed 12', status: 'STABLE', statusClass: 'bg-green-50 text-green-600', doctor: 'Sarah J.' },
    { id: '#PT-8239', name: 'Eleanor Pena', ward: 'Ped-01 - Bed 05', status: 'OBSERVATIVE', statusClass: 'bg-amber-50 text-amber-600', doctor: 'V. Gupta' },
    { id: '#PT-8240', name: 'Guy Hawkins', ward: 'Surgery - Bed 01', status: 'PRE-OP', statusClass: 'bg-indigo-50 text-indigo-600', doctor: 'Michael' },
  ];

  activeDoctors = [
    { name: 'Dr. Arlene Johnson', initials: 'AJ', dept: 'Cardiology', status: 'On Duty', statusColor: 'bg-green-500', bgClass: 'bg-indigo-100 text-indigo-700' },
    { name: 'Dr. Kristal Miller', initials: 'KM', dept: 'Surgery', status: 'In Theater', statusColor: 'bg-amber-500', bgClass: 'bg-slate-100 text-slate-600' },
    { name: 'Dr. Ralph Wilson', initials: 'RW', dept: 'Neurology', status: 'Off Duty', statusColor: 'bg-slate-300', bgClass: 'bg-indigo-100 text-indigo-700' },
  ];
}
