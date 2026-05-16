import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
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
import { environment } from '../../../../../environments/environment';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  private destroyRef = inject(DestroyRef);

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
  profilePicturePreview = signal<string | null>(null);

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

    this.canSeeSensitiveData.set(isSuperAdmin);
    this.canEdit.set(isSuperAdmin || (isAdmin && isOwnProfile) || isOwnProfile); // Allow users to edit their own profile
  }

  loadUserProfile(id: string) {
    this.http.get(`${environment.apiUrl}/users/${id}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (user: any) => {
          this.viewedUser.set(user);
          this.profilePicturePreview.set(user.profilePicture || null);
          this.checkPermissions();
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
      role: [user.role, Validators.required],
      profilePicture: [user.profilePicture]
    });

    if (!this.canEdit()) {
      this.profileForm.disable();
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64String = reader.result as string;
        this.profilePicturePreview.set(base64String);
        this.profileForm.patchValue({ profilePicture: base64String });
      };
      reader.readAsDataURL(file);
    }
  }

  toggleEdit() {
    this.isEditMode.update(v => !v);
    if (this.isEditMode()) {
      this.profileForm.enable();
      // Keep role disabled if not super admin
      if (this.currentUser()?.role !== AppRole.SUPER_ADMIN) {
        this.profileForm.get('role')?.disable();
      }
    } else {
      this.profileForm.disable();
    }
  }

  saveProfile() {
    if (this.profileForm.valid) {
      const updatedData = { ...this.viewedUser(), ...this.profileForm.getRawValue() };
      this.http.put(`${environment.apiUrl}/users/${updatedData.id}`, updatedData)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: () => {
            this.toastr.success('Profile updated successfully');
            this.isEditMode.set(false);
            this.profileForm.disable();
            this.viewedUser.set(updatedData);
            
            // If we edited our own profile, update auth service state
            if (updatedData.id === this.currentUser()?.id) {
               this.authService.updateCurrentUser(updatedData);
            }
          },
          error: () => this.toastr.error('Failed to update profile')
        });
    }
  }
}
