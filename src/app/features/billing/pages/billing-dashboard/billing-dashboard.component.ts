import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BillingService } from '../../services/billing.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-billing-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './billing-dashboard.component.html'
})
export class BillingDashboardComponent implements OnInit {
  public billingService = inject(BillingService);

  ngOnInit() {
    this.billingService.getAllInvoices().subscribe();
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300';
      case 'Pending': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300';
      case 'Overdue': return 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300';
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400';
    }
  }

  exportInvoices() {
    const doc = new jsPDF();
    const invoices = this.billingService.invoicesSignal();
    
    doc.setFontSize(22);
    doc.text('Billing & Invoices Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Invoice ID', 'Patient ID', 'Date', 'Amount (৳)', 'Status']],
      body: invoices.map(inv => [
        inv.id,
        inv.patientId,
        new Date(inv.date).toLocaleDateString(),
        `৳${inv.totalAmount}`,
        inv.status
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('Billing_Report.pdf');
  }
}
