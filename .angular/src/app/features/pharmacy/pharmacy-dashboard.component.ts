import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-pharmacy-dashboard',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule, MatButtonModule, MatIconModule, MatInputModule, MatFormFieldModule],
  template: `
    <div class="p-6 space-y-6">
      <div class="flex justify-between items-center">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Inventory</h1>
          <p class="text-slate-500 font-medium">Manage medicines, stock levels and prescriptions.</p>
        </div>
        <div class="flex gap-3">
          <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !px-6 !py-6 !font-bold shadow-lg shadow-indigo-100">
            <mat-icon class="mr-2">add</mat-icon> Add Medicine
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <mat-card class="!rounded-3xl !shadow-sm border border-slate-100">
          <mat-card-content class="!p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <mat-icon class="text-3xl">medication</mat-icon>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Total Items</p>
              <h3 class="text-2xl font-black text-slate-800">1,452</h3>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="!rounded-3xl !shadow-sm border border-slate-100">
          <mat-card-content class="!p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
              <mat-icon class="text-3xl">warning</mat-icon>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Low Stock</p>
              <h3 class="text-2xl font-black text-slate-800">12</h3>
            </div>
          </mat-card-content>
        </mat-card>
        <mat-card class="!rounded-3xl !shadow-sm border border-slate-100">
          <mat-card-content class="!p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600">
              <mat-icon class="text-3xl">event_busy</mat-icon>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Expiring Soon</p>
              <h3 class="text-2xl font-black text-slate-800">8</h3>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="!rounded-[2rem] shadow-xl border-none overflow-hidden">
        <div class="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <mat-form-field appearance="outline" class="w-full md:w-96 custom-search">
            <mat-label>Search Medicine</mat-label>
            <input matInput placeholder="e.g. Paracetamol">
            <mat-icon matPrefix class="text-slate-400 mr-2">search</mat-icon>
          </mat-form-field>
          <div class="flex gap-2">
            <button mat-stroked-button class="!rounded-xl !px-4 !py-5 border-slate-200">
              <mat-icon class="mr-2">filter_list</mat-icon> Filter
            </button>
          </div>
        </div>
        <mat-card-content class="!p-0">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="inventory()" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Medicine Name </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <p class="font-black text-slate-800">{{m.name}}</p>
                  <p class="text-[10px] text-slate-400 uppercase font-bold">{{m.category}}</p>
                </td>
              </ng-container>

              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Stock Level </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <div class="flex items-center gap-2">
                    <div class="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div [class]="'h-full ' + (m.stock < 100 ? 'bg-amber-500' : 'bg-emerald-500')" [style.width]="(m.stock/500 * 100) + '%'"></div>
                    </div>
                    <span class="text-xs font-black text-slate-600">{{m.stock}} units</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="expiry">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Expiry Date </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <span [class]="'px-3 py-1 rounded-lg text-[10px] font-black uppercase ' + (isExpiring(m.expiry) ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500')">
                    {{m.expiry}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black text-right"> Price </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6 text-right">
                  <span class="font-black text-indigo-600 text-lg">৳{{m.price | number:'1.2-2'}}</span>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['name', 'stock', 'expiry', 'price']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['name', 'stock', 'expiry', 'price'];" class="hover:bg-slate-50/50 transition-colors cursor-pointer border-b border-slate-50"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .custom-search ::ng-deep .mdc-text-field--outlined {
      background-color: white !important;
      border-radius: 1rem !important;
    }
  `]
})
export class PharmacyDashboardComponent implements OnInit {
  inventory = signal([
    { name: 'Amoxicillin 500mg', category: 'Antibiotic', stock: 450, expiry: '2025-12-01', price: 12.50 },
    { name: 'Paracetamol 500mg', category: 'Analgesic', stock: 1200, expiry: '2026-05-15', price: 2.00 },
    { name: 'Omeprazole 20mg', category: 'Antacid', stock: 45, expiry: '2024-08-20', price: 8.75 },
    { name: 'Metformin 850mg', category: 'Antidiabetic', stock: 320, expiry: '2025-03-10', price: 5.40 },
    { name: 'Atorvastatin 10mg', category: 'Statin', stock: 180, expiry: '2024-11-25', price: 15.00 }
  ]);

  ngOnInit() {}

  isExpiring(date: string): boolean {
    return new Date(date) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // Less than 6 months
  }
}
