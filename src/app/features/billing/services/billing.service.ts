import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { Invoice } from '../core/models/billing.model';

@Injectable({
  providedIn: 'root'
})
export class BillingService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  public invoicesSignal = signal<Invoice[]>([]);
  public loadingSignal = signal<boolean>(false);

  getAllInvoices(): Observable<Invoice[]> {
    this.loadingSignal.set(true);
    return this.http.get<Invoice[]>(`${this.API_URL}/invoices`).pipe(
      delay(500),
      tap(invoices => {
        this.invoicesSignal.set(invoices);
        this.loadingSignal.set(false);
      }),
      catchError(() => {
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }
}
