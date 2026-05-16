import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap, catchError, delay } from 'rxjs/operators';
import { PayrollRecord } from '../core/models/hr.model';

@Injectable({
  providedIn: 'root'
})
export class HrService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000';

  public payrollSignal = signal<PayrollRecord[]>([]);
  public loadingSignal = signal<boolean>(false);

  getAllPayrollRecords(): Observable<PayrollRecord[]> {
    this.loadingSignal.set(true);
    return this.http.get<PayrollRecord[]>(`${this.API_URL}/payroll`).pipe(
      delay(400),
      tap(records => {
        this.payrollSignal.set(records);
        this.loadingSignal.set(false);
      }),
      catchError(() => {
        this.loadingSignal.set(false);
        return of([]);
      })
    );
  }
}
