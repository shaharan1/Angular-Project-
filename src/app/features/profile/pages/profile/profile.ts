import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { AppRole } from '../../../../core/models/role.model';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    ReactiveFormsModule, 
    MatCardModule, 
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatIconModule,
    MatSelectModule
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private toastr = inject(ToastrService);

  currentUser = this.authService.currentUserSignal;
  viewedUser = signal<any>(null);
  profileForm!: FormGroup;
  isEditMode = signal(false);
  
  // Roles list for Super Admin to assign
  roles = [
    { code: 'SUPER_ADMIN', name: 'Super Admin' },
    { code: 'ADMIN', name: 'Admin' },
    { code: 'DOCTOR', name: 'Doctor' },
    { code: 'NURSE', name: 'Nurse' },
    { code: 'RECEPTIONIST', name: 'Receptionist' },
    { code: 'LAB_TECHNICIAN', name: 'Lab Technician' },
    { code: 'PHARMACIST', name: 'Pharmacist' },
    { code: 'FINANCE', name: 'Finance' },
    { code: 'HR_MANAGER', name: 'HR Manager' },
    { code: 'USER', name: 'Normal Person' }
  ];

  canSeeSensitiveData = signal(false);
  canEdit = signal(false);

  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id');
    const targetId = userId || this.currentUser()?.id;

    if (targetId) {
      this.loadUserProfile(targetId);
    }

    this.checkPermissions();
  }

  checkPermissions() {
    const currentUser = this.currentUser();
    const viewedUser = this.viewedUser();
    if (!currentUser || !viewedUser) return;

    const isOwnProfile = currentUser.id === viewedUser.id;
    const isSuperAdmin = currentUser.role === AppRole.SUPER_ADMIN;
    const isAdmin = currentUser.role === AppRole.ADMIN;

    // Only Super Admin can see sensitive data
    this.canSeeSensitiveData.set(isSuperAdmin);

    // Super Admin can edit ANY profile. Admin can edit THEIR OWN.
    this.canEdit.set(isSuperAdmin || (isAdmin && isOwnProfile));
  }

  loadUserProfile(id: string) {
    this.http.get(`http://localhost:3000/users/${id}`).subscribe({
      next: (user: any) => {
        this.viewedUser.set(user);
        this.checkPermissions(); // Re-check after data is loaded
        this.initForm(user);
      },
      error: () => this.toastr.error('Failed to load user profile')
    });
  }

  initForm(user: any) {
    this.profileForm = this.fb.group({
      firstName: [user.firstName, Validators.required],
      lastName: [user.lastName, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      password: [user.password, Validators.required],
      role: [user.role, Validators.required]
    });

    if (!this.canEdit()) {
      this.profileForm.disable();
    }
  }

  toggleEdit() {
    this.isEditMode.update(v => !v);
    if (this.isEditMode()) {
      this.profileForm.enable();
    } else {
      this.profileForm.disable();
      // Reset form to original values
      const user = this.viewedUser();
      if (user) {
        this.profileForm.patchValue({
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          password: user.password,
          role: user.role
        });
      }
    }
  }

  onAvatarSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const dataUrl = e.target?.result as string;
        // Update the viewed user with the new avatar
        const user = { ...this.viewedUser(), avatarUrl: dataUrl };
        this.viewedUser.set(user);
      };
      reader.readAsDataURL(file);
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedData = { ...this.viewedUser(), ...this.profileForm.value };
      this.http.put(`http://localhost:3000/users/${updatedData.id}`, updatedData).subscribe({
        next: () => {
          this.toastr.success('Profile updated successfully');
          this.isEditMode.set(false);
          this.profileForm.disable();
          this.viewedUser.set(updatedData);
          
          // If we edited our own profile, update auth service state
          if (updatedData.id === this.currentUser()?.id) {
            // Update localStorage so changes persist
            const storedUser = localStorage.getItem('currentUser');
            if (storedUser) {
              const parsed = JSON.parse(storedUser);
              const merged = { ...parsed, ...updatedData };
              localStorage.setItem('currentUser', JSON.stringify(merged));
            }
          }
        },
        error: () => this.toastr.error('Failed to update profile')
      });
    }
  }

  // Helper methods for role badge styling
  getRoleBadgeClass(role: string | undefined): string {
    const map: Record<string, string> = {
      'SUPER_ADMIN': 'bg-red-500/20 text-red-100 border border-red-400/30',
      'ADMIN': 'bg-purple-500/20 text-purple-100 border border-purple-400/30',
      'DOCTOR': 'bg-emerald-500/20 text-emerald-100 border border-emerald-400/30',
      'NURSE': 'bg-pink-500/20 text-pink-100 border border-pink-400/30',
      'RECEPTIONIST': 'bg-amber-500/20 text-amber-100 border border-amber-400/30',
      'LAB_TECHNICIAN': 'bg-cyan-500/20 text-cyan-100 border border-cyan-400/30',
      'PHARMACIST': 'bg-lime-500/20 text-lime-100 border border-lime-400/30',
      'FINANCE': 'bg-violet-500/20 text-violet-100 border border-violet-400/30',
      'HR_MANAGER': 'bg-orange-500/20 text-orange-100 border border-orange-400/30',
      'USER': 'bg-slate-500/20 text-slate-100 border border-slate-400/30',
    };
    return map[role || ''] || map['USER'];
  }

  getRoleIcon(role: string | undefined): string {
    const map: Record<string, string> = {
      'SUPER_ADMIN': 'shield',
      'ADMIN': 'admin_panel_settings',
      'DOCTOR': 'medical_services',
      'NURSE': 'health_and_safety',
      'RECEPTIONIST': 'support_agent',
      'LAB_TECHNICIAN': 'science',
      'PHARMACIST': 'medication',
      'FINANCE': 'payments',
      'HR_MANAGER': 'badge',
      'USER': 'person',
    };
    return map[role || ''] || 'person';
  }
}
