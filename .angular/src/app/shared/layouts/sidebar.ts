import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LayoutService } from '../../services/layout';
import { AuthService } from '../../core/auth/auth.service';
import { MenuService, NavItem } from '../../core/services/menu.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatTooltipModule],
  template: `
    <aside 
      [class]="'h-screen bg-slate-900 text-white flex flex-col transition-all duration-300 border-r border-slate-800 ' + (layout.isSidebarCollapsed() ? 'w-20' : 'w-64')"
    >
      <div class="p-6 flex items-center gap-3 border-b border-slate-800">
        <div class="h-8 w-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold shrink-0">H+</div>
        @if (!layout.isSidebarCollapsed()) {
          <span class="text-lg font-semibold tracking-tight text-white">MedCore HMS</span>
        }
      </div>

      <nav class="flex-1 overflow-y-auto mt-4 px-3 space-y-1">
        @for (item of navItems(); track item.route) {
          @if (canShow(item)) {
            <a 
              [routerLink]="item.route" 
              routerLinkActive="bg-indigo-600 text-white"
              [routerLinkActiveOptions]="{exact: item.route === '/dashboard'}"
              [matTooltip]="layout.isSidebarCollapsed() ? item.label : ''"
              matTooltipPosition="right"
              class="flex items-center px-3 py-2 rounded-md hover:bg-slate-800 hover:text-white transition-colors group text-sm text-slate-400"
            >
              <mat-icon class="mr-3 text-[20px] w-[20px] h-[20px] group-hover:text-white transition-colors">{{item.icon}}</mat-icon>
              @if (!layout.isSidebarCollapsed()) {
                <span class="font-medium">{{item.label}}</span>
              }
            </a>
          }
        }
      </nav>

      <div class="p-4 border-t border-slate-800">
        <div class="flex items-center gap-3">
          <div class="h-9 w-9 rounded-full bg-slate-700 flex items-center justify-center text-xs font-medium text-white shrink-0">
            {{auth.currentUserSignal()?.firstName?.[0]}}{{auth.currentUserSignal()?.lastName?.[0]}}
          </div>
          @if (!layout.isSidebarCollapsed()) {
            <div class="flex-1 overflow-hidden">
              <p class="text-xs text-white font-medium truncate">{{auth.currentUserSignal()?.firstName}} {{auth.currentUserSignal()?.lastName}}</p>
              <p class="text-[10px] text-slate-400 truncate">{{auth.currentUserSignal()?.role}}</p>
            </div>
          }
          <button 
            mat-icon-button 
            (click)="layout.toggleSidebar()"
            class="text-slate-500 hover:text-white !w-8 !h-8 shrink-0 ml-auto"
          >
            <mat-icon class="!text-lg">{{ layout.isSidebarCollapsed() ? 'chevron_right' : 'chevron_left' }}</mat-icon>
          </button>
        </div>
      </div>
    </aside>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class Sidebar {
  layout = inject(LayoutService);
  auth = inject(AuthService);
  menuService = inject(MenuService);

  navItems = signal<NavItem[]>([]);

  constructor() {
    this.menuService.getMenuItems()
      .pipe(takeUntilDestroyed())
      .subscribe(items => this.navItems.set(items));
  }

  canShow(item: NavItem): boolean {
    if (!item.roles || item.roles.length === 0) return true;
    const user = this.auth.currentUserSignal();
    if (!user || !user.role) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return item.roles.includes(user.role);
  }
}
