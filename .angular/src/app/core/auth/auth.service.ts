import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, of, throwError } from 'rxjs';
import { tap, catchError, delay, map } from 'rxjs/operators';
import { User } from '../models/user.model';
import { TokenService } from './token.service';
import { SessionTimeoutService } from './session-timeout.service';
import { AppRole } from '../models/role.model';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../../environments/environment';

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

  private readonly API_URL = `${environment.apiUrl}/users`;

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
        // Just ensure state is clean without redirecting
        this.tokenService.clearTokens();
        this.updateUserState(null);
      }
    }
  }

  public updateCurrentUser(user: User) {
    this.updateUserState(user);
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
    return this.http.get<User[]>(this.API_URL, {
      params: {
        email: credentials.email,
        password: credentials.password
      }
    }).pipe(
      map(users => {
        if (users && users.length > 0) {
          const user = users[0];
          return {
            token: 'fake-jwt-token-123',
            refreshToken: 'fake-refresh-token-456',
            user: user
          };
        }
        throw new Error('Invalid credentials');
      }),
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
}
