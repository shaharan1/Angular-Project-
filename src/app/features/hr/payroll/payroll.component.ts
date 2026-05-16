import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { HrService, Payroll } from '../../../services/hr.service';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-payroll',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatTableModule, MatIconModule, MatButtonModule],
  templateUrl: './payroll.component.html'
})
export class PayrollComponent implements OnInit {
  private hrService = inject(HrService);
  
  payrolls: Payroll[] = [];
  displayedColumns: string[] = ['month', 'employeeId', 'basicSalary', 'allowances', 'deductions', 'netSalary', 'status', 'actions'];

  ngOnInit() {
    this.hrService.getPayrolls().subscribe(data => {
      this.payrolls = data;
    });
  }

  downloadPayslip(payroll: Payroll) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(40);
    doc.text('HOSPITAL ERP', 14, 22);
    
    doc.setFontSize(14);
    doc.text('Payslip for ' + payroll.month, 14, 32);
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text('Employee ID: ' + payroll.employeeId, 14, 40);
    doc.text('Generated Date: ' + new Date(payroll.generatedDate).toLocaleDateString(), 14, 46);

    autoTable(doc, {
      startY: 60,
      head: [['Description', 'Amount (৳)']],
      body: [
        ['Basic Salary', payroll.basicSalary.toString()],
        ['Allowances', payroll.allowances.toString()],
        ['Deductions', payroll.deductions.toString()],
      ],
      theme: 'grid',
      headStyles: { fillColor: [79, 70, 229] } // Indigo 600
    });

    const finalY = (doc as any).lastAutoTable.finalY || 60;
    
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text('Net Salary: ৳' + payroll.netSalary, 14, finalY + 20);
    
    doc.save(`Payslip_${payroll.employeeId}_${payroll.month}.pdf`);
  }

  exportAllPayroll() {
    const doc = new jsPDF();
    
    doc.setFontSize(22);
    doc.text('Monthly Payroll Summary', 14, 22);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    autoTable(doc, {
      startY: 40,
      head: [['Month', 'Employee ID', 'Basic', 'Allowances', 'Deductions', 'Net', 'Status']],
      body: this.payrolls.map(p => [
        p.month,
        p.employeeId,
        `৳${p.basicSalary}`,
        `৳${p.allowances}`,
        `৳${p.deductions}`,
        `৳${p.netSalary}`,
        p.status
      ]),
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('Payroll_Summary_Report.pdf');
  }
}
