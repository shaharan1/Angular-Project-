import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { LayoutService } from '../../services/layout';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatMenuModule, MatBadgeModule],
  template: `
    <header class="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-8 sticky top-0 z-10 transition-colors">
      <div class="flex items-center gap-4 flex-1">
        <div class="relative w-full max-w-md group">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 group-focus-within:text-indigo-500 transition-colors">
            <mat-icon class="!text-lg">search</mat-icon>
          </span>
          <input 
            type="text" 
            class="block w-full pl-10 pr-3 py-2 border border-slate-200 dark:border-slate-800 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:bg-white dark:focus:bg-slate-800 transition-all placeholder:text-slate-400" 
            placeholder="Search for patient, doctor, or record..."
          >
        </div>
      </div>

      <div class="flex items-center space-x-2 md:space-x-4 ml-4">
        <div class="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hidden lg:flex cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Surgery Unit-01</span>
          <mat-icon class="!text-sm text-slate-400 h-auto w-auto">expand_more</mat-icon>
        </div>

        <button mat-icon-button (click)="layout.toggleDarkMode()" class="text-slate-400 hover:text-indigo-500 transition-colors">
          <mat-icon>{{ layout.isDarkMode() ? 'light_mode' : 'dark_mode' }}</mat-icon>
        </button>

        <button mat-icon-button [matMenuTriggerFor]="notificationMenu" class="text-slate-400 hover:text-indigo-500 transition-colors relative">
          <mat-icon>notifications</mat-icon>
          <span class="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border border-white dark:border-slate-900"></span>
        </button>

        <div class="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1"></div>

        <button [matMenuTriggerFor]="userMenu" class="flex items-center space-x-2 p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-left group">
          <img 
            [src]="auth.user()?.avatarUrl" 
            class="h-8 w-8 rounded-full bg-slate-200 group-hover:ring-2 ring-indigo-500 ring-offset-2 ring-offset-white dark:ring-offset-slate-900 transition-all" 
            alt="User avatar"
          >
          <mat-icon class="!text-sm text-slate-400 h-auto w-auto">expand_more</mat-icon>
        </button>
      </div>

      <mat-menu #notificationMenu="matMenu" xPosition="before" class="dark:bg-slate-900">
        <div class="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
          <span class="text-sm font-semibold text-slate-900 dark:text-white">Notifications</span>
        </div>
        <button mat-menu-item>
          <mat-icon class="text-blue-500">info</mat-icon>
          <span class="text-slate-700 dark:text-slate-300">New patient admitted in Ward A</span>
        </button>
        <button mat-menu-item>
          <mat-icon class="text-amber-500">warning</mat-icon>
          <span class="text-slate-700 dark:text-slate-300">Lab report pending for John Doe</span>
        </button>
      </mat-menu>

      <mat-menu #userMenu="matMenu" xPosition="before" class="dark:bg-slate-900">
        <button mat-menu-item>
          <mat-icon class="text-slate-600 dark:text-slate-400">person</mat-icon>
          <span class="text-slate-700 dark:text-slate-300">My Profile</span>
        </button>
        <button mat-menu-item>
          <mat-icon class="text-slate-600 dark:text-slate-400">settings</mat-icon>
          <span class="text-slate-700 dark:text-slate-300">Account Settings</span>
        </button>
        <div class="border-t border-slate-100 dark:border-slate-800 my-1"></div>
        <button mat-menu-item (click)="auth.logout()">
          <mat-icon class="text-red-500">logout</mat-icon>
          <span class="text-red-500">Sign Out</span>
        </button>
      </mat-menu>
    </header>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    .caps { text-transform: capitalize; }
  `]
})
export class Navbar {
  layout = inject(LayoutService);
  auth = inject(AuthService);
}
