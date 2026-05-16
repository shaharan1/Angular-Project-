import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
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
import { Router, RouterModule } from '@angular/router';
import { PatientService } from '../../../../services/patient';
import { Patient } from '../../../../core/models/patient.model';
import { Observable, startWith, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-invoice-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, 
    MatInputModule, MatButtonModule, MatIconModule, MatDatepickerModule, 
    MatNativeDateModule, MatSelectModule, MatAutocompleteModule
  ],
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private patientService = inject(PatientService);
  private toastr = inject(ToastrService);

  @ViewChild('invoiceTarget') invoiceTarget!: ElementRef;

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
      dueDate: [new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), Validators.required],
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
      const quantity = control.get('quantity')?.value || 0;
      const unitPrice = control.get('unitPrice')?.value || 0;
      const total = quantity * unitPrice;
      control.get('total')?.setValue(total, { emitEvent: false });
      subTotal += total;
    });

    const taxRate = this.invoiceForm.get('tax')?.value || 0;
    const taxAmount = subTotal * (taxRate / 100);
    const totalAmount = subTotal + taxAmount;

    this.invoiceForm.patchValue({
      subTotal: subTotal,
      totalAmount: totalAmount
    }, { emitEvent: false });
  }

  onPatientSelected(patient: Patient) {
    this.invoiceForm.patchValue({
      patientId: patient.patientId
    }, { emitEvent: false });
  }

  async saveInvoice() {
    if (this.invoiceForm.valid) {
      this.toastr.success('Invoice saved successfully');
      
      // Auto-generate PDF on save
      await this.exportToPDF();
      
      this.router.navigate(['/billing/dashboard']);
    } else {
      this.invoiceForm.markAllAsTouched();
      this.toastr.warning('Please fill in all required fields');
    }
  }

  async exportToPDF() {
    const element = this.invoiceTarget.nativeElement;
    this.toastr.info('Generating PDF Bill...', 'Please wait');
    
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${this.invoiceForm.get('patientId')?.value}-${new Date().getTime()}.pdf`);
      this.toastr.success('PDF Bill exported successfully!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      this.toastr.error('Failed to generate PDF Bill');
    }
  }

  printInvoice() {
    window.print();
  }
}
