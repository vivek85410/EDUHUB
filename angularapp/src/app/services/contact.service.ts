import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ContactQuery } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  submitContact(query: ContactQuery): Observable<any> {
    return this.http.post(`${this.apiUrl}/api/contact`, query, {
      responseType: 'text'
    });
  }
}
