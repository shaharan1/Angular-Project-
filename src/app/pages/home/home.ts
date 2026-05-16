import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class HomeComponent {

  @ViewChild('reportContent', { static: false })
  reportContent!: ElementRef;

  benefits = [
    { title: '24/7 Support', description: 'Our team is always available to assist you with your health needs.', icon: 'support_agent' },
    { title: 'Expert Doctors', description: 'Connect with the best specialists in every field of medicine.', icon: 'medical_services' },
    { title: 'Quick Appointments', description: 'Book your appointments in seconds with our dynamic scheduling system.', icon: 'event_available' },
    { title: 'Secure Records', description: 'Your health data is protected with enterprise-grade security.', icon: 'security' }
  ];

  stats = [
    { label: 'Specialized Doctors', value: '150+' },
    { label: 'Happy Patients', value: '25,000+' },
    { label: 'Successful Surgeries', value: '10,000+' },
    { label: 'Departments', value: '25+' }
  ];

  exportPdf() {
    const element = this.reportContent.nativeElement;

    html2canvas(element, { scale: 2 }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');

      const pageWidth = 210;
      const pageHeight = 297;

      const imgWidth = pageWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let position = 10;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);

      pdf.save('home-report.pdf');
    });
  }
}