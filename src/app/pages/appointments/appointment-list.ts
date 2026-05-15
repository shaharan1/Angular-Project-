import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { AppointmentService } from '../../services/appointment';
import { Appointment, AppointmentStatus } from '../../models/appointment';

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule, MatChipsModule, MatCardModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Scheduled Appointments</h2>
          <p class="text-slate-500 text-sm">View and manage upcoming medical visits.</p>
        </div>
        <button mat-flat-button color="primary" class="!rounded-xl">
          <mat-icon class="mr-2">add</mat-icon> Book New
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <mat-card class="!bg-blue-600 !text-white !rounded-2xl">
          <mat-card-content class="p-6">
            <p class="text-white/70 text-xs uppercase tracking-widest font-bold">Today's Total</p>
            <p class="text-4xl font-bold mt-2">24</p>
            <p class="text-xs mt-4 flex items-center">
              <mat-icon class="!text-sm mr-1">trending_up</mat-icon> 12% from yesterday
            </p>
          </mat-card-content>
        </mat-card>

        <mat-card class="!bg-emerald-600 !text-white !rounded-2xl">
          <mat-card-content class="p-6">
            <p class="text-white/70 text-xs uppercase tracking-widest font-bold">Completed</p>
            <p class="text-4xl font-bold mt-2">15</p>
            <p class="text-xs mt-4">62% daily progress</p>
          </mat-card-content>
        </mat-card>

        <mat-card class="!bg-slate-900 !text-white !rounded-2xl">
          <mat-card-content class="p-6">
            <p class="text-white/70 text-xs uppercase tracking-widest font-bold">Pending Approval</p>
            <p class="text-4xl font-bold mt-2">8</p>
            <p class="text-xs mt-4 text-orange-400 font-bold italic">Action required</p>
          </mat-card-content>
        </mat-card>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden mt-6">
        <table mat-table [dataSource]="appointments()" class="w-full">
          <ng-container matColumnDef="time">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Time </th>
            <td mat-cell *matCellDef="let a"> 
              <div class="flex flex-col">
                <span class="font-bold text-slate-800 dark:text-slate-200">{{a.time}}</span>
                <span class="text-[10px] text-slate-400">{{a.date}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="patient">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Patient / ID </th>
            <td mat-cell *matCellDef="let a">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{a.patientName}}</p>
              <p class="text-xs text-slate-400">{{a.patientId}}</p>
            </td>
          </ng-container>

          <ng-container matColumnDef="doctor">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Physician </th>
            <td mat-cell *matCellDef="let a">
              <p class="text-sm font-medium text-slate-700 dark:text-slate-300">{{a.doctorName}}</p>
              <p class="text-xs text-slate-400">{{a.department}}</p>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Status </th>
            <td mat-cell *matCellDef="let a">
              <span [class]="'px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ' + getStatusClass(a.status)">
                {{a.status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest text-right pr-4"> </th>
            <td mat-cell *matCellDef="let a" class="text-right pr-2">
              <button mat-icon-button class="text-slate-400"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button class="text-red-400"><mat-icon>cancel</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" class="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    .mat-mdc-table { background: transparent; }
  `]
})
export class AppointmentList implements OnInit {
  private appointmentService = inject(AppointmentService);
  
  appointments = signal<Appointment[]>([]);
  displayedColumns = ['time', 'patient', 'doctor', 'status', 'actions'];

  ngOnInit() {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments.set(data);
    });
  }

  getStatusClass(status: AppointmentStatus): string {
    switch(status) {
      case AppointmentStatus.CONFIRMED: return 'bg-blue-50 text-blue-600';
      case AppointmentStatus.SCHEDULED: return 'bg-amber-50 text-amber-600';
      case AppointmentStatus.COMPLETED: return 'bg-emerald-50 text-emerald-600';
      case AppointmentStatus.CANCELLED: return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
