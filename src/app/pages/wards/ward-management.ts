import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WardService } from '../../services/ward';
import { Bed } from '../../models/ward';

@Component({
  selector: 'app-ward-management',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <div class="space-y-8 animate-in">
      <header>
        <h2 class="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Ward & Bed Management</h2>
        <p class="text-slate-500 dark:text-slate-400 text-sm mt-1">Real-time occupancy tracking and bed allocation dashboard.</p>
      </header>

      @for (ward of wardService.wards(); track ward.id) {
        <section class="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 shadow-sm">
          <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-500 shadow-sm shadow-indigo-500/10">
                <mat-icon class="text-2xl">meeting_room</mat-icon>
              </div>
              <div>
                <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ward.name}}</h3>
                <p class="text-[10px] text-slate-400 uppercase tracking-[0.2em] font-medium">{{ward.id}} • {{ward.totalBeds}} TOTAL BEDS</p>
              </div>
            </div>
            <div class="flex items-center gap-6">
              <div class="text-right">
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Available</p>
                <p class="text-sm font-bold text-slate-900 dark:text-white mt-0.5">{{ward.availableBeds}} BEDS</p>
                <div class="h-1.5 w-32 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                  <div class="h-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" [style.width.%]="(ward.availableBeds / ward.totalBeds) * 100"></div>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            @for (bed of ward.beds; track bed.id) {
              <div 
                [matTooltip]="bed.patientName ? 'Patient: ' + bed.patientName : bed.status"
                class="relative aspect-square flex flex-col items-center justify-center rounded-xl border-2 transition-all duration-300 group cursor-pointer"
                [class]="getBedClass(bed)"
              >
                <mat-icon class="text-xl mb-1.5 transition-transform group-hover:scale-110">bed</mat-icon>
                <span class="text-[10px] font-bold uppercase tracking-widest opacity-60">{{bed.name}}</span>
                
                @if (bed.status === 'Occupied') {
                  <div class="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-indigo-500 ring-4 ring-indigo-500/10"></div>
                }
                
                <div class="opacity-0 group-hover:opacity-100 absolute inset-0 bg-black/5 dark:bg-white/5 rounded-xl transition-opacity"></div>
              </div>
            }
            <!-- Add Bed Button -->
            <button class="aspect-square flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-slate-300 hover:border-indigo-500 hover:text-indigo-500 hover:bg-indigo-50/30 transition-all group">
              <mat-icon class="transition-transform group-hover:rotate-90">add</mat-icon>
              <span class="text-[9px] font-bold mt-1 uppercase tracking-widest">Add Bed</span>
            </button>
          </div>
        </section>
      }

      <!-- Legend -->
      <div class="flex flex-wrap items-center gap-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 text-[10px] font-bold uppercase tracking-widest text-slate-500">
        <div class="flex items-center gap-2.5"><div class="h-3 w-3 rounded-full bg-white border border-slate-200"></div> Available</div>
        <div class="flex items-center gap-2.5"><div class="h-3 w-3 rounded-full bg-indigo-50 border border-indigo-200"></div> Occupied</div>
        <div class="flex items-center gap-2.5"><div class="h-3 w-3 rounded-full bg-amber-50 border border-amber-200"></div> Cleaning</div>
        <div class="flex items-center gap-2.5"><div class="h-3 w-3 rounded-full bg-red-50 border border-red-200"></div> Maintenance</div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class WardManagement {
  wardService = inject(WardService);

  getBedClass(bed: Bed): string {
    switch(bed.status) {
      case 'Available': return 'bg-white dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-300 hover:border-indigo-400 hover:text-indigo-500 hover:bg-slate-50';
      case 'Occupied': return 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-100 dark:border-indigo-800/50 text-indigo-600 shadow-sm shadow-indigo-500/5';
      case 'Cleaning': return 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-800/50 text-amber-600';
      case 'Maintenance': return 'bg-red-50/50 dark:bg-red-900/10 border-red-100 dark:border-red-800/50 text-red-600';
      default: return 'bg-slate-50 border-slate-100';
    }
  }
}
