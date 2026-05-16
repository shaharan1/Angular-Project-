import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Ward } from '../models/ward';
import { environment } from '../../environments/environment';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WardService {
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/wards`;

  wards = signal<Ward[]>([]);

  constructor() {
    this.loadWards();
  }

  loadWards() {
    this.http.get<Ward[]>(this.API_URL).subscribe(data => {
      this.wards.set(data);
    });
  }

  getWardById(id: string) {
    return this.http.get<Ward>(`${this.API_URL}/${id}`);
  }
}
