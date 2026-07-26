import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Material } from '../models/material.model';

@Injectable({
  providedIn: 'root'
})
export class MaterialService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  getMaterials(): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/api/material`, {
      headers: this.getHeaders()
    });
  }

  getMaterialsByCourseId(courseId: number): Observable<Material[]> {
    return this.http.get<Material[]>(`${this.apiUrl}/api/material/course/${courseId}`, {
      headers: this.getHeaders()
    });
  }

  addMaterial(material: Material): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/material`, material, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  deleteMaterial(materialId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/api/material/${materialId}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    });
  }

  uploadMaterial(formData: FormData): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    return this.http.post(`${this.apiUrl}/api/materialupload`, formData, {
      headers,
      reportProgress: true
    });
  }
}