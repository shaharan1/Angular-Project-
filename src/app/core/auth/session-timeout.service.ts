import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class SessionTimeoutService {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  
  private timeoutId: any;
  private readonly TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

  startSessionTimer() {
    if (isPlatformBrowser(this.platformId)) {
      this.resetTimer();
      this.setupUserActivityListeners();
    }
  }

  stopSessionTimer() {
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.removeUserActivityListeners();
    }
  }

  private resetTimer = () => {
    if (isPlatformBrowser(this.platformId)) {
      if (this.timeoutId) {
        clearTimeout(this.timeoutId);
      }
      this.timeoutId = setTimeout(() => this.handleTimeout(), this.TIMEOUT_MS);
    }
  }

  private handleTimeout() {
    this.stopSessionTimer();
    this.router.navigate(['/login'], { queryParams: { sessionExpired: true } });
  }

  private setupUserActivityListeners() {
    if (isPlatformBrowser(this.platformId)) {
      window.addEventListener('mousemove', this.resetTimer);
      window.addEventListener('keydown', this.resetTimer);
      window.addEventListener('click', this.resetTimer);
    }
  }

  private removeUserActivityListeners() {
    if (isPlatformBrowser(this.platformId)) {
      window.removeEventListener('mousemove', this.resetTimer);
      window.removeEventListener('keydown', this.resetTimer);
      window.removeEventListener('click', this.resetTimer);
    }
  }
}
