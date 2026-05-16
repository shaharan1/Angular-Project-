import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatCardModule, 
    MatButtonModule, 
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-management.html',
  styleUrl: './user-management.css'
})
export class UserManagementComponent implements OnInit {
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  users = signal<any[]>([]);
  displayedColumns: string[] = ['name', 'email', 'role', 'status', 'actions'];

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>('http://localhost:3000/users').subscribe({
      next: (data) => this.users.set(data),
      error: () => {
        console.warn('Backend not reachable for users, using fallback data');
        this.users.set([
          { id: 1, firstName: 'Super', lastName: 'Admin', email: 'admin@mederp.com', role: 'SUPER_ADMIN', status: 'Active' },
          { id: 2, firstName: 'John', lastName: 'Doe', email: 'john.doe@mederp.com', role: 'DOCTOR', status: 'Active' },
          { id: 3, firstName: 'Sarah', lastName: 'Smith', email: 'sarah.smith@mederp.com', role: 'NURSE', status: 'Active' },
          { id: 4, firstName: 'Receptionist', lastName: 'User', email: 'reception@mederp.com', role: 'RECEPTIONIST', status: 'Inactive' }
        ]);
      }
    });
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'SUPER_ADMIN': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'ADMIN': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'DOCTOR': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'NURSE': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'USER': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-orange-100 text-orange-700 border-orange-200';
    }
  }
}
