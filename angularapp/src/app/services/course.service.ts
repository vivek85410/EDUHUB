import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  private apiUrl ='http://localhost:8080';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/api/course`, {
      headers: this.getHeaders()
    });
  }

  getMyCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/api/course/my`, {
      headers: this.getHeaders()
    });
  }

  getCourseById(id: number): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/api/course/${id}`, {
      headers: this.getHeaders()
    });
  }

  addCourse(course: Course): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/course`, course, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  updateCourse(id: number, course: Course): Observable<any> {
    return this.http.put(`${this.apiUrl}/api/course/${id}`, course, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/course/${courseId}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  uploadThumbnail(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('File', file);
    return this.http.post<{ url: string }>(`${this.apiUrl}/api/course/upload-thumbnail`, formData, {
      headers: this.getHeaders()
    });
  }
}
