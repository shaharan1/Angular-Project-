import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  isSidebarCollapsed = signal<boolean>(false);
  isDarkMode = signal<boolean>(false);

  toggleSidebar() {
    this.isSidebarCollapsed.update(v => !v);
  }

  toggleDarkMode() {
    this.isDarkMode.update(v => !v);
    if (this.isDarkMode()) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
}
