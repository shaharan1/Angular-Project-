import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../core/auth/auth.service';
import { MenuItem } from '../../core/models/menu.model';
import { AppRole } from '../../core/models/role.model';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule, MatMenuModule, MatDividerModule],
  templateUrl: './admin-layout.component.html'
})
export class AdminLayoutComponent {
  public authService = inject(AuthService);
  
  isSidebarOpen = true;

  // Define the master menu configuration
  private readonly MASTER_MENU: MenuItem[] = [
    { title: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { 
      title: 'Patient Management', icon: 'people', route: '/patients',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.DOCTOR, AppRole.NURSE, AppRole.RECEPTIONIST] 
    },
    { 
      title: 'Clinical Workflow', icon: 'medical_services', route: '/clinical',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.DOCTOR, AppRole.NURSE] 
    },
    { 
      title: 'Appointments', icon: 'event', route: '/appointments',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.RECEPTIONIST, AppRole.DOCTOR] 
    },
    { 
      title: 'Pharmacy', icon: 'medication', route: '/pharmacy',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.PHARMACIST, AppRole.DOCTOR] 
    },
    { 
      title: 'Laboratory', icon: 'science', route: '/laboratory',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.LAB_TECH, AppRole.DOCTOR] 
    },
    { 
      title: 'Billing & Finance', icon: 'receipt_long', route: '/billing',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.ACCOUNTANT] 
    },
    { 
      title: 'HR & Payroll', icon: 'badge', route: '/hr-payroll',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.ADMIN, AppRole.HR_MANAGER] 
    },
    { 
      title: 'Settings', icon: 'settings', route: '/settings',
      allowedRoles: [AppRole.SUPER_ADMIN, AppRole.ADMIN] 
    }
  ];

  // Dynamically compute the menu based on the user's role
  public dynamicMenu = computed(() => {
    return this.MASTER_MENU.filter(item => {
      if (!item.allowedRoles) return true; // Public route (e.g. Dashboard)
      return this.authService.hasRole(item.allowedRoles);
    });
  });

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
  }
}
