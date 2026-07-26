import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { User } from '../models/user.model';
import { LoginModel } from '../models/login.model';
import {
  EmailRequest,
  ResetPasswordRequest
} from '../models/email-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl =
    'http://localhost:8080';

  constructor(private http: HttpClient) { }

  // Registration

  register(user: User): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/register`,
      user
    );
  }

  verifyRegistration(
    email: string,
    otp: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/verify-registration`,
      {
        email,
        otp
      }
    );
  }

  // Login

  login(credentials: LoginModel): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/login`,
      credentials
    ).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem(
            'token',
            res.token
          );
        }
      })
    );
  }

  // Forgot Password

  forgotPassword(
    request: EmailRequest
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/account/forgot-password`,
      request
    );
  }

  verifyResetOtp(
    email: string,
    otp: string
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/account/verify-reset-otp`,
      {
        email,
        otp
      }
    );
  }

  resetPassword(
    request: ResetPasswordRequest
  ): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/api/account/reset-password`,
      request
    );
  }

  // Logout

  logout(): void {
    localStorage.removeItem('token');
  }

  // Token Helpers

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUserRole(): string | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload[
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
      ] || null;

    } catch {
      return null;
    }
  }

  getUserId(): number | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload['UserId']
        ? parseInt(payload['UserId'], 10)
        : null;

    } catch {
      return null;
    }
  }

  getUsername(): string | null {

    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {

      const payload = JSON.parse(
        atob(token.split('.')[1])
      );

      return payload[
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'
      ] || null;

    } catch {
      return null;
    }
  }
}
