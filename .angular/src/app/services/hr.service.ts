import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  department: string;
  designation: string;
  salary: number;
  status: string;
  joinDate: string;
}

export interface Payroll {
  id: string;
  employeeId: string;
  month: string;
  basicSalary: number;
  allowances: number;
  deductions: number;
  netSalary: number;
  status: string;
  generatedDate: string;
}

export interface Department {
  id: string;
  name: string;
  head: string;
  employeeCount: number;
}

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000';

  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`);
  }

  getPayrolls(): Observable<Payroll[]> {
    return this.http.get<Payroll[]>(`${this.apiUrl}/payrolls`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/departments`);
  }
}
