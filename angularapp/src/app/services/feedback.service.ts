import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Feedback } from '../models/feedback.model';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  private apiUrl = 'http://localhost:8080';
  // private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllFeedbacks(): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/feedback`, {
      headers: this.getHeaders()
    });
  }

  getFeedbacksByUserId(userId: number): Observable<Feedback[]> {
    return this.http.get<Feedback[]>(`${this.apiUrl}/api/feedback/${userId}`, {
      headers: this.getHeaders()
    });
  }

  addFeedback(feedback: { userId: number; feedbackText: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/feedback`, feedback, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  deleteFeedback(feedbackId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/feedback/${feedbackId}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }
}