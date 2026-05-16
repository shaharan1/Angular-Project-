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

    // Only Super Admin can see passwords and emails of OTHERS.
    // Users can see their own email but maybe not password? 
    // The requirement says "only super admin can see passwords and email of every employees".
    // I'll interpret "every employees" as "any employee's data".
    this.canSeeSensitiveData.set(isSuperAdmin || (isOwnProfile && !isAdmin)); 
    // Wait, let's keep it simple: ONLY Super Admin can see sensitive data as requested.
    this.canSeeSensitiveData.set(isSuperAdmin);

    // Only Super Admin and Admin can edit.
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
             // Logic to update current user signal if needed
          }
        },
        error: () => this.toastr.error('Failed to update profile')
      });
    }
  }
}
