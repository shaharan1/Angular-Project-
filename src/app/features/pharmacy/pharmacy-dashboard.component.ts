import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatMenuModule } from '@angular/material/menu';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { InventoryService } from '../../services/inventory';
import { Medicine } from '../../models/inventory';

@Component({
  selector: 'app-pharmacy-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    MatTableModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule, 
    MatInputModule, 
    MatFormFieldModule,
    MatSelectModule,
    MatMenuModule,
    MatSnackBarModule
  ],
  template: `
    <div class="p-6 space-y-6 min-h-screen bg-slate-50 relative">
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 class="text-3xl font-black text-slate-900 tracking-tight">Pharmacy Inventory</h1>
          <p class="text-slate-500 font-medium">Manage medicines, stock levels and prescriptions.</p>
        </div>
        <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !px-6 !py-5 !font-bold shadow-lg shadow-indigo-100" (click)="openAddModal()">
          <mat-icon class="mr-2">add</mat-icon> Add Medicine
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <mat-card class="!rounded-3xl !shadow-sm border border-slate-100">
          <mat-card-content class="!p-6 flex items-center gap-4">
            <div class="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <mat-icon class="text-3xl">medication</mat-icon>
            </div>
            <div>
              <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Total Items</p>
              <h3 class="text-2xl font-black text-slate-800">{{ medicines().length }}</h3>
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
              <h3 class="text-2xl font-black text-slate-800">{{ lowStockCount() }}</h3>
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
              <h3 class="text-2xl font-black text-slate-800">{{ expiringCount() }}</h3>
            </div>
          </mat-card-content>
        </mat-card>
      </div>

      <mat-card class="!rounded-[2rem] shadow-xl border-none overflow-hidden bg-white">
        <div class="p-8 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between gap-4">
          <mat-form-field appearance="outline" class="w-full md:w-96 custom-search">
            <mat-label>Search Medicine</mat-label>
            <input matInput [formControl]="searchControl" placeholder="e.g. Paracetamol">
            <mat-icon matPrefix class="text-slate-400 mr-2">search</mat-icon>
          </mat-form-field>
        </div>
        <mat-card-content class="!p-0">
          <div class="overflow-x-auto">
            <table mat-table [dataSource]="filteredMedicines()" class="w-full">
              <ng-container matColumnDef="name">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Medicine Name </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <p class="font-black text-slate-800">{{m.name}}</p>
                  <p class="text-[10px] text-slate-400 uppercase font-bold">{{m.genericName}} • {{m.category}}</p>
                </td>
              </ng-container>

              <ng-container matColumnDef="stock">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Stock Level </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <div class="flex items-center gap-2">
                    <div class="w-20 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div [class]="'h-full ' + (m.stock < 100 ? 'bg-amber-500' : 'bg-emerald-500')" [style.width]="(m.stock > 500 ? 100 : (m.stock/500 * 100)) + '%'"></div>
                    </div>
                    <span class="text-xs font-black text-slate-600">{{m.stock}} units ({{m.unit}})</span>
                  </div>
                </td>
              </ng-container>

              <ng-container matColumnDef="expiry">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black"> Expiry Date </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6">
                  <span [class]="'px-3 py-1 rounded-lg text-[10px] font-black uppercase ' + (isExpiring(m.expiryDate) ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500')">
                    {{m.expiryDate}}
                  </span>
                </td>
              </ng-container>

              <ng-container matColumnDef="price">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black text-right"> Price </th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6 text-right">
                  <span class="font-black text-indigo-600 text-[16px]">৳{{m.price | number:'1.2-2'}}</span>
                </td>
              </ng-container>

              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef class="!px-8 !py-6 !text-slate-400 !uppercase !text-[10px] !tracking-widest !font-black text-right"></th>
                <td mat-cell *matCellDef="let m" class="!px-8 !py-6 text-right">
                  <button mat-icon-button [matMenuTriggerFor]="itemMenu" class="text-slate-400 hover:text-slate-600">
                    <mat-icon>more_vert</mat-icon>
                  </button>
                  <mat-menu #itemMenu="matMenu" class="!rounded-2xl !p-2 !shadow-xl border border-slate-100">
                    <button mat-menu-item (click)="openEditModal(m)" class="!rounded-xl">
                      <mat-icon class="text-indigo-600">edit</mat-icon>
                      <span>Edit details</span>
                    </button>
                    <button mat-menu-item (click)="quickAdjustStock(m)" class="!rounded-xl">
                      <mat-icon class="text-emerald-500">add_shopping_cart</mat-icon>
                      <span>Add Stock (+100)</span>
                    </button>
                    <div class="border-t border-slate-100 my-1"></div>
                    <button mat-menu-item (click)="deleteMedicine(m)" class="!rounded-xl hover:bg-red-50 !text-red-500">
                      <mat-icon class="!text-red-500">delete</mat-icon>
                      <span class="font-bold">Delete Medicine</span>
                    </button>
                  </mat-menu>
                </td>
              </ng-container>

              <tr mat-header-row *matHeaderRowDef="['name', 'stock', 'expiry', 'price', 'actions']"></tr>
              <tr mat-row *matRowDef="let row; columns: ['name', 'stock', 'expiry', 'price', 'actions'];" class="hover:bg-slate-50/50 transition-colors border-b border-slate-50"></tr>
            </table>
          </div>
        </mat-card-content>
      </mat-card>

      <!-- Overlay CRUD Modal -->
      <div *ngIf="showModal()" class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[999] flex items-center justify-center p-4">
        <mat-card class="w-full max-w-lg !rounded-[2rem] border border-white/50 !shadow-2xl overflow-hidden animate-in">
          <div class="p-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
            <div>
              <h3 class="text-xl font-black text-slate-800">{{ isEditing() ? 'Edit Medicine Details' : 'Add New Medicine' }}</h3>
              <p class="text-xs text-slate-400 font-medium mt-0.5">Register new pharmaceutical items to the store inventory.</p>
            </div>
            <button mat-icon-button (click)="closeModal()" class="text-slate-400 hover:text-slate-600">
              <mat-icon>close</mat-icon>
            </button>
          </div>

          <mat-card-content class="!p-6 max-h-[70vh] overflow-y-auto">
            <form [formGroup]="medicineForm" class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Medicine Name</mat-label>
                <input matInput formControlName="name" placeholder="e.g. Paracetamol 500mg">
              </mat-form-field>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Generic Name</mat-label>
                <input matInput formControlName="genericName" placeholder="e.g. Acetaminophen">
              </mat-form-field>

              <div class="grid grid-cols-2 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Category</mat-label>
                  <mat-select formControlName="category">
                    <mat-option value="Antibiotic">Antibiotic</mat-option>
                    <mat-option value="Analgesic">Analgesic</mat-option>
                    <mat-option value="Antipyretic">Antipyretic</mat-option>
                    <mat-option value="Supplements">Supplements</mat-option>
                    <mat-option value="Others">Others</mat-option>
                  </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Unit Type</mat-label>
                  <mat-select formControlName="unit">
                    <mat-option value="Tablet">Tablet</mat-option>
                    <mat-option value="Capsule">Capsule</mat-option>
                    <mat-option value="Syrup">Syrup</mat-option>
                    <mat-option value="Suspension">Suspension</mat-option>
                    <mat-option value="Injection">Injection</mat-option>
                  </mat-select>
                </mat-form-field>
              </div>

              <div class="grid grid-cols-3 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Stock</mat-label>
                  <input type="number" matInput formControlName="stock">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Price (৳)</mat-label>
                  <input type="number" step="0.01" matInput formControlName="price">
                </mat-form-field>

                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>Expiry Date</mat-label>
                  <input matInput formControlName="expiryDate" placeholder="YYYY-MM-DD">
                </mat-form-field>
              </div>

              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Manufacturer</mat-label>
                <input matInput formControlName="manufacturer" placeholder="e.g. HealthMed">
              </mat-form-field>
            </form>
          </mat-card-content>

          <div class="p-6 bg-slate-50 border-t border-slate-100 flex gap-3 justify-end">
            <button mat-button class="!rounded-xl" (click)="closeModal()">Cancel</button>
            <button mat-flat-button class="!bg-indigo-600 !text-white !rounded-xl !font-bold" (click)="saveMedicine()">
              {{ isEditing() ? 'Save Changes' : 'Register Medicine' }}
            </button>
          </div>
        </mat-card>
      </div>
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
  private inventoryService = inject(InventoryService);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  medicines = signal<Medicine[]>([]);
  searchControl = new FormControl('');
  searchQuery = signal<string>('');

  showModal = signal<boolean>(false);
  isEditing = signal<boolean>(false);
  currentMedicineId = signal<string | null>(null);
  medicineForm!: FormGroup;

  lowStockCount = computed(() => this.medicines().filter(m => m.stock < 100).length);
  expiringCount = computed(() => this.medicines().filter(m => this.isExpiring(m.expiryDate)).length);

  filteredMedicines = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.medicines();
    return this.medicines().filter(m => 
      m.name.toLowerCase().includes(query) || 
      m.genericName.toLowerCase().includes(query) ||
      m.category.toLowerCase().includes(query)
    );
  });

  ngOnInit() {
    this.initForm();
    this.loadMedicines();
    
    this.searchControl.valueChanges.subscribe(val => {
      this.searchQuery.set(val || '');
    });
  }

  private initForm() {
    this.medicineForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      genericName: ['', Validators.required],
      category: ['Others', Validators.required],
      stock: [100, [Validators.required, Validators.min(0)]],
      unit: ['Tablet', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      expiryDate: ['', Validators.required],
      manufacturer: ['', Validators.required]
    });
  }

  loadMedicines() {
    this.inventoryService.getMedicines().subscribe({
      next: (data) => this.medicines.set(data),
      error: () => this.snackBar.open('Failed to load medicines from pharmacy backend', 'Close', { duration: 3000 })
    });
  }

  isExpiring(date: string): boolean {
    return new Date(date) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000); // Less than 6 months
  }

  openAddModal() {
    this.isEditing.set(false);
    this.currentMedicineId.set(null);
    this.medicineForm.reset({
      category: 'Others',
      unit: 'Tablet',
      stock: 100,
      price: 5.00
    });
    this.showModal.set(true);
  }

  openEditModal(med: Medicine) {
    this.isEditing.set(true);
    this.currentMedicineId.set(med.id);
    this.medicineForm.patchValue({
      name: med.name,
      genericName: med.genericName,
      category: med.category,
      stock: med.stock,
      unit: med.unit,
      price: med.price,
      expiryDate: med.expiryDate,
      manufacturer: med.manufacturer
    });
    this.showModal.set(true);
  }

  closeModal() {
    this.showModal.set(false);
  }

  saveMedicine() {
    if (this.medicineForm.invalid) {
      this.medicineForm.markAllAsTouched();
      return;
    }

    const formValue = this.medicineForm.value;
    const status = formValue.stock === 0 ? 'Out of Stock' : (formValue.stock < 100 ? 'Low Stock' : 'Available');

    if (this.isEditing() && this.currentMedicineId()) {
      const id = this.currentMedicineId()!;
      this.inventoryService.updateMedicine(id, { ...formValue, status }).subscribe({
        next: () => {
          this.snackBar.open('Medicine record updated', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
          this.closeModal();
          this.loadMedicines();
        }
      });
    } else {
      const newMed: Medicine = {
        ...formValue,
        id: `MED-${Date.now().toString().slice(-4)}`,
        status
      };
      this.inventoryService.addMedicine(newMed).subscribe({
        next: () => {
          this.snackBar.open('New medicine registered successfully', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
          this.closeModal();
          this.loadMedicines();
        }
      });
    }
  }

  quickAdjustStock(med: Medicine) {
    const newStock = med.stock + 100;
    const status = newStock < 100 ? 'Low Stock' : 'Available';
    this.inventoryService.updateMedicine(med.id, { stock: newStock, status }).subscribe({
      next: () => {
        this.snackBar.open(`Added 100 units to ${med.name}`, 'Close', { duration: 2000, panelClass: ['bg-emerald-600', 'text-white'] });
        this.loadMedicines();
      }
    });
  }

  deleteMedicine(med: Medicine) {
    if (confirm(`Are you sure you want to remove ${med.name} from the pharmacy store?`)) {
      this.inventoryService.deleteMedicine(med.id).subscribe({
        next: () => {
          this.snackBar.open('Medicine removed from store', 'Close', { duration: 3000, panelClass: ['bg-emerald-600', 'text-white'] });
          this.loadMedicines();
        }
      });
    }
  }
}
