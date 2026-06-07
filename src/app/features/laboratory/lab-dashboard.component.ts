import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';

interface LabTest {
  id: string;
  patientName: string;
  patientId: string;
  testName: string;
  status: 'Pending' | 'Processing' | 'Completed';
  orderedDate?: string;
  orderedBy?: string;
}

@Component({
  selector: 'app-lab-dashboard',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatTableModule, MatCardModule,
    MatButtonModule, MatIconModule, MatChipsModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatSnackBarModule
  ],
  template: `
    <div class="p-6 space-y-6 min-h-screen bg-slate-50 relative">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Laboratory Dashboard</h1>
          <p class="text-slate-500 font-medium">Track diagnostic tests, results and pending reports.</p>
        </div>
        <div class="flex gap-3">
          <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !px-6 !py-6 !font-bold shadow-lg shadow-indigo-100" (click)="openNewTestModal()">
            <mat-icon class="mr-2">add_task</mat-icon> New Test Order
          </button>
        </div>
      </div>

      <!-- Dynamic Stats -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div *ngFor="let stat of stats()" class="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between h-32">
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
          <button mat-button class="!text-indigo-600 !font-bold !rounded-xl hover:bg-indigo-50" (click)="toggleHistory()">
            {{ showHistory ? 'Hide Completed' : 'View History' }}
          </button>
        </mat-card-header>
        <mat-card-content class="!p-0">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="displayedTests()" class="w-full">
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

              <ng-container matColumnDef="orderedBy">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Ordered By </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6">
                  <span class="text-xs font-bold text-slate-500">{{t.orderedBy || '—'}}</span>
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
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 text-right"> </th>
                <td mat-cell *matCellDef="let t" class="!px-8 !py-6 text-right">
                  <button *ngIf="t.status !== 'Completed'" mat-flat-button
                    class="!bg-indigo-50 !text-indigo-600 !rounded-xl !font-black !text-[10px] !px-4"
                    (click)="advanceStatus(t)">
                    {{t.status === 'Processing' ? 'Mark Completed' : 'Start Testing'}}
                  </button>
                  <span *ngIf="t.status === 'Completed'" class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg">✓ Done</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['patient', 'test', 'orderedBy', 'status', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['patient', 'test', 'orderedBy', 'status', 'actions'];" class="hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-50"></tr>
            </table>

            <div *ngIf="displayedTests().length === 0" class="p-20 text-center text-slate-400">
              <mat-icon class="scale-[3] mb-6 block mx-auto">science</mat-icon>
              <p class="font-bold text-lg mt-8">No lab tests found</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- New Test Order Modal -->
      <div *ngIf="showModal" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
        <mat-card class="w-full max-w-lg !rounded-[2rem] border border-white/50 !shadow-2xl overflow-hidden">
          <div class="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-black text-slate-800">New Test Order</h3>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Order a new lab diagnostic test for a patient.</p>
            </div>
            <button mat-icon-button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <mat-card-content class="!p-6 space-y-4">
            <form [formGroup]="testForm" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Patient Name</mat-label>
                <input matInput formControlName="patientName" placeholder="e.g. John Doe">
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Patient ID</mat-label>
                <input matInput formControlName="patientId" placeholder="e.g. PT-2024-001">
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Test Name</mat-label>
                <mat-select formControlName="testName">
                  <mat-option value="Complete Blood Count (CBC)">Complete Blood Count (CBC)</mat-option>
                  <mat-option value="Lipid Profile">Lipid Profile</mat-option>
                  <mat-option value="Blood Glucose (Fasting)">Blood Glucose (Fasting)</mat-option>
                  <mat-option value="Thyroid Panel (T3, T4, TSH)">Thyroid Panel (T3, T4, TSH)</mat-option>
                  <mat-option value="Liver Function Test (LFT)">Liver Function Test (LFT)</mat-option>
                  <mat-option value="Urine Routine & Microscopy">Urine Routine & Microscopy</mat-option>
                  <mat-option value="Chest X-Ray">Chest X-Ray</mat-option>
                  <mat-option value="Kidney Function Test">Kidney Function Test</mat-option>
                  <mat-option value="Other">Other</mat-option>
                </mat-select>
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Ordered By (Doctor)</mat-label>
                <input matInput formControlName="orderedBy" placeholder="e.g. Dr. John Doe">
              </mat-form-field>
            </form>
          </mat-card-content>
          <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
            <button mat-button class="!rounded-xl" (click)="closeModal()">Cancel</button>
            <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !font-bold" (click)="submitTestOrder()">
              Place Order
            </button>
          </div>
        </mat-card>
      </div>
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
  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  labTests = signal<LabTest[]>([]);
  showModal = false;
  showHistory = false;
  testForm!: FormGroup;

  stats = computed(() => {
    const tests = this.labTests();
    return [
      { title: 'Pending Tests', value: tests.filter(t => t.status === 'Pending').length.toString(), icon: 'hourglass_empty', color: 'text-amber-600', bg: 'bg-amber-50' },
      { title: 'Processing', value: tests.filter(t => t.status === 'Processing').length.toString(), icon: 'science', color: 'text-indigo-600', bg: 'bg-indigo-50' },
      { title: 'Completed', value: tests.filter(t => t.status === 'Completed').length.toString(), icon: 'check_circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { title: 'Total Orders', value: tests.length.toString(), icon: 'assignment', color: 'text-slate-600', bg: 'bg-slate-50' }
    ];
  });

  displayedTests = computed(() => {
    const tests = this.labTests();
    if (this.showHistory) return tests;
    return tests.filter(t => t.status !== 'Completed');
  });

  ngOnInit() {
    this.initForm();
    this.loadTests();
  }

  private initForm() {
    this.testForm = this.fb.group({
      patientName: ['', Validators.required],
      patientId: ['', Validators.required],
      testName: ['', Validators.required],
      orderedBy: ['', Validators.required]
    });
  }

  loadTests() {
    this.http.get<LabTest[]>('http://localhost:3000/labTests').subscribe({
      next: data => this.labTests.set(data),
      error: () => this.snackBar.open('Could not load lab tests', 'Close', { duration: 3000 })
    });
  }

  toggleHistory() {
    this.showHistory = !this.showHistory;
  }

  advanceStatus(test: LabTest) {
    const nextStatus = test.status === 'Pending' ? 'Processing' : 'Completed';
    this.http.patch<LabTest>(`http://localhost:3000/labTests/${test.id}`, { status: nextStatus }).subscribe({
      next: () => {
        this.snackBar.open(`Test marked as ${nextStatus}`, 'Close', { duration: 2000, panelClass: ['bg-emerald-600', 'text-white'] });
        this.loadTests();
      },
      error: () => this.snackBar.open('Failed to update test status', 'Close', { duration: 3000 })
    });
  }

  openNewTestModal() {
    this.testForm.reset();
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitTestOrder() {
    if (this.testForm.invalid) {
      this.testForm.markAllAsTouched();
      return;
    }
    const newTest = {
      ...this.testForm.value,
      id: `LT-${Date.now().toString().slice(-5)}`,
      status: 'Pending' as const,
      orderedDate: new Date().toISOString().split('T')[0]
    };
    this.http.post('http://localhost:3000/labTests', newTest).subscribe({
      next: () => {
        this.snackBar.open('Test order placed successfully', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
        this.closeModal();
        this.loadTests();
      },
      error: () => this.snackBar.open('Failed to place test order', 'Close', { duration: 3000 })
    });
  }

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
