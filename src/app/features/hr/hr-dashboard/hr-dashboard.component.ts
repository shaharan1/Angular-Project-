import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { HrService, Employee, Department } from '../../../services/hr.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-hr-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule],
  templateUrl: './hr-dashboard.component.html'
})
export class HrDashboardComponent implements OnInit {
  private hrService = inject(HrService);

  employees$ = new BehaviorSubject<Employee[]>([]);
  departments$ = new BehaviorSubject<Department[]>([]);
  totalEmployees = 0;
  activeEmployees = 0;
  totalDepartments = 0;

  ngOnInit() {
    this.hrService.getEmployees().subscribe(data => {
      this.employees$.next(data);
      this.totalEmployees = data.length;
      this.activeEmployees = data.filter(e => e.status === 'Active').length;
    });

    this.hrService.getDepartments().subscribe(data => {
      this.departments$.next(data);
      this.totalDepartments = data.length;
    });
  }
}
