import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatInputModule, MatButtonModule, MatIconModule],
  template: `
    <div class="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-colors">
      <div class="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col animate-in">
        <div class="bg-slate-900 p-10 text-center border-b border-slate-800">
          <div class="h-14 w-14 bg-indigo-500 rounded-xl mx-auto flex items-center justify-center mb-4 shadow-xl shadow-indigo-500/30">
            <mat-icon class="text-white text-2xl">medical_services</mat-icon>
          </div>
          <h2 class="text-xl font-bold text-white tracking-tight">MedCore HMS</h2>
          <p class="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-medium">Enterprise Health Ecosystem</p>
        </div>

        <div class="p-8 space-y-6">
          <div class="text-center">
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">Professional Access</h3>
            <p class="text-slate-500 dark:text-slate-400 text-sm">Authenticated portal for medical staff</p>
          </div>

          <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Clinical ID / Email</mat-label>
              <input matInput formControlName="email" type="email" placeholder="staff@medcore.com">
              <mat-icon matPrefix class="mr-2 text-slate-400">badge</mat-icon>
            </mat-form-field>

            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Secure Password</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password">
              <mat-icon matPrefix class="mr-2 text-slate-400">lock_open</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button" class="text-slate-400">
                <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
              </button>
            </mat-form-field>

            <button 
              mat-flat-button 
              color="primary" 
              class="w-full !py-7 !rounded-2xl !text-sm !font-bold !tracking-wide shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
              [disabled]="loginForm.invalid || isLoading"
            >
              {{ isLoading ? 'VERIFYING CREDENTIALS...' : 'AUTHENTICATE SESSION' }}
            </button>
          </form>

        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
    ::ng-deep .mat-mdc-form-field { width: 100%; }
    ::ng-deep .mat-mdc-form-field-subscript-wrapper { display: none; }
  `]
})
export class Login {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  hidePassword = true;
  isLoading = false;

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { email, password } = this.loginForm.value;
      this.auth.login(email!, password!).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']);
        },
        error: () => {
          this.isLoading = false;
          alert('Login failed');
        }
      });
    }
  }
}
