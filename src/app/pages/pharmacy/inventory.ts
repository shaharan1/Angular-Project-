import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { InventoryService } from '../../services/inventory';
import { Medicine } from '../../models/inventory';

@Component({
  selector: 'app-inventory',
  standalone: true,
  imports: [MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-2xl font-bold text-slate-800 dark:text-white">Pharmacy Inventory</h2>
          <p class="text-slate-500 text-sm">Monitor stock levels, expiry dates, and medicine availability.</p>
        </div>
        <div class="flex gap-3">
          <button mat-stroked-button class="!rounded-xl"><mat-icon class="mr-2">upload</mat-icon> Bulk Import</button>
          <button mat-flat-button color="primary" class="!rounded-xl">
            <mat-icon class="mr-2">add</mat-icon> Add Medicine
          </button>
        </div>
      </div>

      <div class="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden">
        <table mat-table [dataSource]="medicines()" class="w-full">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Medicine / Generic </th>
            <td mat-cell *matCellDef="let m">
              <p class="text-sm font-semibold text-slate-800 dark:text-slate-200">{{m.name}}</p>
              <p class="text-xs text-slate-400 italic">{{m.genericName}}</p>
            </td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Category </th>
            <td mat-cell *matCellDef="let m">
              <span class="text-xs text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded">
                {{m.category}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="stock">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Stock </th>
            <td mat-cell *matCellDef="let m">
              <p class="text-sm font-bold" [class.text-red-500]="m.stock < 50" [class.text-slate-800]="m.stock >= 50">
                {{m.stock}} <span class="text-[10px] font-normal text-slate-400 uppercase">{{m.unit}}s</span>
              </p>
            </td>
          </ng-container>

          <ng-container matColumnDef="expiry">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Expiry </th>
            <td mat-cell *matCellDef="let m">
              <p class="text-xs text-slate-500">{{m.expiryDate}}</p>
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest"> Status </th>
            <td mat-cell *matCellDef="let m">
              <span [class]="'px-2 py-0.5 rounded text-[10px] font-bold uppercase ' + getStatusClass(m.status)">
                {{m.status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef class="!text-slate-400 !uppercase !text-[10px] !tracking-widest text-right pr-4"> </th>
            <td mat-cell *matCellDef="let m" class="text-right pr-2">
              <button mat-icon-button class="text-slate-400"><mat-icon>inventory_2</mat-icon></button>
              <button mat-icon-button class="text-slate-400"><mat-icon>edit</mat-icon></button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Inventory implements OnInit {
  private inventoryService = inject(InventoryService);
  
  medicines = signal<Medicine[]>([]);
  displayedColumns = ['name', 'category', 'stock', 'expiry', 'status', 'actions'];

  ngOnInit() {
    this.inventoryService.getMedicines().subscribe(data => {
      this.medicines.set(data);
    });
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Available': return 'bg-emerald-50 text-emerald-600';
      case 'Low Stock': return 'bg-amber-50 text-amber-600';
      case 'Out of Stock': return 'bg-red-50 text-red-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  }
}
