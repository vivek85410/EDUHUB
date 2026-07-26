import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/api/user/profile`, {
      headers: this.getHeaders()
    });
  }

  updateProfile(user: Partial<User>): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/user/profile`, user, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  deleteProfile(): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/user/profile`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  uploadProfilePicture(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('File', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/api/user/profile-picture`, formData, {
      headers: this.getHeaders()
    });
  }
}