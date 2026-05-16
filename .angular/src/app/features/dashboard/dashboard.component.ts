import { Component, inject, OnInit, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PatientService } from '../../services/patient';
import { ClinicalService } from '../clinical/services/clinical.service';
import { WardService } from '../../services/ward';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private patientService = inject(PatientService);
  public clinicalService = inject(ClinicalService);
  private wardService = inject(WardService);
  private toastr = inject(ToastrService);

  @ViewChild('reportTarget') reportTarget!: ElementRef;

  totalPatients = signal(0);
  
  availableBeds = computed(() => {
    return this.wardService.wards().reduce((acc, ward) => acc + ward.availableBeds, 0);
  });

  kpiData = computed(() => [
    { title: 'Total Patients', value: this.totalPatients().toLocaleString(), icon: 'people', color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { title: 'Available Beds', value: this.availableBeds().toString(), icon: 'bed', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
    { title: 'Appointments Today', value: this.clinicalService.todayAppointmentsSignal().length.toString(), icon: 'event', color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { title: 'Revenue (Today)', value: '৳12,450', icon: 'payments', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-50 dark:bg-rose-900/20' }
  ]);

  chartData = computed(() => [
    { label: 'Mon', value: 45, color: 'bg-blue-500' },
    { label: 'Tue', value: 52, color: 'bg-blue-500' },
    { label: 'Wed', value: 38, color: 'bg-blue-500' },
    { label: 'Thu', value: 65, color: 'bg-indigo-600' },
    { label: 'Fri', value: 48, color: 'bg-blue-500' },
    { label: 'Sat', value: 30, color: 'bg-blue-500' },
    { label: 'Sun', value: 25, color: 'bg-blue-500' }
  ]);

  ngOnInit() {
    this.patientService.getPatients().subscribe(data => {
      this.totalPatients.set(data.length);
    });
    
    this.clinicalService.getDoctorAppointments('', new Date().toISOString().split('T')[0]).subscribe();
  }

  async exportToPDF() {
    if (!this.reportTarget) {
      this.toastr.error('Report target not found');
      return;
    }
    
    const element = this.reportTarget.nativeElement;
    this.toastr.info('Generating PDF report...', 'Please wait');
    
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
      pdf.save(`hospital-report-${new Date().toISOString().split('T')[0]}.pdf`);
      this.toastr.success('Report exported successfully!');
    } catch (error) {
      console.error('PDF Generation Error:', error);
      this.toastr.error('Failed to generate report');
    }
  }
}
