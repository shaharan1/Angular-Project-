import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { SessionTimeoutService } from './session-timeout.service';
import { AppRole } from '../models/role.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private sessionTimeoutService = inject(SessionTimeoutService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);

  // Using RxJS Subject for classic subscription
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Using Angular Signals for modern reactive state
  public currentUserSignal = signal<User | null>(null);
  public isAuthenticated = computed(() => !!this.currentUserSignal());

  private readonly API_URL = 'http://localhost:3000/auth'; // Mock JSON server URL

  constructor() {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage() {
    if (isPlatformBrowser(this.platformId)) {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser && this.tokenService.hasValidToken()) {
        const user = JSON.parse(storedUser);
        this.updateUserState(user);
      } else {
        this.logout();
      }
    }
  }

  private updateUserState(user: User | null) {
    this.currentUserSubject.next(user);
    this.currentUserSignal.set(user);
    if (isPlatformBrowser(this.platformId)) {
      if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.sessionTimeoutService.startSessionTimer();
      } else {
        localStorage.removeItem('currentUser');
        this.sessionTimeoutService.stopSessionTimer();
      }
    }
  }

  login(credentials: any): Observable<any> {
    // Mock Login using static mock data based on email instead of actual HTTP request to JSON Server
    // to avoid complex setup during scaffolding.
    
    const role = this.determineRoleFromEmail(credentials.email);
    const seed = credentials.email.split('@')[0];

    return of({
      token: 'fake-jwt-token-123',
      refreshToken: 'fake-refresh-token-456',
      user: {
        id: 'user_1',
        email: credentials.email,
        firstName: credentials.email.split('@')[0],
        lastName: 'User',
        isActive: true,
        role: role,
        avatarUrl: `https://api.dicebear.com/9.x/personas/svg?seed=${seed}&backgroundColor=b6e3f4`
      } as User
    }).pipe(
      delay(800), // simulate network
      tap(response => {
        this.tokenService.saveTokens(response.token, response.refreshToken);
        this.updateUserState(response.user);
      })
    );
  }

  logout() {
    this.tokenService.clearTokens();
    this.updateUserState(null);
    this.router.navigate(['/login']);
  }

  hasRole(allowedRoles: AppRole[]): boolean {
    const user = this.currentUserSignal();
    if (!user || !user.role) return false;
    // Super Admin overrides everything
    if (user.role === AppRole.SUPER_ADMIN) return true;
    return allowedRoles.includes(user.role as AppRole);
  }

  private determineRoleFromEmail(email: string): AppRole {
    if (email.includes('superadmin')) return AppRole.SUPER_ADMIN;
    if (email.includes('doctor')) return AppRole.DOCTOR;
    if (email.includes('nurse')) return AppRole.NURSE;
    if (email.includes('hr')) return AppRole.HR_MANAGER;
    if (email.includes('admin')) return AppRole.ADMIN;
    if (email.includes('reception')) return AppRole.RECEPTIONIST;
    if (email.includes('lab')) return AppRole.LAB_TECHNICIAN;
    if (email.includes('pharmacy')) return AppRole.PHARMACIST;
    if (email.includes('finance')) return AppRole.FINANCE;
    return AppRole.USER;
  }
}
