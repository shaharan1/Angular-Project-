import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { Router } from '@angular/router';
import { PatientService } from '../../../../services/patient';
import { BillingService } from '../../services/billing.service';
import { InvoiceStatus } from '../../core/models/billing.model';
import { Patient } from '../../../../core/models/patient.model';
import { Observable, startWith, map, of } from 'rxjs';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule,
    MatNativeDateModule, MatSelectModule, MatAutocompleteModule
  ],
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private billingService = inject(BillingService);

  invoiceForm!: FormGroup;
  patients: Patient[] = [];
  filteredPatients!: Observable<Patient[]>;

  ngOnInit() {
    this.initForm();
    this.loadPatients();
  }

  private initForm() {
    this.invoiceForm = this.fb.group({
      patientId: ['', Validators.required],
      date: [new Date(), Validators.required],
      dueDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required], // 1 week due
      items: this.fb.array([this.createItem()]),
      subTotal: [0],
      tax: [10],
      totalAmount: [0],
      status: ['Pending']
    });

    this.invoiceForm.valueChanges.subscribe(() => {
      this.calculateTotals();
    });
  }

  private loadPatients() {
    this.patientService.getPatients().subscribe(data => {
      this.patients = data;
      this.setupPatientFilter();
    });
  }

  private setupPatientFilter() {
    this.filteredPatients = this.invoiceForm.get('patientId')!.valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : ''),
      map(name => name ? this._filterPatients(name) : this.patients.slice())
    );
  }

  private _filterPatients(value: string): Patient[] {
    const filterValue = value.toLowerCase();
    return this.patients.filter(p =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(filterValue) ||
      p.patientId.toLowerCase().includes(filterValue)
    );
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  createItem(): FormGroup {
    return this.fb.group({
      description: ['', Validators.required],
      quantity: [1, [Validators.required, Validators.min(1)]],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      total: [0]
    });
  }

  addItem() {
    this.items.push(this.createItem());
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.removeAt(index);
    }
  }

  calculateTotals() {
    let subTotal = 0;
    this.items.controls.forEach(control => {
      const quantity = Number(control.get('quantity')?.value) || 0;
      const unitPrice = Number(control.get('unitPrice')?.value) || 0;
      const total = quantity * unitPrice;
      control.get('total')?.setValue(total, { emitEvent: false });
      subTotal += total;
    });

    const taxRate = Number(this.invoiceForm.get('tax')?.value) || 0;
    const taxAmount = subTotal * (taxRate / 100);
    const totalAmount = subTotal + taxAmount;

    this.invoiceForm.patchValue({
      subTotal,
      totalAmount
    }, { emitEvent: false });
  }

  onPatientSelected(patient: Patient) {
    this.invoiceForm.patchValue({
      patientId: patient.patientId
    }, { emitEvent: false });
  }

  saveInvoice() {
    if (this.invoiceForm.valid) {
      const formValue = this.invoiceForm.value;
      const invoice = {
        patientId: formValue.patientId,
        date: formValue.date,
        dueDate: formValue.dueDate,
        items: this.items.controls.map(control => ({
          description: control.get('description')?.value || '',
          amount: (control.get('quantity')?.value || 0) * (control.get('unitPrice')?.value || 0)
        })),
        totalAmount: this.invoiceForm.get('totalAmount')?.value || 0,
        status: formValue.status as InvoiceStatus
      };

      this.billingService.createInvoice(invoice).subscribe({
        next: () => {
          console.log('Invoice saved:', invoice);
          this.router.navigate(['/billing/dashboard']);
        },
        error: () => {
          console.error('Failed to save invoice');
          this.invoiceForm.markAllAsTouched();
        }
      });
    } else {
      this.invoiceForm.markAllAsTouched();
    }
  }

  printInvoice() {
    window.print();
  }
}
