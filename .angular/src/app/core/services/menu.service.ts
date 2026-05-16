import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/navigation`;

  getMenuItems(): Observable<NavItem[]> {
    return this.http.get<NavItem[]>(this.API_URL);
  }
}
