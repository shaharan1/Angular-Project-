import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HrService, Payroll } from '../../../services/hr.service';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './payroll.component.html'
})
export class PayrollComponent implements OnInit {
  private hrService = inject(HrService);
  private toastr = inject(ToastrService);
  
  payrolls: Payroll[] = [];
  displayedColumns: string[] = ['month', 'employeeId', 'basicSalary', 'allowances', 'deductions', 'netSalary', 'status', 'actions'];
  isProcessing = false;

  ngOnInit() {
    this.loadPayrolls();
  }

  loadPayrolls() {
    this.hrService.getPayrolls().subscribe(data => {
      this.payrolls = data;
    });
  }

  processPayment(payroll: Payroll) {
    if (payroll.status === 'Paid') return;
    
    this.isProcessing = true;
    this.toastr.info(`Processing payment for ${payroll.employeeId}...`, 'Payment Started');
    
    // Simulate payment API call
    setTimeout(() => {
      payroll.status = 'Paid';
      this.toastr.success(`৳${payroll.netSalary.toLocaleString()} paid successfully to ${payroll.employeeId}`, 'Payment Complete');
      this.isProcessing = false;
      
      // Auto-generate payslip after payment
      this.downloadPayslip(payroll);
    }, 2000);
  }

  downloadPayslip(payroll: Payroll) {
    const doc = new jsPDF();
    
    // Header with Logo
    doc.setFillColor(79, 70, 229); // Indigo 600
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFontSize(24);
    doc.setTextColor(255, 255, 255);
    doc.text('MEDERP HOSPITAL', 14, 25);
    
    doc.setFontSize(10);
    doc.text('OFFICIAL SALARY PAYSLIP', 14, 33);
    
    // Details Section
    doc.setTextColor(40, 40, 40);
    doc.setFontSize(12);
    doc.text(`Employee Details`, 14, 55);
    doc.line(14, 57, 60, 57);
    
    doc.setFontSize(10);
    doc.text(`Month: ${payroll.month}`, 14, 65);
    doc.text(`Employee ID: ${payroll.employeeId}`, 14, 71);
    doc.text(`Payment Date: ${new Date().toLocaleDateString()}`, 14, 77);
    doc.text(`Status: ${payroll.status.toUpperCase()}`, 14, 83);

    // Financial Table
    autoTable(doc, {
      startY: 95,
      head: [['Salary Component', 'Amount (৳)']],
      body: [
        ['Basic Salary', `৳${payroll.basicSalary.toLocaleString()}`],
        ['Allowances', `৳${payroll.allowances.toLocaleString()}`],
        ['Deductions', `৳${payroll.deductions.toLocaleString()}`],
        [{ content: 'Net Salary Paid', styles: { fontStyle: 'bold', fillColor: [243, 244, 246] } }, 
         { content: `৳${payroll.netSalary.toLocaleString()}`, styles: { fontStyle: 'bold', fillColor: [243, 244, 246] } }]
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255] },
      margin: { left: 14, right: 14 }
    });

    // Footer
    const finalY = (doc as any).lastAutoTable.finalY || 150;
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('This is a computer-generated document and does not require a signature.', 14, finalY + 20);
    doc.text('For any discrepancies, please contact the HR department.', 14, finalY + 25);
    
    doc.save(`Payslip_${payroll.employeeId}_${payroll.month}.pdf`);
  }

  exportAllPayroll() {
    this.toastr.info('Generating payroll summary report...');
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('Monthly Payroll Summary Report', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Month', 'Employee ID', 'Basic', 'Allowances', 'Deductions', 'Net', 'Status']],
      body: this.payrolls.map(p => [
        p.month,
        p.employeeId,
        `৳${p.basicSalary.toLocaleString()}`,
        `৳${p.allowances.toLocaleString()}`,
        `৳${p.deductions.toLocaleString()}`,
        `৳${p.netSalary.toLocaleString()}`,
        p.status
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save(`Payroll_Report_${new Date().toISOString().split('T')[0]}.pdf`);
    this.toastr.success('Summary report exported successfully');
  }
}
