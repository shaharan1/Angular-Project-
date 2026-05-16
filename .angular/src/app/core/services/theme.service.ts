import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  
  // Signal to track the current theme
  darkMode = signal<boolean>(false);

  constructor() {
    this.initializeTheme();
    
    // Effect to apply the theme whenever the signal changes
    effect(() => {
      this.applyTheme(this.darkMode());
    });
  }

  private initializeTheme() {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      this.darkMode.set(savedTheme === 'dark' || (!savedTheme && prefersDark));
    }
  }

  toggleTheme() {
    this.darkMode.update(dark => !dark);
  }

  private applyTheme(isDark: boolean) {
    if (isPlatformBrowser(this.platformId)) {
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
    }
  }
}
