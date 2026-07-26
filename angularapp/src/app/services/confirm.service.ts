import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ConfirmRequest {
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private requestSubject = new BehaviorSubject<ConfirmRequest | null>(null);
  request$ = this.requestSubject.asObservable();

  private resolver: ((result: boolean) => void) | null = null;

  confirm(message: string, title: string = 'Please confirm'): Promise<boolean> {
    this.requestSubject.next({ title, message });
    return new Promise<boolean>(resolve => {
      this.resolver = resolve;
    });
  }

  respond(result: boolean): void {
    this.requestSubject.next(null);
    if (this.resolver) {
      this.resolver(result);
      this.resolver = null;
    }
  }
}
