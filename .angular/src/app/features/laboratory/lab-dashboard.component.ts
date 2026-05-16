import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-lab-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatChipsModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Laboratory Dashboard</h1>
          <p class="text-slate-500 font-medium">Track diagnostic tests, results and pending reports.</p>
        </div>
        <div class="flex gap-3">
          <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !px-6 !py-6 !font-bold shadow-lg shadow-indigo-100">
            <mat-icon class="mr-2">add_task</mat-icon> New Test Order
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
          <div class="flex justify-between items-start">
            <div [class]="'p-2 rounded-xl ' + stat.bg">
              <mat-icon [class]="stat.color">{{stat.icon}}</mat-icon>
            </div>
            <span class="text-2xl font-black text-slate-800">{{stat.value}}</span>
          </div>
          <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest">{{stat.title}}</p>
        </div>
      </div>

      <mat-card class="!rounded-[2.5rem] shadow-xl border-none overflow-hidden">
        <mat-card-header class="!p-8 bg-white border-b border-slate-50 flex justify-between items-center">
          <mat-card-title class="!text-xl !font-black !text-slate-800">Pending Test Results</mat-card-title>
          <button mat-button class="text-indigo-600 font-bold">View History</button>
        </mat-card-header>
        <mat-card-content class="!p-0">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="labTests()" class="w-full">
              <ng-container matColumnDef="patient">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Patient </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6">
                  <p class="font-black text-slate-800">{{t.patientName}}</p>
                  <p class="text-[10px] text-slate-400 font-bold">{{t.patientId}}</p>
                </td>
              </ng-container>

              <ng-container matColumnDef="test">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Test Name </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6">
                  <span class="text-sm font-bold text-slate-700 bg-slate-100 px-3 py-1 rounded-lg">{{t.testName}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="status">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Status </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6">
                  <div class="flex items-center gap-2">
                    <div [class]="'w-2 h-2 rounded-full ' + getStatusPulse(t.status)"></div>
                    <span [class]="'text-[10px] font-black uppercase tracking-widest ' + getStatusColor(t.status)">
                      {{t.status}}
                    </span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black text-right"> </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6 text-right">
                  <button mat-flat-button class="!bg-indigo-50 !text-indigo-600 !rounded-xl !font-black !text-[10px] !px-4" [disabled]="t.status === 'Completed'">
                    {{t.status === 'Processing' ? 'Update Progress' : 'Start Testing'}}
                  </button>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['patient', 'test', 'status', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['patient', 'test', 'status', 'actions'];" class="hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-50"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .3; }
    }
  `]
})
export class LabDashboardComponent implements OnInit {
  stats = [
    { title: 'Pending Tests', value: '24', icon: 'hourglass_empty', color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Completed Today', value: '156', icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { title: 'Critical Results', value: '3', icon: 'report_problem', color: 'text-rose-600', bg: 'bg-rose-50' },
    { title: 'Turnaround Time', value: '4.2h', icon: 'speed', color: 'text-indigo-600', bg: 'bg-indigo-50' }
  ];

  labTests = signal([
    { patientName: 'Suman Ahmed', patientId: 'PT-2024-081', testName: 'Complete Blood Count (CBC)', status: 'Processing' },
    { patientName: 'Maria Begum', patientId: 'PT-2024-102', testName: 'Lipid Profile', status: 'Pending' },
    { patientName: 'Karim Ullah', patientId: 'PT-2024-095', testName: 'Blood Glucose (Fasting)', status: 'Completed' },
    { patientName: 'Nasrin Akter', patientId: 'PT-2024-110', testName: 'Thyroid Panel (T3, T4, TSH)', status: 'Pending' },
    { patientName: 'Zahir Raihan', patientId: 'PT-2024-077', testName: 'Liver Function Test (LFT)', status: 'Processing' }
  ]);

  ngOnInit() {}

  getStatusColor(status: string): string {
    switch(status) {
      case 'Processing': return 'text-indigo-600';
      case 'Pending': return 'text-amber-600';
      case 'Completed': return 'text-emerald-600';
      default: return 'text-slate-400';
    }
  }

  getStatusPulse(status: string): string {
    switch(status) {
      case 'Processing': return 'bg-indigo-500 pulse';
      case 'Pending': return 'bg-amber-500';
      case 'Completed': return 'bg-emerald-500';
      default: return 'bg-slate-300';
    }
  }
}
