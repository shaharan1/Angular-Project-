import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { PatientService } from '../../services/patient';
import { Patient, PatientStatus } from '../../core/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatInputModule, MatChipsModule, MatMenuModule],
  template: `
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Patient Records</h2>
          <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and monitor patient status across all departments.</p>
        </div>
        <button mat-flat-button color="primary" routerLink="/patients/register" class="!rounded-xl shadow-lg shadow-indigo-500/20">
          <mat-icon class="mr-2">person_add</mat-icon> Register Patient
        </button>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div class="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div class="relative w-full max-w-md group">
            <mat-icon class="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors">search</mat-icon>
            <input 
              type="text" 
              placeholder="Search by name, ID or phone..." 
              class="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-xs placeholder:text-slate-400 text-slate-700 dark:text-slate-200"
            >
          </div>
          <div class="flex items-center gap-2">
            <button mat-icon-button class="text-slate-400 hover:text-indigo-500"><mat-icon class="!text-lg">filter_list</mat-icon></button>
          </div>
        </div>

        <table mat-table [dataSource]="patients()" class="w-full !bg-transparent">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest !font-bold"> ID </th>
            <td mat-cell *matCellDef="let p" class="!py-4"> 
              <span class="font-mono text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-slate-600 dark:text-slate-400">{{p.id}}</span>
            </td>
          </ng-container>

          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest !font-bold"> Patient </th>
            <td mat-cell *matCellDef="let p">
              <div class="flex items-center gap-3">
                <div class="h-8 w-8 rounded-full bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-[10px]">
                  {{p.firstName[0]}}{{p.lastName[0]}}
                </div>
                <div>
                  <p class="text-xs font-bold text-slate-900 dark:text-slate-200">{{p.firstName}} {{p.lastName}}</p>
                  <p class="text-[10px] text-slate-500 dark:text-slate-400">{{p.gender}}, {{calculateAge(p.dateOfBirth)}}Y</p>
                </div>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest !font-bold"> Status </th>
            <td mat-cell *matCellDef="let p">
              <span [class]="'px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider ' + getStatusClass(p.status)">
                {{p.status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="doctor">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest !font-bold"> Assigned Doctor </th>
            <td mat-cell *matCellDef="let p" class="!text-xs text-slate-600 dark:text-slate-400"> 
               {{p.doctorName || 'Not Assigned'}}
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest !font-bold text-right pr-4"> </th>
            <td mat-cell *matCellDef="let p" class="text-right pr-2">
              <button mat-icon-button class="text-slate-400 hover:text-indigo-600 transition-colors">
                <mat-icon class="!text-lg">visibility</mat-icon>
              </button>
              <button mat-icon-button [matMenuTriggerFor]="patientMenu" class="text-slate-400">
                <mat-icon class="!text-lg">more_horiz</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;" 
              (click)="viewPatient(row)"
              class="hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition-colors"></tr>
        </table>

        <tr *ngIf="patients().length === 0">
          <td colspan="5" class="py-20 text-center">
             <mat-icon class="text-slate-200 text-6xl h-auto w-auto">search_off</mat-icon>
             <p class="text-slate-400 mt-4">No patients found match your criteria</p>
          </td>
        </tr>
      </div>
    </div>

    <mat-menu #patientMenu="matMenu">
      <button mat-menu-item><mat-icon>edit</mat-icon><span>Edit Profile</span></button>
      <button mat-menu-item><mat-icon>event</mat-icon><span>Book Appointment</span></button>
      <button mat-menu-item><mat-icon>description</mat-icon><span>View Records</span></button>
      <div class="border-t border-slate-100 my-1"></div>
      <button mat-menu-item class="!text-red-500"><mat-icon class="!text-red-500">delete</mat-icon><span>Archive Patient</span></button>
    </mat-menu>
  `,
  styles: [`
    :host { display: block; }
    .mat-mdc-table { background: transparent; }
  `]
})
export class PatientList implements OnInit {
  private patientService = inject(PatientService);

  patients = signal<Patient[]>([]);
  displayedColumns = ['id', 'name', 'status', 'doctor', 'actions'];

  ngOnInit() {
    this.patientService.getPatients().subscribe(data => {
      this.patients.set(data);
    });
  }

  viewPatient(patient: Patient) {
    console.log('Viewing patient:', patient);
  }

  calculateAge(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case PatientStatus.ADMITTED: return 'bg-blue-50 text-blue-600';
      case PatientStatus.OPD: return 'bg-emerald-50 text-emerald-600';
      case PatientStatus.EMERGENCY: return 'bg-red-50 text-red-600';
      case PatientStatus.DISCHARGED: return 'bg-slate-100 text-slate-500';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
