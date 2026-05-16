import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, UserRole, AuthResponse } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  
  private userSignal = signal<User | null>(null);
  private tokenSignal = signal<string | null>(null);

  user = computed(() => this.userSignal());
  isAuthenticated = computed(() => !!this.userSignal());
  userRole = computed(() => this.userSignal()?.role);

  constructor() {
    this.loadSession();
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Mock login logic
    const mockUser: User = {
      id: 'usr_1',
      email: email,
      firstName: 'Admin',
      lastName: 'User',
      role: UserRole.SUPER_ADMIN,
      permissions: ['*'],
      avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email}`
    };

    const mockResponse: AuthResponse = {
      user: mockUser,
      token: 'mock-jwt-token-' + Math.random().toString(36).substring(7),
      refreshToken: 'mock-refresh-token'
    };

    return of(mockResponse).pipe(
      delay(1000),
      tap(response => {
        this.setSession(response);
      })
    );
  }

  logout() {
    this.userSignal.set(null);
    this.tokenSignal.set(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    this.router.navigate(['/login']);
  }

  private setSession(response: AuthResponse) {
    this.userSignal.set(response.user);
    this.tokenSignal.set(response.token);
    localStorage.setItem('auth_user', JSON.stringify(response.user));
    localStorage.setItem('auth_token', response.token);
  }

  private loadSession() {
    const savedUser = localStorage.getItem('auth_user');
    const savedToken = localStorage.getItem('auth_token');
    if (savedUser && savedToken) {
      try {
        this.userSignal.set(JSON.parse(savedUser));
        this.tokenSignal.set(savedToken);
      } catch (e) {
        this.logout();
      }
    }
  }

  hasPermission(permission: string): boolean {
    const user = this.userSignal();
    if (!user) return false;
    if (user.permissions.includes('*')) return true;
    return user.permissions.includes(permission);
  }
}
