import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models/enrollment.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private apiUrl = 'http://localhost:8080';
  

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/api/enrollment`, {
      headers: this.getHeaders()
    });
  }

  getEnrollmentById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/api/enrollment/${id}`, {
      headers: this.getHeaders()
    });
  }

  addEnrollment(enrollment: { courseId: number }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/enrollment`, enrollment, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  deleteEnrollment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/enrollment/${id}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  getEnrollmentsByCourseId(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/api/enrollment/course/${courseId}`, {
      headers: this.getHeaders()
    });
  }

  getEnrollmentsByUserId(userId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/api/enrollment/user/${userId}`, {
      headers: this.getHeaders()
    });
  }

  getPendingEnrollments(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/api/enrollment/pending`, {
      headers: this.getHeaders()
    });
  }

  approveEnrollment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/enrollment/approve/${id}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  rejectEnrollment(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/enrollment/reject/${id}`, {}, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}