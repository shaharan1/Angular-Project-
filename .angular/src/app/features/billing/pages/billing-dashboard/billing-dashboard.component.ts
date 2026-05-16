import { Component, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BillingService } from '../../services/billing.service';
import { ToastrService } from 'ngx-toastr';
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
  private toastr = inject(ToastrService);

  // Computed metrics
  totalRevenue = computed(() => {
    return this.billingService.invoicesSignal().reduce((acc, inv) => acc + inv.totalAmount, 0);
  });

  collectedAmount = computed(() => {
    return this.billingService.invoicesSignal()
      .filter(inv => inv.status === 'Paid')
      .reduce((acc, inv) => acc + inv.totalAmount, 0);
  });

  pendingAmount = computed(() => {
    return this.billingService.invoicesSignal()
      .filter(inv => inv.status !== 'Paid')
      .reduce((acc, inv) => acc + inv.totalAmount, 0);
  });

  revenueTrends = [
    { month: 'Jan', value: 120000, color: 'bg-indigo-400' },
    { month: 'Feb', value: 145000, color: 'bg-indigo-500' },
    { month: 'Mar', value: 130000, color: 'bg-indigo-400' },
    { month: 'Apr', value: 180000, color: 'bg-indigo-600' },
    { month: 'May', value: 165000, color: 'bg-indigo-500' },
    { month: 'Jun', value: 210000, color: 'bg-indigo-700' }
  ];

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
    this.toastr.info('Preparing financial report...');
    const doc = new jsPDF();
    const invoices = this.billingService.invoicesSignal();
    
    doc.setFontSize(22);
    doc.text('Financial Statement & Invoices Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
    
    doc.text(`Total Revenue: BDT ${this.totalRevenue()}`, 14, 40);
    doc.text(`Collected: BDT ${this.collectedAmount()}`, 14, 45);
    doc.text(`Pending: BDT ${this.pendingAmount()}`, 14, 50);

    autoTable(doc, {
      startY: 60,
      head: [['Invoice ID', 'Patient ID', 'Date', 'Amount (৳)', 'Status']],
      body: invoices.map(inv => [
        inv.id,
        inv.patientId,
        new Date(inv.date).toLocaleDateString(),
        `৳${inv.totalAmount.toLocaleString()}`,
        inv.status
      ]),
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    });

    doc.save(`Finance_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    this.toastr.success('Report downloaded successfully');
  }
}
