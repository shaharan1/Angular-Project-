import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [MatIconModule, MatCardModule],
  template: `
    <div class="p-6 space-y-6">
      <header>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">System Settings</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Configure application preferences and global parameters.</p>
      </header>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <mat-card class="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-500">
              <mat-icon>business</mat-icon>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white">Hospital Info</h3>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Update hospital name, address, and contact details.</p>
          <button class="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">Manage</button>
        </mat-card>

        <mat-card class="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg text-emerald-500">
              <mat-icon>notifications</mat-icon>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white">Notifications</h3>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Configure email, SMS, and push notification triggers.</p>
          <button class="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">Manage</button>
        </mat-card>

        <mat-card class="p-6 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
          <div class="flex items-center gap-4 mb-4">
            <div class="p-3 bg-amber-50 dark:bg-amber-900/30 rounded-lg text-amber-500">
              <mat-icon>security</mat-icon>
            </div>
            <h3 class="font-bold text-slate-900 dark:text-white">Security</h3>
          </div>
          <p class="text-sm text-slate-500 dark:text-slate-400 mb-4">Password policies, session timeouts, and audit logs.</p>
          <button class="w-full py-2 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-sm font-medium transition-colors">Manage</button>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class SettingsComponent {}
