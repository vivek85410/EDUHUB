import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MockPaymentRequest, MockPaymentResponse } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  mockPay(request: MockPaymentRequest): Observable<MockPaymentResponse> {
    return this.http.post<MockPaymentResponse>(`${this.apiUrl}/api/payment/mock-pay`, request, {
      headers: this.getHeaders()
    });
  }
}
