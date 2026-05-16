import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar';
import { Navbar } from './navbar';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, Sidebar, Navbar],
  template: `
    <div class="flex h-screen bg-slate-50 dark:bg-slate-950 transition-colors overflow-hidden">
      <app-sidebar></app-sidebar>
      
      <div class="flex-1 flex flex-col overflow-hidden relative">
        <app-navbar></app-navbar>
        
        <main class="flex-1 overflow-y-auto p-6 md:p-8">
          <div class="max-w-7xl mx-auto">
            <router-outlet></router-outlet>
          </div>
        </main>

        <!-- Footer / Feedback Layer -->
        <footer class="px-6 py-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs text-slate-400 flex justify-between">
          <span>&copy; 2026 MediSphere Enterprise HMS</span>
          <span class="flex items-center">
            <span class="h-2 w-2 rounded-full bg-emerald-500 mr-2"></span>
            System Live
          </span>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100vh; }
  `]
})
export class MainLayout {}
